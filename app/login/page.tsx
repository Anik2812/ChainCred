"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Fingerprint, Key, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [didInput, setDidInput] = useState("")
  const [authStep, setAuthStep] = useState<"input" | "verify">("input")

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAuthStep("verify")
      setIsLoading(false)
    }, 1500)
  }

  const handleVerify = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 blockchain-pattern opacity-20"></div>

      <div className="container max-w-md relative z-10">
        <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center gradient-text">Login with DID</CardTitle>
            <CardDescription className="text-center">Authenticate using your decentralized identifier</CardDescription>
          </CardHeader>

          <CardContent>
            {authStep === "input" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Input
                    placeholder="Enter your DID (did:ethr:...)"
                    value={didInput}
                    onChange={(e) => setDidInput(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground text-center">Or use a connected wallet</p>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading || !didInput}
                  className="w-full bg-gradient-to-r from-indigo to-teal border-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.042 40C31.0587 40 40 31.0457 40 20C40 8.9543 31.0587 0 20.042 0C9.02532 0 0.0839844 8.9543 0.0839844 20C0.0839844 31.0457 9.02532 40 20.042 40Z"
                        fill="#627EEA"
                      />
                      <path d="M20.6719 5V16.0875L29.9996 20.275L20.6719 5Z" fill="white" fillOpacity="0.602" />
                      <path d="M20.6716 5L11.3438 20.275L20.6716 16.0875V5Z" fill="white" />
                      <path
                        d="M20.6719 27.4499V34.9999L30.0059 22.0249L20.6719 27.4499Z"
                        fill="white"
                        fillOpacity="0.602"
                      />
                      <path d="M20.6716 34.9999V27.4499L11.3438 22.0249L20.6716 34.9999Z" fill="white" />
                      <path
                        d="M20.6719 25.7124L29.9996 20.2749L20.6719 16.0874V25.7124Z"
                        fill="white"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M11.3438 20.2749L20.6716 25.7124V16.0874L11.3438 20.2749Z"
                        fill="white"
                        fillOpacity="0.602"
                      />
                    </svg>
                    Ethereum
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                        fill="#F0B90B"
                      />
                      <path
                        d="M7.2 12L6 13.2L4.8 12L6 10.8L7.2 12ZM12 7.2L14.4 9.6L15.6 8.4L12 4.8L8.4 8.4L9.6 9.6L12 7.2ZM18 10.8L19.2 12L18 13.2L16.8 12L18 10.8ZM12 16.8L9.6 14.4L8.4 15.6L12 19.2L15.6 15.6L14.4 14.4L12 16.8ZM12 13.2L13.2 12L12 10.8L10.8 12L12 13.2Z"
                        fill="white"
                      />
                    </svg>
                    Binance
                  </Button>
                </div>
              </motion.div>
            ) : (
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
                        <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                          <Key className="w-8 h-8 text-indigo" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Insert Your YubiKey</h3>
                        <p className="text-sm text-muted-foreground mb-4">Touch your YubiKey to authenticate</p>
                        <Button onClick={handleVerify} disabled={isLoading} className="bg-indigo hover:bg-indigo-dark">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying
                            </>
                          ) : (
                            "Authenticate"
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="biometric" className="space-y-4 mt-4">
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                          <Fingerprint className="w-8 h-8 text-indigo" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Scan QR Code</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scan with your mobile device to authenticate
                        </p>
                        <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg mb-4">
                          <div className="w-full h-full bg-black grid grid-cols-4 grid-rows-4 gap-1">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}></div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Waiting for authentication...</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {authStep === "verify" && (
              <Button variant="ghost" onClick={() => setAuthStep("input")} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have a DID yet?{" "}
              <Link href="/onboarding" className="text-indigo hover:underline">
                Create one
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
