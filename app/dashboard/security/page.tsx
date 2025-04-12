"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Key, Fingerprint, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
    }, 2000)
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-muted-foreground">Manage your security and authentication methods</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Your current security status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Security Score</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">85</span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall security</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    <SecurityItem
                      status="complete"
                      title="Multiple authentication methods"
                      description="You have set up multiple ways to authenticate"
                    />
                    <SecurityItem
                      status="complete"
                      title="Social recovery setup"
                      description="You have configured social recovery with guardians"
                    />
                    <SecurityItem
                      status="pending"
                      title="Backup key"
                      description="Set up a backup key for emergency access"
                    />
                    <SecurityItem
                      status="pending"
                      title="Regular security check"
                      description="Perform a security check every 3 months"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Methods</CardTitle>
                  <CardDescription>Your active authentication methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Key className="w-5 h-5 text-indigo" />
                        </div>
                        <div>
                          <p className="font-medium">YubiKey</p>
                          <p className="text-xs text-muted-foreground">Added on Apr 10, 2023</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-indigo" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile Biometric</p>
                          <p className="text-xs text-muted-foreground">Added on Apr 12, 2023</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage Authentication
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recovery Keys</CardTitle>
                  <CardDescription>Backup access to your identity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Key className="w-5 h-5 text-indigo" />
                        </div>
                        <div>
                          <p className="font-medium">Recovery Key</p>
                          <p className="text-xs text-muted-foreground">Generated on Apr 10, 2023</p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Recovery Key</DialogTitle>
                            <DialogDescription>
                              Store this key in a secure location. It can be used to recover your account.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
                            8f2a-e93c-4b18-d7a5-9c6f-12d4-87e5-3f9a
                          </div>
                          <DialogFooter>
                            <Button onClick={handleRegenerate} disabled={isRegenerating}>
                              {isRegenerating ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Regenerating...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Regenerate Key
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-indigo" />
                        <h3 className="font-medium">Important</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Store your recovery key in a secure location. It's the only way to recover your account if you
                        lose access to your authentication methods.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Download Recovery Key
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Methods</CardTitle>
                <CardDescription>Manage your authentication methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Methods</h3>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Key className="w-5 h-5 text-indigo" />
                        </div>
                        <div>
                          <p className="font-medium">YubiKey</p>
                          <p className="text-xs text-muted-foreground">Added on Apr 10, 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Rename
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-indigo" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile Biometric</p>
                          <p className="text-xs text-muted-foreground">Added on Apr 12, 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Rename
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Add New Method</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-auto p-4 justify-start">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center">
                                <Key className="w-5 h-5 mr-2" />
                                <span className="font-medium">Add YubiKey</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Connect a hardware security key</p>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add YubiKey</DialogTitle>
                            <DialogDescription>
                              Connect your YubiKey to add it as an authentication method
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                                <Key className="w-8 h-8 text-indigo" />
                              </div>
                              <h3 className="text-lg font-medium mb-1">Insert Your YubiKey</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Connect your YubiKey to register it with your DID
                              </p>
                              <Button className="bg-indigo hover:bg-indigo-dark">Register YubiKey</Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="h-auto p-4 justify-start">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center">
                                <Fingerprint className="w-5 h-5 mr-2" />
                                <span className="font-medium">Add Mobile Device</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Use biometrics on your mobile device</p>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Mobile Device</DialogTitle>
                            <DialogDescription>Scan the QR code with your mobile device</DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-lg">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                                <Fingerprint className="w-8 h-8 text-indigo" />
                              </div>
                              <h3 className="text-lg font-medium mb-1">Connect Mobile Device</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Scan this QR code with your mobile device
                              </p>
                              <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg mb-4">
                                <div className="w-full h-full bg-black grid grid-cols-4 grid-rows-4 gap-1">
                                  {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className={`${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}></div>
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">Waiting for connection...</p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Activity</CardTitle>
                <CardDescription>Recent security-related activity on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ActivityItem
                    icon={<Key className="w-5 h-5" />}
                    title="Authentication successful"
                    description="YubiKey used for login"
                    time="2 hours ago"
                    location="Mumbai, India"
                    device="Chrome on Windows"
                  />
                  <ActivityItem
                    icon={<RefreshCw className="w-5 h-5" />}
                    title="Recovery key regenerated"
                    description="New recovery key created"
                    time="2 days ago"
                    location="Mumbai, India"
                    device="Chrome on Windows"
                  />
                  <ActivityItem
                    icon={<Fingerprint className="w-5 h-5" />}
                    title="Mobile biometric added"
                    description="New authentication method added"
                    time="Apr 12, 2023"
                    location="Mumbai, India"
                    device="Chrome on Windows"
                  />
                  <ActivityItem
                    icon={<Key className="w-5 h-5" />}
                    title="YubiKey added"
                    description="New authentication method added"
                    time="Apr 10, 2023"
                    location="Mumbai, India"
                    device="Chrome on Windows"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SecurityItem({
  status,
  title,
  description,
}: {
  status: "complete" | "pending" | "warning"
  title: string
  description: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {status === "complete" ? (
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-secondary" />
          </div>
        ) : status === "pending" ? (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
        )}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {status === "pending" && (
        <Button variant="outline" size="sm">
          Setup
        </Button>
      )}
    </div>
  )
}

function ActivityItem({
  icon,
  title,
  description,
  time,
  location,
  device,
}: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  location: string
  device: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex flex-col md:flex-row md:items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </div>
          <div className="flex items-center">
            <Monitor className="w-3 h-3 mr-1" />
            {device}
          </div>
        </div>
      </div>
    </div>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function Monitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}
