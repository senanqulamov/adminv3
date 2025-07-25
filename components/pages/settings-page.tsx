"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Database,
  Shield,
  Bell,
  Code,
  Key,
  Globe,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Check,
} from "lucide-react"

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [showApiKey, setShowApiKey] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveAll = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="px-6 py-8 space-y-8 animate-slide-up no-select">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <Button
          onClick={handleSaveAll}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
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
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3 font-semibold smooth-transition"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            System
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
                <Label htmlFor="company-name" className="text-white font-medium">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  defaultValue="NeoSphere"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="timezone" className="text-white font-medium">
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
                <Label htmlFor="language" className="text-white font-medium">
                  Default Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                    <SelectItem value="en">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Spanish
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        French
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="currency" className="text-white font-medium">
                  Currency
                </Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] rounded-2xl">
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
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
                  <Label htmlFor="db-host" className="text-white font-medium">
                    Database Host
                  </Label>
                  <Input
                    id="db-host"
                    defaultValue="localhost"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-port" className="text-white font-medium">
                    Port
                  </Label>
                  <Input
                    id="db-port"
                    defaultValue="5432"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-name" className="text-white font-medium">
                    Database Name
                  </Label>
                  <Input
                    id="db-name"
                    defaultValue="neosphere_db"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="db-user" className="text-white font-medium">
                    Username
                  </Label>
                  <Input
                    id="db-user"
                    defaultValue="admin"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Auto Backup</Label>
                  <p className="text-sm text-gray-400">Automatically backup database daily</p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold smooth-transition shadow-lg hover:shadow-xl">
                  <Save className="h-4 w-4 mr-2" />
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
                <Label htmlFor="api-url" className="text-white font-medium">
                  API Base URL
                </Label>
                <Input
                  id="api-url"
                  defaultValue="https://api.neosphere.com"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="api-key" className="text-white font-medium">
                  API Key
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    defaultValue="sk-1234567890abcdef"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent h-12 w-12"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent px-6 py-3 font-semibold smooth-transition"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="rate-limit" className="text-white font-medium">
                    Rate Limit (req/min)
                  </Label>
                  <Input
                    id="rate-limit"
                    defaultValue="1000"
                    className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="timeout" className="text-white font-medium">
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
                  <Label className="text-white font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="session-timeout" className="text-white font-medium">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  defaultValue="60"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="allowed-ips" className="text-white font-medium">
                  Allowed IP Addresses
                </Label>
                <Textarea
                  id="allowed-ips"
                  placeholder="192.168.1.1&#10;10.0.0.1"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-24 smooth-transition focus:border-blue-500/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Login Notifications</Label>
                  <p className="text-sm text-gray-400">Get notified of new login attempts</p>
                </div>
                <Switch defaultChecked />
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
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <Label className="text-white font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-400">Receive notifications via email</p>
                  </div>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                  <div>
                    <Label className="text-white font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                  </div>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notification-email" className="text-white font-medium">
                  Notification Email
                </Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@neosphere.com"
                  className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12 smooth-transition focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-white font-medium">Notification Types</Label>
                <div className="space-y-3">
                  {[
                    { label: "User Registration", description: "New user sign-ups" },
                    { label: "Order Updates", description: "Order status changes" },
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

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8 shadow-2xl animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center tracking-tight">
              <RefreshCw className="h-5 w-5 mr-3" />
              System Management
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Put the system in maintenance mode</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent px-6 py-4 font-semibold smooth-transition h-auto flex flex-col items-center space-y-2"
                >
                  <Download className="h-6 w-6" />
                  <span>Export Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:bg-[#252525] rounded-2xl bg-transparent px-6 py-4 font-semibold smooth-transition h-auto flex flex-col items-center space-y-2"
                >
                  <Upload className="h-6 w-6" />
                  <span>Import Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-red-400 hover:bg-red-500/10 rounded-2xl bg-transparent px-6 py-4 font-semibold smooth-transition h-auto flex flex-col items-center space-y-2"
                >
                  <Trash2 className="h-6 w-6" />
                  <span>Clear Cache</span>
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="text-white font-medium">System Information</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Version</p>
                    <p className="font-semibold text-white">v2.1.0</p>
                  </div>
                  <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="font-semibold text-white">2024-01-15</p>
                  </div>
                  <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Database Size</p>
                    <p className="font-semibold text-white">2.4 GB</p>
                  </div>
                  <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Active Users</p>
                    <p className="font-semibold text-white">2,847</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
