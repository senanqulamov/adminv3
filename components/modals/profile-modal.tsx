"use client"

import {useState} from "react"
import {Modal, ModalContent, ModalHeader, ModalTitle} from "@/components/ui/modal"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card} from "@/components/ui/card"
import {Switch} from "@/components/ui/switch"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {User, Settings, Shield, Bell, Camera} from "lucide-react"

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ProfileModal({isOpen, onClose}: ProfileModalProps) {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)
    const [twoFactorAuth, setTwoFactorAuth] = useState(true)

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <ModalHeader>
                    <ModalTitle className="text-2xl">Profile Settings</ModalTitle>
                </ModalHeader>

                <Tabs defaultValue="profile" className="mt-6">
                    <TabsList className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-2">
                        <TabsTrigger value="profile" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
                            <User className="h-4 w-4 mr-2"/>
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="account" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
                            <Settings className="h-4 w-4 mr-2"/>
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
                            <Shield className="h-4 w-4 mr-2"/>
                            Security
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="data-[state=active]:bg-[#171717] rounded-xl px-6 py-3">
                            <Bell className="h-4 w-4 mr-2"/>
                            Notifications
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-6">
                        <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8">
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="/placeholder.svg?height=96&width=96"/>
                                        <AvatarFallback className="bg-[#171717] text-white text-2xl">JD</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="icon"
                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Camera className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">John Doe</h3>
                                    <p className="text-gray-400">Administrator</p>
                                    <p className="text-sm text-gray-500">Last login: 2 hours ago</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="firstName" className="text-gray-300">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        defaultValue="John"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="lastName" className="text-gray-300">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        defaultValue="Doe"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-gray-300">
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
                                    <Label htmlFor="phone" className="text-gray-300">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        defaultValue="+1 (555) 123-4567"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8">Save Changes</Button>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account" className="mt-6">
                        <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6">Account Settings</h3>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="username" className="text-gray-300">
                                        Username
                                    </Label>
                                    <Input
                                        id="username"
                                        defaultValue="johndoe"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="timezone" className="text-gray-300">
                                        Timezone
                                    </Label>
                                    <Input
                                        id="timezone"
                                        defaultValue="UTC-5 (Eastern Time)"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="language" className="text-gray-300">
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

                    <TabsContent value="security" className="mt-6">
                        <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-gray-300">Two-Factor Authentication</Label>
                                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                                    </div>
                                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth}/>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="currentPassword" className="text-gray-300">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="newPassword" className="text-gray-300">
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="confirmPassword" className="text-gray-300">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="bg-[#171717] border-[#2a2a2a] text-white rounded-2xl h-12"
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-6">
                        <Card className="bg-[#1f1f1f] border-[#2a2a2a] rounded-3xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-gray-300">Email Notifications</Label>
                                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications}/>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-gray-300">Push Notifications</Label>
                                        <p className="text-sm text-gray-400">Receive push notifications</p>
                                    </div>
                                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications}/>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </ModalContent>
        </Modal>
    )
}
