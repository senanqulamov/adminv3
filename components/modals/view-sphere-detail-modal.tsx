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
import toast from "react-hot-toast"

interface ViewSphereDetailModalProps {
  isOpen: boolean
  onCloseAction: () => void
  sphere: Sphere | null
}

export function ViewSphereDetailModal({ isOpen, onCloseAction, sphere }: ViewSphereDetailModalProps) {
  if (!sphere) return null

  const initials = sphere.name
    .split(" ")
    .map((n: any) => n[0])
    .join("")

  const toastStyle = {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  }

  const handleCopyId = () => {
    toast.promise(
      navigator.clipboard.writeText(sphere.id),
      {
        loading: "Copying...",
        success: <b style={toastStyle}>ID of {sphere.name} copied!</b>,
        error: <b style={toastStyle}>Could not copy.</b>,
      },
      { style: toastStyle }
    )
  }

  return (
    <Modal open={isOpen} onOpenChange={onCloseAction}>
      <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438]">
        <ModalHeader>
          <ModalTitle className="text-[#98a891] flex items-center gap-1">
            <Badge variant="secondary" className="bg-orange-50/20 text-orange-500 border border-orange-500/30 rounded-xl px-3 py-1">
              {sphere.name}
            </Badge>
            <Badge
              onClick={handleCopyId}
              variant="secondary"
              className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl px-3 py-1 cursor-pointer"
            >
              {sphere.id}
            </Badge>
          </ModalTitle>
          <ModalDescription className="text-[#98a891]/70">
            Detailed information about the sphere, including type, status, and timestamps.
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
