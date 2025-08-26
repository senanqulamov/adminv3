"use client"

import type React from "react"
import { useState } from "react"
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

interface AddSphereModalProps {
  isOpen: boolean
  onCloseAction: () => void
  onAddAction: (sphereData: any) => void
}

export function AddSphereModal({ isOpen, onCloseAction, onAddAction }: AddSphereModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "public" as "public" | "private",
    icon: "",
    coreHubId: "",
    userId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      isPrivate: formData.type === "private",
    }
    onAddAction(payload)
    setFormData({ name: "", description: "", type: "public", icon: "", coreHubId: "", userId: "" })
    onCloseAction()
  }

  return (
    <Modal open={isOpen} onOpenChange={onCloseAction}>
      <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438] select-none">
        <ModalHeader>
          <ModalTitle className="text-[#98a891] select-none">Add New Sphere</ModalTitle>
          <ModalDescription className="text-[#98a891]/70 select-none">
            Create a new sphere with the specified details.
          </ModalDescription>
          <ModalCloseButton />
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-6 select-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sphere-name" className="text-[#98a891]">Name</Label>
                <Input
                  id="sphere-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sphere-type" className="text-[#98a891]">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "public" | "private") => setFormData((prev) => ({ ...prev, type: value }))}
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
              <Label htmlFor="sphere-description" className="text-[#98a891]">Description</Label>
              <Input
                id="sphere-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sphere-icon" className="text-[#98a891]">Icon</Label>
                <Input
                  id="sphere-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sphere-coreHubId" className="text-[#98a891]">Core Hub ID</Label>
                <Input
                  id="sphere-coreHubId"
                  value={formData.coreHubId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coreHubId: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3c4438] text-[#98a891] rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sphere-userId" className="text-[#98a891]">Owner User ID</Label>
              <Input
                id="sphere-userId"
                value={formData.userId}
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
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
              Add Sphere
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
