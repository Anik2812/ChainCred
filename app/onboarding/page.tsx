"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, ChevronRight, Fingerprint, Key, Shield, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRCode from "qrcode"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  'https://zypsytuagcvfguzlkhcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cHN5dHVhZ2N2Zmd1emxraGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjM3MjksImV4cCI6MjA2MDAzOTcyOX0.58hSb5QE0gPq_msEULR5zwO0OCl3FUanlh6qJyEAK28'
)

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [didMethod, setDidMethod] = useState("ethr")
  const [network, setNetwork] = useState("sepolia")
  const [yubikeyVerified, setYubikeyVerified] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<null | 'pending' | 'success' | 'error'>(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [verificationProgress, setVerificationProgress] = useState(100)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout>()
  const channelRef = useRef<any>()
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [did, setDid] = useState<string>("")


  const nextStep = useCallback(async () => {
    if (step < 4) {
      // block continuing if neither YubiKey nor biometric succeeded
      if (
        step === 3 &&
        !yubikeyVerified &&
        verificationStatus !== 'success'
      ) {
        setStatusMessage("Please verify before continuing")
        setVerificationStatus('error')
        return
      }

      // *After* step 3, but *before* rendering step 4, create the DID
      if (step === 3) {
        try {
          const res = await fetch(
            `/api/did/create?method=${didMethod}&network=${network}`
          )
          const json = await res.json()
          if (json.did) {
            setDid(json.did)
          } else {
            throw new Error(JSON.stringify(json))
          }
        } catch (e) {
          console.error("DID creation failed", e)
          setStatusMessage("Failed to mint DID")
          setVerificationStatus('error')
          return
        }
      }

      setStep(step + 1)
    } else {
      window.location.href = "/dashboard"
    }
  }, [step, didMethod, network, yubikeyVerified, verificationStatus])

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const generateNewSession = useCallback(async () => {
    try {
      // ── 1) CLEAN UP ANY PREVIOUS SESSION ─────────────────────────────────────
      if (channelRef.current) channelRef.current.unsubscribe()
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

      // ── 2) NEW SESSION ID & RESET UI STATES ─────────────────────────────────
      const newSessionId =
        Math.random().toString(36).slice(2, 12) +
        Math.random().toString(36).slice(2, 12)
      setSessionId(newSessionId)

      // reset status, progress and countdown
      setVerificationStatus(null)
      setStatusMessage('')
      setVerificationProgress(100)
      setSecondsLeft(60)

      // ── 3) WAIT 2 SECONDS BEFORE SHOWING THE QR & TIMER ───────────────────────
      await new Promise((resolve) => setTimeout(resolve, 900))

      // ── 4) BUILD YOUR QR URL ──────────────────────────────────────────────────
      const url = `${window.location.origin}/auth#session=${newSessionId}`

      // ── 5) DRAW THE QR ON CANVAS ──────────────────────────────────────────────
      if (qrCanvasRef.current) {
        const canvas = qrCanvasRef.current
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = 200
        canvas.height = 200

        await QRCode.toCanvas(canvas, url, {
          width: 200,
          errorCorrectionLevel: 'H',
          margin: 2,
          color: {
            dark: '#4F46E5',  // indigo modules
            light: '#E0E7FF'  // soft lilac background
          }
        })
      }

      // ── 6) PERSIST SESSION IN SUPABASE ────────────────────────────────────────
      await supabase.from('sessions').delete().eq('session_id', newSessionId)
      await supabase.from('sessions').insert({
        session_id: newSessionId,
        verified: false
      })

      // ── 7) START A PRECISE 60 s COUNTDOWN ────────────────────────────────────
      const startTs = Date.now()
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTs) / 1000
        const pct = Math.max(0, ((60 - elapsed) / 60) * 100)
        setVerificationProgress(pct)
        setSecondsLeft(Math.max(0, Math.ceil(60 - elapsed)))

        if (elapsed >= 60) {
          clearInterval(progressIntervalRef.current!)
          setStatusMessage('Session expired — generating new QR…')
          generateNewSession() // 🔁 start over
        }
      }, 250)

      // ── 8) SUBSCRIBE FOR REAL‑TIME VERIFICATION ───────────────────────────────
      channelRef.current = supabase
        .channel(`session-${newSessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sessions',
            filter: `session_id=eq.${newSessionId}`
          },
          (payload: any) => {
            if (payload.new?.verified) {
              clearInterval(progressIntervalRef.current!)
              setVerificationStatus('success')
              setStatusMessage('Biometric verification successful!')
              setTimeout(() => nextStep(), 1000)
            }
          }
        )
        .subscribe()
    } catch (error) {
      console.error('Session error:', error)
      setVerificationStatus('error')
      setStatusMessage('Failed to generate QR code')

      // fallback drawing
      if (qrCanvasRef.current) {
        const canvas = qrCanvasRef.current
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.fillText('QR error', canvas.width / 2, canvas.height / 2)
      }
    }
  }, [nextStep])


  useEffect(() => {
    if (step === 3) {
      generateNewSession()
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (channelRef.current) channelRef.current.unsubscribe()
    }
  }, [step])

  const verifyYubiKey = async () => {
    setVerificationStatus('pending')
    setStatusMessage("Please insert your YubiKey and touch the sensor...")

    try {
      if (!window.PublicKeyCredential) {
        setVerificationStatus('error')
        setStatusMessage("Browser doesn't support WebAuthn")
        return
      }

      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const credentialCreationOptions = {
        publicKey: {
          challenge,
          rp: { name: "DID YubiKey Verification", id: window.location.hostname },
          user: { id: new Uint8Array([1, 2, 3, 4]), name: "did-user", displayName: "DID User" },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          timeout: 60000,
          attestation: "direct"
        }
      }

      try {
        const credential = await navigator.credentials.create(credentialCreationOptions as any)
        const verificationOptions = {
          publicKey: {
            challenge,
            timeout: 60000,
            rpId: window.location.hostname,
            userVerification: 'preferred',
            allowCredentials: [{
              type: 'public-key',
              id: (credential as any).rawId,
              transports: ['usb', 'nfc', 'ble']
            }]
          }
        }
        await navigator.credentials.get(verificationOptions as any)
      } catch {
        const fallbackOptions = {
          publicKey: {
            challenge,
            timeout: 60000,
            rpId: window.location.hostname,
            userVerification: 'preferred',
            allowCredentials: []
          }
        }
        await navigator.credentials.get(fallbackOptions as any)
      }

      setVerificationStatus('success')
      setStatusMessage("YubiKey verified!")
      setYubikeyVerified(true)
    } catch (error) {
      console.error('YubiKey error:', error)
      setVerificationStatus('error')
      setStatusMessage(`Verification failed: ${(error as Error).message}`)
    }
  }

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success': return 'bg-green-50 text-green-800 border-green-200'
      case 'error': return 'bg-red-50 text-red-800 border-red-200'
      case 'pending': return 'bg-blue-50 text-blue-800 border-blue-200'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 blockchain-pattern opacity-20"></div>

      <div className="container max-w-3xl relative z-10">
        <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl gradient-text">Create Your Digital Identity</CardTitle>
              <div className="text-sm text-muted-foreground">Step {step} of 4</div>
            </div>
            <Progress value={step * 25} className="h-2 bg-muted" />
            <CardDescription className="pt-2">
              {step === 1 && "Choose your DID method and network"}
              {step === 2 && "Generate your cryptographic keys"}
              {step === 3 && "Set up authentication methods"}
              {step === 4 && "Review and complete your DID creation"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Select DID Method</h3>
                    <RadioGroup
                      defaultValue="ethr"
                      onValueChange={setDidMethod}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <MethodOption
                        value="ethr"
                        title="did:ethr"
                        description="Ethereum-based DID method"
                        icon={<Key className="w-5 h-5" />}
                        selected={didMethod === "ethr"}
                      />
                      <MethodOption
                        value="key"
                        title="did:key"
                        description="Cryptographic key-based DID"
                        icon={<Fingerprint className="w-5 h-5" />}
                        selected={didMethod === "key"}
                      />
                    </RadioGroup>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Select Network</h3>
                    <RadioGroup
                      defaultValue="sepolia"
                      onValueChange={setNetwork}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <NetworkOption
                        value="sepolia"
                        title="Sepolia"
                        description="Ethereum testnet"
                        selected={network === "sepolia"}
                      />
                      <NetworkOption
                        value="goerli"
                        title="Goerli"
                        description="Ethereum testnet"
                        selected={network === "goerli"}
                      />
                      <NetworkOption
                        value="polygon"
                        title="Polygon"
                        description="Mumbai testnet"
                        selected={network === "polygon"}
                      />
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="text-lg font-medium mb-2">Key Generation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We're generating a secure key pair for your DID. This will be used to prove ownership of your
                    identity.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center mr-3">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Generate Key Pair</p>
                        <p className="text-xs text-muted-foreground">ECDSA secp256k1 keys created</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center mr-3">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Encrypt Private Key</p>
                        <p className="text-xs text-muted-foreground">Key securely encrypted in local storage</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3 animate-pulse-slow">
                        <div className="w-5 h-5"></div>
                      </div>
                      <div>
                        <p className="font-medium">Assemble DID Document</p>
                        <p className="text-xs text-muted-foreground">Creating your DID document</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-lg font-medium mb-2">Your DID Preview</h3>
                  <div className="font-mono text-sm bg-muted p-3 rounded-md overflow-x-auto">
                    did:{didMethod}:sepolia:2F9Y3C7fjk2K9EJ5QrxEMTJYs9CjzXDJzn
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Tabs defaultValue="yubikey" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="yubikey">YubiKey</TabsTrigger>
                    <TabsTrigger value="biometric">Mobile Biometric</TabsTrigger>
                  </TabsList>

                  <TabsContent value="yubikey" className="space-y-4 mt-4">
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4 
                          ${verificationStatus === 'pending' ? 'animate-pulse' : ''} 
                          ${verificationStatus === 'success' ? 'bg-green-100' : ''}
                        `}>
                          <Key className={`w-8 h-8 ${yubikeyVerified ? 'text-green-500' : 'text-indigo'}`} />
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                          {yubikeyVerified ? 'YubiKey Verified!' : 'Insert Your YubiKey'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {yubikeyVerified
                            ? 'Your YubiKey has been successfully registered'
                            : 'Connect your YubiKey to register it with your DID'}
                        </p>
                        <Button
                          className={`${yubikeyVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo hover:bg-indigo-dark'}`}
                          onClick={verifyYubiKey}
                          disabled={verificationStatus === 'pending' || yubikeyVerified}
                        >
                          {verificationStatus === 'pending' ? 'Verifying...' : yubikeyVerified ? 'Verified ✓' : 'Register YubiKey'}
                        </Button>
                      </div>
                    </div>

                    {verificationStatus && (
                      <Alert className={`${getStatusColor()} border`}>
                        <AlertDescription>{statusMessage}</AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Why use YubiKey?</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Hardware-based security for maximum protection</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Phishing-resistant authentication</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Works across multiple devices</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="biometric" className="space-y-4 mt-4">
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        {/* gradient-border QR */}
                        <div className="p-1 bg-gradient-to-r from-indigo to-teal rounded-xl inline-block mb-4">
                          <canvas
                            ref={qrCanvasRef}
                            width={200}
                            height={200}
                            className="block rounded-lg shadow-lg"
                          />
                        </div>
                        {/* progress bar */}
                        <Progress
                          value={verificationProgress}
                          className="w-48 h-2 mb-2 center"
                        />
                        {/* seconds left */}
                        <p className="text-xs text-muted-foreground mb-4">
                          {secondsLeft}s remaining
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scan with your mobile device to verify biometrics
                        </p>
                        <Alert className={`${getStatusColor()} border`}>
                          <AlertDescription>
                            {statusMessage || "Waiting for verification..."}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Biometric Verification Benefits</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Secure passwordless authentication</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Instant verification process</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5" />
                          <span>Cross-device compatibility</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>


                </Tabs>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-medium text-center mb-6">Your DID is Ready!</h3>

                  <div className="space-y-4">
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Your DID</p>
                      <p className="font-mono text-sm break-all">
                        {did}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Authentication</p>
                        <div className="flex items-center">
                          <Key className="w-4 h-4 mr-2 text-indigo" />
                          <p className="text-sm">YubiKey Registered</p>
                        </div>
                      </div>

                      <div className="bg-card rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Network</p>
                        <p className="text-sm capitalize">{network} Testnet</p>
                      </div>
                    </div>

                    <div className="bg-card rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 mr-2 text-secondary" />
                        <p className="text-sm font-medium">Security Recommendation</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Set up social recovery to protect your identity. We recommend adding at least 3 trusted
                        guardians.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={nextStep} className="bg-gradient-to-r from-indigo to-teal border-0">
              {step < 4 ? (
                <>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Go to Dashboard"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function MethodOption({
  value,
  title,
  description,
  icon,
  selected,
}: {
  value: string
  title: string
  description: string
  icon: React.ReactNode
  selected: boolean
}) {
  return (
    <Label
      htmlFor={`method-${value}`}
      className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? "border-indigo bg-indigo/10" : "border-border"
        }`}
    >
      <RadioGroupItem value={value} id={`method-${value}`} className="sr-only" />
      <div className="mr-4 mt-0.5">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${selected ? "bg-indigo text-white" : "bg-muted text-muted-foreground"
            }`}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Label>
  )
}

function NetworkOption({
  value,
  title,
  description,
  selected,
}: {
  value: string
  title: string
  description: string
  selected: boolean
}) {
  return (
    <Label
      htmlFor={`network-${value}`}
      className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? "border-indigo bg-indigo/10" : "border-border"
        }`}
    >
      <RadioGroupItem value={value} id={`network-${value}`} className="sr-only" />
      <div className={`w-3 h-3 rounded-full mb-2 ${selected ? "bg-indigo" : "bg-muted"}`} />
      <p className="font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Label>
  )
}