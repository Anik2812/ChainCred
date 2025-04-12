"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Settings, Shield, User, FileCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"


export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("settings")
  const [emailNotifications, setEmailNotifications] = useState({
    securityAlerts: true,
    credentialUpdates: true,
    guardianRequests: true,
    systemUpdates: false,
    marketingUpdates: false,
  })
  const [pushNotifications, setPushNotifications] = useState({
    securityAlerts: true,
    credentialUpdates: true,
    guardianRequests: true,
    systemUpdates: true,
    marketingUpdates: false,
  })

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences and view recent alerts</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              <Badge className="ml-2 bg-secondary text-secondary-foreground" variant="secondary">
                3
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage notifications sent to your email address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationSetting
                  icon={<Shield className="w-5 h-5" />}
                  title="Security Alerts"
                  description="Receive notifications about security events"
                  checked={emailNotifications.securityAlerts}
                  onCheckedChange={() => handleEmailToggle("securityAlerts")}
                />
                <NotificationSetting
                  icon={<FileCheck className="w-5 h-5" />}
                  title="Credential Updates"
                  description="Notifications about credential issuance and verification"
                  checked={emailNotifications.credentialUpdates}
                  onCheckedChange={() => handleEmailToggle("credentialUpdates")}
                />
                <NotificationSetting
                  icon={<Users className="w-5 h-5" />}
                  title="Guardian Requests"
                  description="Notifications about recovery guardian requests"
                  checked={emailNotifications.guardianRequests}
                  onCheckedChange={() => handleEmailToggle("guardianRequests")}
                />
                <NotificationSetting
                  icon={<Settings className="w-5 h-5" />}
                  title="System Updates"
                  description="Updates about the ChainCred platform"
                  checked={emailNotifications.systemUpdates}
                  onCheckedChange={() => handleEmailToggle("systemUpdates")}
                />
                <NotificationSetting
                  icon={<Mail className="w-5 h-5" />}
                  title="Marketing Updates"
                  description="News and promotional content"
                  checked={emailNotifications.marketingUpdates}
                  onCheckedChange={() => handleEmailToggle("marketingUpdates")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage notifications sent to your devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationSetting
                  icon={<Shield className="w-5 h-5" />}
                  title="Security Alerts"
                  description="Receive notifications about security events"
                  checked={pushNotifications.securityAlerts}
                  onCheckedChange={() => handlePushToggle("securityAlerts")}
                />
                <NotificationSetting
                  icon={<FileCheck className="w-5 h-5" />}
                  title="Credential Updates"
                  description="Notifications about credential issuance and verification"
                  checked={pushNotifications.credentialUpdates}
                  onCheckedChange={() => handlePushToggle("credentialUpdates")}
                />
                <NotificationSetting
                  icon={<Users className="w-5 h-5" />}
                  title="Guardian Requests"
                  description="Notifications about recovery guardian requests"
                  checked={pushNotifications.guardianRequests}
                  onCheckedChange={() => handlePushToggle("guardianRequests")}
                />
                <NotificationSetting
                  icon={<Settings className="w-5 h-5" />}
                  title="System Updates"
                  description="Updates about the ChainCred platform"
                  checked={pushNotifications.systemUpdates}
                  onCheckedChange={() => handlePushToggle("systemUpdates")}
                />
                <NotificationSetting
                  icon={<Bell className="w-5 h-5" />}
                  title="Marketing Updates"
                  description="News and promotional content"
                  checked={pushNotifications.marketingUpdates}
                  onCheckedChange={() => handlePushToggle("marketingUpdates")}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Delivery</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notification Bundling</h3>
                    <p className="text-sm text-muted-foreground">Group similar notifications together</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Quiet Hours</h3>
                    <p className="text-sm text-muted-foreground">Don't send notifications during specified hours</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Your latest notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertItem
                  icon={<Shield className="w-5 h-5 text-secondary" />}
                  title="Security Alert"
                  description="New login detected from Mumbai, India"
                  time="2 hours ago"
                  isUnread={true}
                />
                <AlertItem
                  icon={<Users className="w-5 h-5 text-indigo" />}
                  title="Guardian Request"
                  description="Sanya Reddy accepted your guardian request"
                  time="Yesterday"
                  isUnread={true}
                />
                <AlertItem
                  icon={<FileCheck className="w-5 h-5 text-indigo" />}
                  title="Credential Verified"
                  description="Your University Degree credential was verified"
                  time="2 days ago"
                  isUnread={true}
                />
                <AlertItem
                  icon={<User className="w-5 h-5 text-indigo" />}
                  title="Profile Update"
                  description="Your profile information was updated"
                  time="1 week ago"
                  isUnread={false}
                />
                <AlertItem
                  icon={<Settings className="w-5 h-5 text-muted-foreground" />}
                  title="System Update"
                  description="ChainCred platform was updated to version 2.1"
                  time="2 weeks ago"
                  isUnread={false}
                />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Mark All as Read
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Devices receiving your notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-indigo" />
                    </div>
                    <div>
                      <p className="font-medium">iPhone 13 Pro</p>
                      <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-indigo" />
                    </div>
                    <div>
                      <p className="font-medium">MacBook Pro</p>
                      <p className="text-xs text-muted-foreground">Last active: Now</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add New Device</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NotificationSetting({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onCheckedChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

function AlertItem({
  icon,
  title,
  description,
  time,
  isUnread,
}: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  isUnread: boolean
}) {
  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg ${isUnread ? "bg-muted/50" : "border"}`}>
      <div className="w-10 h-10 rounded-full bg-muted/70 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium flex items-center">
              {title}
              {isUnread && <span className="ml-2 w-2 h-2 bg-secondary rounded-full"></span>}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{time}</p>
        </div>
      </div>
    </div>
  )
}
