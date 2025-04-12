"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Globe, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "Arjun Patel",
    email: "arjun.patel@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    website: "arjunpatel.dev",
    bio: "Blockchain developer and digital identity enthusiast. Working on decentralized solutions for a better future.",
    publicProfile: true,
    emailNotifications: true,
    twoFactorAuth: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here we would normally save the data to the backend
  }

  return (
    <div className="container py-6 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>How others see you on the platform</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                  <AvatarFallback className="bg-indigo text-3xl">AP</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-card">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change avatar</span>
                </Button>
              </div>
              <h3 className="text-xl font-medium">{formData.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">did:ethr:sepolia:3G7Z4D8glm3L9FK6RsyFNTKZt0DkYDKzp</p>
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{formData.location}</span>
                </div>
                {formData.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{formData.website}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="linked">Linked Accounts</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" name="website" value={formData.website} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" className="mr-2" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                          <p>{formData.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                          <p>{formData.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                          <p>{formData.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p>{formData.location}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                        <p>{formData.website}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                        <p className="text-sm">{formData.bio}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Public Profile</h3>
                        <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                      </div>
                      <Switch
                        checked={formData.publicProfile}
                        onCheckedChange={(checked) => handleSwitchChange("publicProfile", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive email notifications about your account</p>
                      </div>
                      <Switch
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={formData.twoFactorAuth}
                        onCheckedChange={(checked) => handleSwitchChange("twoFactorAuth", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="linked" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#627EEA] flex items-center justify-center mr-4">
                          <svg className="h-6 w-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        </div>
                        <div>
                          <h3 className="font-medium">Ethereum Wallet</h3>
                          <p className="text-sm text-muted-foreground">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#F0B90B] flex items-center justify-center mr-4">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                              fill="#F0B90B"
                            />
                            <path
                              d="M7.2 12L6 13.2L4.8 12L6 10.8L7.2 12ZM12 7.2L14.4 9.6L15.6 8.4L12 4.8L8.4 8.4L9.6 9.6L12 7.2ZM18 10.8L19.2 12L18 13.2L16.8 12L18 10.8ZM12 16.8L9.6 14.4L8.4 15.6L12 19.2L15.6 15.6L14.4 14.4L12 16.8ZM12 13.2L13.2 12L12 10.8L10.8 12L12 13.2Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Polygon Wallet</h3>
                          <p className="text-sm text-muted-foreground">0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>

                    <Button className="w-full">Connect New Wallet</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
