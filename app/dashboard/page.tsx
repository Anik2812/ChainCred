"use client"

import type React from "react"

import { useState } from "react"
import {
  Bell,
  ChevronDown,
  FileCheck,
  FilePlus,
  FileText,
  Fingerprint,
  Key,
  LogOut,
  Menu,
  Plus,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

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
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback className="bg-indigo">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
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
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, Arjun</h1>
                <p className="text-muted-foreground">Manage your decentralized identity and credentials</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                {/* <TabsList className="grid grid-cols-3 md:w-[400px]">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {/* <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  <TabsTrigger value="recovery">Recovery</TabsTrigger> */}
                {/* </TabsList> */} 

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <IdentityCard />
                    <SecurityCard />
                    <ActivityCard />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CredentialsOverviewCard />
                    <RecoveryOverviewCard />
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Credentials</h2>
                    <Button className="bg-gradient-to-r from-indigo to-teal border-0">
                      <FilePlus className="mr-2 h-4 w-4" />
                      Issue Credential
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CredentialCard
                      title="University Degree"
                      issuer="Stanford University"
                      date="Issued on May 15, 2023"
                      status="verified"
                      icon={<FileCheck className="h-6 w-6" />}
                    />
                    <CredentialCard
                      title="Employment Verification"
                      issuer="Blockchain Inc."
                      date="Issued on Jan 10, 2023"
                      status="verified"
                      icon={<FileCheck className="h-6 w-6" />}
                    />
                    <CredentialCard
                      title="Professional Certification"
                      issuer="Blockchain Academy"
                      date="Issued on Mar 22, 2023"
                      status="verified"
                      icon={<FileCheck className="h-6 w-6" />}
                    />
                    <CredentialCard
                      title="Conference Attendance"
                      issuer="ETH Global"
                      date="Issued on Nov 5, 2023"
                      status="pending"
                      icon={<FileText className="h-6 w-6" />}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="recovery" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Social Recovery</h2>
                    <Button className="bg-gradient-to-r from-indigo to-teal border-0">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Guardian
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recovery Status</CardTitle>
                      <CardDescription>
                        Your recovery setup requires 3 out of 5 guardians to recover your identity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Recovery threshold</span>
                            <span className="font-medium">3 of 5 guardians</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>

                        <div className="space-y-4">
                          <GuardianItem name="Aditya Sharma" did="did:ethr:0x1a2...4d5e" status="confirmed" />
                          <GuardianItem name="Meera Gupta" did="did:ethr:0x5d6...8g9h" status="confirmed" />
                          <GuardianItem name="Jai Singh" did="did:ethr:0x9g0...2j3k" status="confirmed" />
                          <GuardianItem name="Sanya Reddy" did="did:ethr:0x3j4...6m7n" status="pending" />
                          <GuardianItem name="Dhruv Banerjee" did="did:ethr:0x7m8...0p1q" status="pending" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold mb-4">Main Menu</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/credentials">
              <FileCheck className="mr-2 h-4 w-4" />
              Credentials
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
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
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-auto px-4 py-4">
        <Card className="bg-muted/50">
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

function IdentityCard() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Your Identity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User" />
              <AvatarFallback className="bg-indigo text-xl">AP</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">Arjun Patel</h3>
              <p className="text-sm text-muted-foreground">did:ethr:sepolia:3G7Z4D8glm3L9FK6RsyFNTKZt0DkYDKzp</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Authentication Methods</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Key className="w-4 h-4 text-indigo" />
                </div>
                <div>
                  <p className="text-sm font-medium">YubiKey</p>
                  <p className="text-xs text-muted-foreground">Added on Apr 10, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
  )
}

function SecurityCard() {
  return (
    <Card className="col-span-1">
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
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-secondary mr-2" />
                <span>Multiple authentication methods</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-secondary mr-2" />
                <span>Social recovery setup</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Circle className="w-4 h-4 text-muted-foreground mr-2" />
                <span>Backup key</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityCard() {
  return (
    <Card className="col-span-1">
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

          <Button variant="ghost" className="w-full text-xs">
            View all activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CredentialsOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Credentials</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View all
          </Button>
        </div>
        <CardDescription>Your verifiable credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-indigo" />
              </div>
              <div>
                <p className="text-sm font-medium">University Degree</p>
                <p className="text-xs text-muted-foreground">Stanford University</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-indigo" />
              </div>
              <div>
                <p className="text-sm font-medium">Employment Verification</p>
                <p className="text-xs text-muted-foreground">Blockchain Inc.</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo" />
              </div>
              <div>
                <p className="text-sm font-medium">Conference Attendance</p>
                <p className="text-xs text-muted-foreground">ETH Global</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              Pending
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecoveryOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Social Recovery</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            Manage
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo/20 text-xs">AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Aditya Sharma</p>
                  <p className="text-xs text-muted-foreground">did:ethr:0x1a2...4d5e</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                Confirmed
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo/20 text-xs">MG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Meera Gupta</p>
                  <p className="text-xs text-muted-foreground">did:ethr:0x5d6...8g9h</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                Confirmed
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo/20 text-xs">SR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Sanya Reddy</p>
                  <p className="text-xs text-muted-foreground">did:ethr:0x3j4...6m7n</p>
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
  )
}

function CredentialCard({
  title,
  issuer,
  date,
  status,
  icon,
}: {
  title: string
  issuer: string
  date: string
  status: "verified" | "pending"
  icon: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${status === "verified" ? "bg-secondary" : "bg-muted"}`}></div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              status === "verified" ? "bg-secondary/10" : "bg-muted"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{issuer}</p>
              </div>
              <Badge
                variant="outline"
                className={`
                ${
                  status === "verified"
                    ? "bg-secondary/10 text-secondary border-secondary/20"
                    : "bg-muted text-muted-foreground"
                }
              `}
              >
                {status === "verified" ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{date}</p>
              <Button variant="ghost" size="sm" className="text-xs">
                View details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GuardianItem({
  name,
  did,
  status,
}: {
  name: string
  did: string
  status: "confirmed" | "pending"
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-indigo/20">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{did}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={`
          ${
            status === "confirmed"
              ? "bg-secondary/10 text-secondary border-secondary/20"
              : "bg-muted text-muted-foreground"
          }
        `}
        >
          {status === "confirmed" ? "Confirmed" : "Pending"}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Remove guardian</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
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
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground whitespace-nowrap">{time}</p>
    </div>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
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
