"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import type { Sphere } from "@/lib/api"

interface EditSphereModalProps {
  isOpen: boolean
  onCloseAction: () => void
  onEditAction: (sphereData: any) => void
  sphere: Sphere | null
}

export function EditSphereModal({ isOpen, onCloseAction, sphere, onEditAction }: EditSphereModalProps) {
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    description: "",
    type: "public",
    icon: "",
    coreHubId: "",
    userId: "",
    isActive: true,
  })

  useEffect(() => {
    if (sphere) {
      setFormData({
        id: sphere.id,
        name: sphere.name,
        description: sphere.description ?? "",
        type: (sphere.type === "private" || sphere.isPrivate) ? "private" : "public",
        icon: sphere.icon ?? "",
        coreHubId: sphere.coreHubId ?? "",
        userId: sphere.userId ?? "",
        isActive: sphere.isActive,
      })
    }
  }, [sphere])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sphere) return
    const payload = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      isPrivate: formData.type === "private",
      icon: formData.icon,
      coreHubId: formData.coreHubId,
      userId: formData.userId,
      isActive: formData.isActive,
    }
    onEditAction(payload)
    onCloseAction()
  }

  if (!sphere) return null

  return (
    <Modal open={isOpen} onOpenChange={onCloseAction}>
      <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438]">
        <ModalHeader>
          <ModalTitle className="text-[#98a891]">Edit Sphere</ModalTitle>
          <ModalDescription className="text-[#98a891]/70">Update sphere information and settings.</ModalDescription>
          <ModalCloseButton />
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sphere-name" className="text-[#98a891]">Name</Label>
                <Input
                  id="edit-sphere-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#98a891]">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev: any) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121212] border-[#3c4438] rounded-2xl">
                    <SelectItem value="public" className="hover:bg-[#1a1a1a]">Public</SelectItem>
                    <SelectItem value="private" className="hover:bg-[#1a1a1a]">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sphere-description" className="text-[#98a891]">Description</Label>
              <Input
                id="edit-sphere-description"
                value={formData.description}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sphere-icon" className="text-[#98a891]">Icon</Label>
                <Input
                  id="edit-sphere-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, icon: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sphere-coreHubId" className="text-[#98a891]">Core Hub ID</Label>
                <Input
                  id="edit-sphere-coreHubId"
                  value={formData.coreHubId}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, coreHubId: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sphere-userId" className="text-[#98a891]">Owner User ID</Label>
              <Input
                id="edit-sphere-userId"
                value={formData.userId}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, userId: e.target.value }))}
                className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseAction}
              className="border-[#3c4438] text-[#98a891] hover:bg-[#1a1a1a] rounded-2xl bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#98a891] hover:bg-[#98a891]/80 text-[#121212] rounded-2xl">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
