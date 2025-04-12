"use client"

import { useState } from "react"
import { ChevronDown, Plus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RecoveryPage() {
  const [threshold, setThreshold] = useState(3)
  const [totalGuardians, setTotalGuardians] = useState(5)

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Social Recovery</h1>
            <p className="text-muted-foreground">Manage your recovery guardians and settings</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo to-teal border-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Guardian
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Guardian</DialogTitle>
                <DialogDescription>Add a trusted contact as a guardian for your identity recovery</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Guardian's name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="did">DID or Ethereum Address</Label>
                  <Input id="did" placeholder="did:ethr:0x..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" placeholder="guardian@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    // Here we would normally add the guardian to the list
                    // For now, we'll just close the dialog
                    const closeButton = document.querySelector("[data-radix-collection-item]")
                    if (closeButton instanceof HTMLElement) closeButton.click()
                  }}
                >
                  Add Guardian
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recovery Guardians</CardTitle>
              <CardDescription>
                Your recovery setup requires {threshold} out of {totalGuardians} guardians to recover your identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Recovery threshold</span>
                    <span className="font-medium">
                      {threshold} of {totalGuardians} guardians
                    </span>
                  </div>
                  <Progress value={(threshold / totalGuardians) * 100} className="h-2" />
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

          <Card>
            <CardHeader>
              <CardTitle>Recovery Settings</CardTitle>
              <CardDescription>Configure your social recovery parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Required Guardians</Label>
                  <Select
                    defaultValue={threshold.toString()}
                    onValueChange={(value) => setThreshold(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 guardians</SelectItem>
                      <SelectItem value="3">3 guardians</SelectItem>
                      <SelectItem value="4">4 guardians</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Number of guardians required to recover your identity</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-indigo" />
                      <h3 className="font-medium">Security Recommendation</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For optimal security, we recommend requiring at least 3 guardians for recovery.
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Test Recovery Process
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recovery Process</CardTitle>
            <CardDescription>How social recovery works for your identity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Initiate Recovery</h3>
                <p className="text-sm text-muted-foreground">
                  If you lose access to your identity, you can initiate the recovery process from any device.
                </p>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Guardian Approval</h3>
                <p className="text-sm text-muted-foreground">
                  Your guardians will receive a recovery request and must approve it within a set timeframe.
                </p>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Identity Restored</h3>
                <p className="text-sm text-muted-foreground">
                  Once enough guardians approve, your identity is restored with new authentication methods.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
