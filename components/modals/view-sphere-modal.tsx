"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Globe, Shield, Clock, Calendar } from "lucide-react"
import type { Sphere } from "@/lib/api"

interface ViewSphereModalProps {
  isOpen: boolean
  onCloseAction: () => void
  sphere: Sphere | null
  onEditAction?: (sphere: Sphere) => void
}

export function ViewSphereModal({ isOpen, onCloseAction, sphere, onEditAction }: ViewSphereModalProps) {
  if (!sphere) return null

  const initials = sphere.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Modal open={isOpen} onOpenChange={onCloseAction}>
      <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438]">
        <ModalHeader>
          <ModalTitle className="text-[#98a891]">Sphere Details</ModalTitle>
          <ModalDescription className="text-[#98a891]/70">
            View detailed information about this sphere.
          </ModalDescription>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#98a891]/20 text-[#98a891] text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-[#98a891]">{sphere.name}</h3>
              <p className="text-[#98a891]/70">{sphere.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-[#98a891]/70" />
                <div>
                  <p className="text-sm text-[#98a891]/70">Type</p>
                  <Badge
                    variant="secondary"
                    className={`rounded-xl px-3 py-1 border ${
                      sphere.type === "public"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                  >
                    {sphere.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-[#98a891]/70" />
                <div>
                  <p className="text-sm text-[#98a891]/70">Status</p>
                  <Badge
                    variant="secondary"
                    className={`rounded-xl px-3 py-1 border ${
                      sphere.isActive
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {sphere.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#98a891]/70" />
                <div>
                  <p className="text-sm text-[#98a891]/70">Last Updated</p>
                  <p className="text-[#98a891]">{sphere.updatedAt}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-[#98a891]/70" />
                <div>
                  <p className="text-sm text-[#98a891]/70">Created</p>
                  <p className="text-[#98a891]">{sphere.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-[#98a891]">Metadata</h4>
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#3c4438]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#98a891]/70">Sphere ID:</span>
                  <span className="ml-2 text-[#98a891] font-mono">#{sphere.id}</span>
                </div>
                <div>
                  <span className="text-[#98a891]/70">Icon:</span>
                  <span className="ml-2 text-[#98a891]">{sphere.icon || "-"}</span>
                </div>
                <div>
                  <span className="text-[#98a891]/70">Core Hub ID:</span>
                  <span className="ml-2 text-[#98a891]">{sphere.coreHubId || "-"}</span>
                </div>
                <div>
                  <span className="text-[#98a891]/70">Owner User ID:</span>
                  <span className="ml-2 text-[#98a891]">{sphere.userId || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onCloseAction}
            className="border-[#3c4438] text-[#98a891] hover:bg-[#1a1a1a] rounded-2xl bg-transparent"
          >
            Close
          </Button>
          {onEditAction && (
            <Button onClick={() => onEditAction(sphere)} className="bg-[#98a891] hover:bg-[#98a891]/80 text-[#121212] rounded-2xl">
              Edit Sphere
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
