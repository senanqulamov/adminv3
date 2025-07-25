"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Settings,
  Shield,
  Bell,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Key,
  Eye,
  EyeOff,
  Save,
} from "lucide-react"

export function ProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
    <div className="px-6 py-8 space-y-8 animate-slide-up no-select">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-2 shadow-lg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
            <Settings className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="bg-[#171717] text-white text-2xl">JD</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">John Doe</h3>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-xl">Administrator</Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-xl">Active</Badge>
                </div>
                <p className="text-sm text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last login: 2 hours ago
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-white font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  defaultValue="John"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-white font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  defaultValue="Doe"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john@example.com"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-white font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  defaultValue="+1 (555) 123-4567"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="location" className="text-white font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  defaultValue="New York, NY"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-white font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="johndoe"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="timezone" className="text-white font-medium">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  defaultValue="UTC-5 (Eastern Time)"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="language" className="text-white font-medium">
                  Language
                </Label>
                <Input
                  id="language"
                  defaultValue="English"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Change Password</h4>
                <div className="space-y-3">
                  <Label htmlFor="currentPassword" className="text-white font-medium">
                    Current Password
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent h-12 w-12"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-white font-medium">
                    New Password
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent h-12 w-12"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-white font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                  />
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="space-y-4">
                <Label className="text-white font-medium">Notification Types</Label>
                <div className="space-y-3">
                  {[
                    { label: "User Activity", description: "New user registrations and updates" },
                    { label: "Order Updates", description: "Order status changes and payments" },
                    { label: "System Alerts", description: "System maintenance and errors" },
                    { label: "Security Events", description: "Login attempts and security issues" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium">{item.label}</Label>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: "Logged in",
                  time: "2 hours ago",
                  ip: "192.168.1.100",
                  device: "Chrome on Windows",
                },
                {
                  action: "Updated profile",
                  time: "1 day ago",
                  ip: "192.168.1.100",
                  device: "Chrome on Windows",
                },
                {
                  action: "Changed password",
                  time: "3 days ago",
                  ip: "192.168.1.100",
                  device: "Safari on macOS",
                },
                {
                  action: "Logged in",
                  time: "5 days ago",
                  ip: "10.0.0.50",
                  device: "Firefox on Linux",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#171717] border border-[#2a2a2a] rounded-2xl"
                >
                  <div>
                    <p className="font-semibold text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.device}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{activity.time}</p>
                    <p className="text-xs text-gray-400">{activity.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
