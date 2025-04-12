"use client"

import type React from "react"

import { useState } from "react"
import { FilePlus, FileCheck, FileText, Search, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CredentialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filter credentials based on search query and filter status
  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      credential.issuer.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && credential.status === filterStatus
  })

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Credentials</h1>
            <p className="text-muted-foreground">Manage your verifiable credentials</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo to-teal border-0">
                <FilePlus className="mr-2 h-4 w-4" />
                Issue Credential
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue New Credential</DialogTitle>
                <DialogDescription>Create a new verifiable credential to issue to someone</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="credential-type">Credential Type</Label>
                  <Select>
                    <SelectTrigger id="credential-type">
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Recipient DID</Label>
                  <Input id="recipient" placeholder="did:ethr:0x..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credential-name">Credential Name</Label>
                  <Input id="credential-name" placeholder="e.g. University Degree" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                  <Input id="expiry" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Issue Credential</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search-credentials" className="text-sm mb-2">
              Search Credentials
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-credentials"
                placeholder="Search by name or issuer..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="filter-status" className="text-sm mb-2">
              Filter by Status
            </Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Credentials</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="issued">Issued</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredCredentials.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No credentials found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? "Try adjusting your search query" : "You don't have any credentials yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCredentials.map((credential, index) => (
                  <CredentialCard key={index} {...credential} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issued" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCredentials
                .filter((cred) => cred.type === "issued")
                .map((credential, index) => (
                  <CredentialCard key={index} {...credential} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="received" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCredentials
                .filter((cred) => cred.type === "received")
                .map((credential, index) => (
                  <CredentialCard key={index} {...credential} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CredentialCard({
  title,
  issuer,
  date,
  status,
  icon,
  type,
}: {
  title: string
  issuer: string
  date: string
  status: "verified" | "pending" | "expired"
  icon: React.ReactNode
  type: "issued" | "received"
}) {
  return (
    <Card className="overflow-hidden">
      <div
        className={`h-2 ${
          status === "verified" ? "bg-secondary" : status === "pending" ? "bg-muted" : "bg-destructive"
        }`}
      ></div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              status === "verified" ? "bg-secondary/10" : status === "pending" ? "bg-muted" : "bg-destructive/10"
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
                    : status === "pending"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                }
              `}
              >
                {status === "verified" ? "Verified" : status === "pending" ? "Pending" : "Expired"}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{date}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Credential</DialogTitle>
                      <DialogDescription>Share this credential with another party</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="recipient-did">Recipient DID</Label>
                        <Input id="recipient-did" placeholder="did:ethr:0x..." />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry (Optional)</Label>
                        <Input id="expiry" type="date" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Share Credential</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample credential data
const credentials: {
  title: string
  issuer: string
  date: string
  status: "verified" | "pending" | "expired"
  icon: React.ReactNode
  type: "received" | "issued"
}[] = [
  {
    title: "University Degree",
    issuer: "IIT Mumbai",
    date: "Issued on May 15, 2023",
    status: "verified",
    icon: <FileCheck className="h-6 w-6" />,
    type: "received",
  },
  {
    title: "Employment Verification",
    issuer: "TechCorp India",
    date: "Issued on Jan 10, 2023",
    status: "verified",
    icon: <FileCheck className="h-6 w-6" />,
    type: "received",
  },
  {
    title: "Professional Certification",
    issuer: "Blockchain Academy Delhi",
    date: "Issued on Mar 22, 2023",
    status: "verified",
    icon: <FileCheck className="h-6 w-6" />,
    type: "received",
  },
  {
    title: "Conference Attendance",
    issuer: "ETH Global Bangalore",
    date: "Issued on Nov 5, 2023",
    status: "pending",
    icon: <FileText className="h-6 w-6" />,
    type: "received",
  },
  {
    title: "Skill Verification",
    issuer: "Issued by You",
    date: "Issued on Feb 15, 2024",
    status: "verified",
    icon: <FileCheck className="h-6 w-6" />,
    type: "issued",
  },
  {
    title: "Membership Certificate",
    issuer: "Issued by You",
    date: "Issued on Dec 3, 2023",
    status: "expired",
    icon: <FileText className="h-6 w-6" />,
    type: "issued",
  },
]
