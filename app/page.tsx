"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Key, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="gradient-bg grid-pattern flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 blockchain-pattern opacity-20"></div>

        {/* Floating hexagons */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-dark/20 hexagon"
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 0.5, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-teal-dark/20 hexagon"
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 0.5, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-indigo-light/20 hexagon"
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 0.5, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        />

        <div className="container max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-light to-teal-light flex items-center justify-center glow">
                  <Key className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text glow-text">ChainCred</h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
              Your decentralized identity platform for secure authentication and credential management
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <FeatureCard
              icon={<Key className="w-6 h-6" />}
              title="Decentralized Identity"
              description="Create and manage your DIDs on multiple blockchain networks"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Biometric Authentication"
              description="Secure your identity with YubiKey and mobile biometrics"
            />
            <FeatureCard
              icon={<FileCheck className="w-6 h-6" />}
              title="Verifiable Credentials"
              description="Issue, present, and verify credentials with ease"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo to-teal border-0 text-white">
              <Link href="/onboarding">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-indigo hover:bg-indigo/10">
              <Link href="/login">Login with DID</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 card-hover"
    >
      <div className="bg-gradient-to-br from-indigo to-teal w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}
