// app/login/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Shield } from 'lucide-react'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [didInput, setDidInput] = useState('')
  const [authStep, setAuthStep] = useState<'input' | 'verify'>('input')
  const [nonce, setNonce] = useState('')

  // Step 1: request nonce
  const handleLogin = async () => {
    if (!didInput) return
    setIsLoading(true)
    const res = await fetch('/api/did/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did: didInput }),
    })
    const json = await res.json()
    if (!res.ok) {
      alert(json.error)
      setIsLoading(false)
      return
    }
    setNonce(json.nonce)
    setAuthStep('verify')
    setIsLoading(false)
  }

  // Step 2: sign nonce & verify
  const handleVerify = async () => {
    setIsLoading(true)
    try {
      const provider = new Web3Provider((window as any).ethereum)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(nonce)

      const res = await fetch('/api/did/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did: didInput, signature }),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        window.location.href = '/dashboard'
      } else {
        alert(json.error)
        setAuthStep('input')
      }
    } catch (e) {
      console.error(e)
      alert('Verification failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-bg grid-pattern flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 blockchain-pattern opacity-20" />
      <div className="container max-w-md relative z-10">
        <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center gradient-text">
              Login with DID
            </CardTitle>
            <CardDescription className="text-center">
              Authenticate using your decentralized identifier
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authStep === 'input' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Input
                  placeholder="Enter your DID (did:ethr:...)"
                  value={didInput}
                  onChange={(e) => setDidInput(e.target.value)}
                  className="font-mono"
                />
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
                    'Continue'
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Or use your connected wallet to sign in
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Don’t have a DID?{' '}
                  <Link href="/onboarding" className="text-indigo hover:underline">
                    Create one
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <p className="text-center">Signing challenge…</p>
                <Button
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo to-teal border-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    'Authenticate'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setAuthStep('input')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
