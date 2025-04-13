"use client"

import type React from "react"

import { useState } from "react"
import {
  Bell,
  FileCheck,
  FilePlus,
  FileText,
  Fingerprint,
  Key,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Users,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                <Key className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">ChainCred</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-indigo">AP</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/50">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">
            <div className="flex flex-col gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold mb-2">Welcome, Arjun</h1>
                <p className="text-muted-foreground">Manage your decentralized identity and credentials</p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <IdentityCard copyToClipboard={copyToClipboard} copied={copied} />
                  <SecurityCard />
                  <ActivityCard />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <CredentialsOverviewCard />
                  <RecoveryOverviewCard />
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-4">Main Menu</h2>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard/credentials">
              <FileCheck className="mr-2 h-4 w-4" />
              Credentials
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard/recovery">
              <Users className="mr-2 h-4 w-4" />
              Recovery
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 mt-4">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard/security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start transition-colors hover:bg-indigo/10 hover:text-indigo"
            asChild
          >
            <Link href="/dashboard/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-auto px-4 py-4">
        <Card className="bg-muted/50 transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Security Check</h3>
                <p className="text-xs text-muted-foreground">Complete your security setup</p>
              </div>
            </div>
            <Progress value={70} className="h-1 mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MobileSidebar() {
  return <Sidebar />
}

function IdentityCard({ copyToClipboard, copied }: { copyToClipboard: (text: string) => void; copied: boolean }) {
  const did = "did:ethr:sepolia:3G7Z4D8glm3L9FK6RsyFNTKZt0DkYDKzp"
  const shortDid = `${did.substring(0, 16)}...${did.substring(did.length - 4)}`

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="col-span-1">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Your Identity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-indigo text-xl">AP</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">Arjun Patel</h3>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground font-mono truncate max-w-[180px]" title={did}>
                    {shortDid}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(did)}>
                          {copied ? (
                            <CheckIcon className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{copied ? "Copied!" : "Copy DID"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Authentication Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Key className="w-4 h-4 text-indigo" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">YubiKey</p>
                    <p className="text-xs text-muted-foreground">Added on Apr 10, 2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-indigo" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mobile Biometric</p>
                    <p className="text-xs text-muted-foreground">Added on Apr 12, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SecurityCard() {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="col-span-1">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo to-teal flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Security Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">85</span>
                  <span className="text-xs text-muted-foreground">/100</span>
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

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center">
                  <CheckIcon className="w-4 h-4 text-secondary mr-2" />
                  <span>Multiple authentication methods</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center">
                  <CheckIcon className="w-4 h-4 text-secondary mr-2" />
                  <span>Social recovery setup</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center">
                  <Circle className="w-4 h-4 text-muted-foreground mr-2" />
                  <span>Backup key</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs transition-colors hover:bg-indigo/10 hover:text-indigo"
                  asChild
                >
                  <Link href="/dashboard/security">Setup</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ActivityCard() {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="col-span-1">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <ActivityItem
                icon={<Key className="w-4 h-4" />}
                title="Authentication successful"
                description="YubiKey used for login"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<FileCheck className="w-4 h-4" />}
                title="Credential verified"
                description="University Degree credential"
                time="Yesterday"
              />
              <ActivityItem
                icon={<Users className="w-4 h-4" />}
                title="Guardian added"
                description="Sanya Reddy added as guardian"
                time="3 days ago"
              />
              <ActivityItem
                icon={<FilePlus className="w-4 h-4" />}
                title="Credential issued"
                description="Conference Attendance credential"
                time="1 week ago"
              />
            </div>

            <Button
              variant="ghost"
              className="w-full text-xs transition-colors hover:bg-indigo/10 hover:text-indigo"
              asChild
            >
              <Link href="/dashboard/security?tab=activity">View all activity</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CredentialsOverviewCard() {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Credentials</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs transition-colors hover:bg-indigo/10 hover:text-indigo"
              asChild
            >
              <Link href="/dashboard/credentials">View all</Link>
            </Button>
          </div>
          <CardDescription>Your verifiable credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-indigo" />
                </div>
                <div>
                  <p className="text-sm font-medium">University Degree</p>
                  <p className="text-xs text-muted-foreground">IIT Mumbai</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                  <FileCheck className="w-4 h-4 text-indigo" />
                </div>
                <div>
                  <p className="text-sm font-medium">Employment Verification</p>
                  <p className="text-xs text-muted-foreground">TechCorp India</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                Verified
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo" />
                </div>
                <div>
                  <p className="text-sm font-medium">Conference Attendance</p>
                  <p className="text-xs text-muted-foreground">ETH Global Bangalore</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RecoveryOverviewCard() {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Social Recovery</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs transition-colors hover:bg-indigo/10 hover:text-indigo"
              asChild
            >
              <Link href="/dashboard/recovery">Manage</Link>
            </Button>
          </div>
          <CardDescription>Your recovery guardians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recovery threshold</span>
                <span className="font-medium">3 of 5 guardians</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo/20 text-xs">AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Aditya Sharma</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">did:ethr:0x1a2...4d5e</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                  Confirmed
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo/20 text-xs">MG</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Meera Gupta</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">did:ethr:0x5d6...8g9h</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                  Confirmed
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo/20 text-xs">SR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Sanya Reddy</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">did:ethr:0x3j4...6m7n</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-md transition-colors hover:bg-muted">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground whitespace-nowrap">{time}</p>
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Circle(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
