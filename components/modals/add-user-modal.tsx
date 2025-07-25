"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    ModalCloseButton,
} from "@/components/ui/modal"

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (userData: any) => void
    onUserAdded?: (user: any) => void
}

export function AddUserModal({ isOpen, onClose, onAdd, onUserAdded }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        status: "",
        permissions: {
            read: false,
            write: false,
            delete: false,
            admin: false,
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(formData)
        setFormData({
            name: "",
            email: "",
            role: "",
            status: "",
            permissions: {
                read: false,
                write: false,
                delete: false,
                admin: false,
            },
        })
        onClose()
    }

    const handlePermissionChange = (permission: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: checked,
            },
        }))
    }

    type PermissionKey = "read" | "write" | "delete" | "admin";
    const permissionKeys: PermissionKey[] = ["read", "write", "delete", "admin"];

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438] select-none">
                <ModalHeader>
                    <ModalTitle className="text-[#98a891] select-none">Add New User</ModalTitle>
                    <ModalDescription className="text-[#98a891]/70 select-none">
                        Create a new user account with the specified details and permissions.
                    </ModalDescription>
                    <ModalCloseButton />
                </ModalHeader>

                <form onSubmit={handleSubmit}>
                    <ModalBody className="space-y-6 select-none">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[#98a891] select-none">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl select-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#98a891] select-none">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl select-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#98a891] select-none">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                                >
                                    <SelectTrigger className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl select-none">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#121212] border-[#3c4438] rounded-2xl select-none">
                                        <SelectItem value="User" className="hover:bg-[#1a1a1a] select-none">
                                            User
                                        </SelectItem>
                                        <SelectItem value="Editor" className="hover:bg-[#1a1a1a] select-none">
                                            Editor
                                        </SelectItem>
                                        <SelectItem value="Admin" className="hover:bg-[#1a1a1a] select-none">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#98a891] select-none">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                >
                                    <SelectTrigger className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl select-none">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#121212] border-[#3c4438] rounded-2xl select-none">
                                        <SelectItem value="Active" className="hover:bg-[#1a1a1a] select-none">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Inactive" className="hover:bg-[#1a1a1a] select-none">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[#98a891] font-semibold select-none">Permissions</Label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Custom radio-style toggle buttons for permissions */}
                                {permissionKeys.map((perm) => (
                                    <button
                                        key={perm}
                                        type="button"
                                        className={`flex items-center w-full px-4 py-2 rounded-2xl border transition-colors
                                            ${formData.permissions[perm]
                                                ? "bg-[#98a891] text-[#121212] border-[#98a891]"
                                                : "bg-[#1a1a1a] text-[#98a891] border-[#3c4438] hover:bg-[#232323]"}
                                            select-none`}
                                        onClick={() => handlePermissionChange(perm, !formData.permissions[perm])}
                                        tabIndex={0}
                                    >
                                        <span
                                            className={`inline-block w-4 h-4 mr-2 rounded-full border
                                                ${formData.permissions[perm]
                                                    ? "bg-[#121212] border-[#98a891]"
                                                    : "bg-[#232323] border-[#3c4438]"}`}
                                        />
                                        <span className="capitalize select-none">{perm}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-[#3c4438] text-[#98a891] hover:bg-[#1a1a1a] rounded-2xl bg-transparent select-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#98a891] hover:bg-[#98a891]/80 text-[#121212] rounded-2xl select-none"
                        >
                            Add User
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}