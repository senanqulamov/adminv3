"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Database, Shield, Bell, Code, Key } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLoader } from "@/components/ui/loading-spinner"

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-2 shadow-lg">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <Code className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <Settings className="h-5 w-5 mr-3" />
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="company-name" className="text-gray-300 font-medium">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  defaultValue="NeoSphere"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="timezone" className="text-gray-300 font-medium">
                  Timezone
                </Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="language" className="text-gray-300 font-medium">
                  Default Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="currency" className="text-gray-300 font-medium">
                  Currency
                </Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <Database className="h-5 w-5 mr-3" />
              Database Configuration
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="db-host" className="text-gray-300 font-medium">
                    Database Host
                  </Label>
                  <Input
                    id="db-host"
                    defaultValue="localhost"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-port" className="text-gray-300 font-medium">
                    Port
                  </Label>
                  <Input
                    id="db-port"
                    defaultValue="5432"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-name" className="text-gray-300 font-medium">
                    Database Name
                  </Label>
                  <Input
                    id="db-name"
                    defaultValue="neosphere_db"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-user" className="text-gray-300 font-medium">
                    Username
                  </Label>
                  <Input
                    id="db-user"
                    defaultValue="admin"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-[#252830] rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition"
                >
                  Test Connection
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
                  Save Configuration
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <Code className="h-5 w-5 mr-3" />
              API Configuration
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="api-url" className="text-gray-300 font-medium">
                  API Base URL
                </Label>
                <Input
                  id="api-url"
                  defaultValue="https://api.neosphere.com"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="api-key" className="text-gray-300 font-medium">
                  API Key
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type="password"
                    defaultValue="sk-1234567890abcdef"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                  <Button
                    variant="outline"
                    className="border-[#2a2a2a] text-white hover:bg-[#252830] rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="rate-limit" className="text-gray-300 font-medium">
                    Rate Limit (req/min)
                  </Label>
                  <Input
                    id="rate-limit"
                    defaultValue="1000"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="timeout" className="text-gray-300 font-medium">
                    Timeout (seconds)
                  </Label>
                  <Input
                    id="timeout"
                    defaultValue="30"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <Shield className="h-5 w-5 mr-3" />
              Security Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300 font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="session-timeout" className="text-gray-300 font-medium">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  defaultValue="60"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="allowed-ips" className="text-gray-300 font-medium">
                  Allowed IP Addresses
                </Label>
                <Textarea
                  id="allowed-ips"
                  placeholder="192.168.1.1&#10;10.0.0.1"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-24 smooth-transition focus:border-blue-500/50"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <Bell className="h-5 w-5 mr-3" />
              Notification Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300 font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300 font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="space-y-3">
                <Label htmlFor="notification-email" className="text-gray-300 font-medium">
                  Notification Email
                </Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@neosphere.com"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
