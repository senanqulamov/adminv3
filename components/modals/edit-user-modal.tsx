"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { User } from "@/lib/api"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onEdit: (userData: any) => void
}

export function EditUserModal({ isOpen, onClose, user, onEdit }: EditUserModalProps) {
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    email: "",
    role: "User",
    status: "Active",
    lastLogin: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    onEdit(formData)
    onClose()
  }

  if (!user) return null

  return (
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438]">
          <ModalHeader>
            <ModalTitle className="text-[#98a891]">Edit User</ModalTitle>
            <ModalDescription className="text-[#98a891]/70">
              Update user information and settings.
            </ModalDescription>
            <ModalCloseButton />
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-[#98a891]">
                    Full Name
                  </Label>
                  <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                      className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-[#98a891]">
                    Email Address
                  </Label>
                  <Input
                      id="edit-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                      className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                      required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#98a891]">Role</Label>
                  <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#3c4438] rounded-2xl">
                      <SelectItem value="User" className="hover:bg-[#1a1a1a]">
                        User
                      </SelectItem>
                      <SelectItem value="Editor" className="hover:bg-[#1a1a1a]">
                        Editor
                      </SelectItem>
                      <SelectItem value="Admin" className="hover:bg-[#1a1a1a]">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#98a891]">Status</Label>
                  <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev: any) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#3c4438] rounded-2xl">
                      <SelectItem value="Active" className="hover:bg-[#1a1a1a]">
                        Active
                      </SelectItem>
                      <SelectItem value="Inactive" className="hover:bg-[#1a1a1a]">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#3c4438]">
                <h4 className="font-semibold text-[#98a891] mb-2">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#98a891]/70">User ID:</span>
                    <span className="ml-2 text-[#98a891] font-mono">#{user.id}</span>
                  </div>
                  <div>
                    <span className="text-[#98a891]/70">Last Login:</span>
                    <span className="ml-2 text-[#98a891]">{user.lastLogin}</span>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#3c4438] text-[#98a891] hover:bg-[#1a1a1a] rounded-2xl bg-transparent"
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  className="bg-[#98a891] hover:bg-[#98a891]/80 text-[#121212] rounded-2xl"
              >
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
  )
}