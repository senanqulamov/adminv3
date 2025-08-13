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
import { User, Shield, Clock, Calendar } from "lucide-react"
import type { User as UserType } from "@/lib/api"

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onEdit?: (user: UserType) => void
}

export function ViewUserModal({ isOpen, onClose, user, onEdit }: ViewUserModalProps) {
  if (!user) return null

  return (
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent className="max-w-2xl bg-[#121212] border-[#3c4438]">
          <ModalHeader>
            <ModalTitle className="text-[#98a891]">User Details</ModalTitle>
            <ModalDescription className="text-[#98a891]/70">
              View detailed information about this user account.
            </ModalDescription>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-[#98a891]/20 text-[#98a891] text-lg">
                  {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-[#98a891]">{user.name}</h3>
                <p className="text-[#98a891]/70">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-[#98a891]/70" />
                  <div>
                    <p className="text-sm text-[#98a891]/70">Role</p>
                    <Badge
                        variant="secondary"
                        className="bg-[#98a891]/20 text-[#98a891] border border-[#98a891]/30 rounded-xl"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-[#98a891]/70" />
                  <div>
                    <p className="text-sm text-[#98a891]/70">Status</p>
                    <Badge
                        variant="secondary"
                        className={`rounded-xl border ${
                            user.isVerified
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                    >
                      {user.isVerified ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-[#98a891]/70" />
                  <div>
                    <p className="text-sm text-[#98a891]/70">Last Login</p>
                    <p className="text-[#98a891]">{user.lastLogin}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#98a891]/70" />
                  <div>
                    <p className="text-sm text-[#98a891]/70">Member Since</p>
                    <p className="text-[#98a891]">
                      {user.createdAt
                          ? new Date(user.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })
                          : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-[#98a891]">Account Information</h4>
              <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#3c4438]">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#98a891]/70">User ID:</span>
                    <span className="ml-2 text-[#98a891] font-mono">#{user.id}</span>
                  </div>
                  <div>
                    <span className="text-[#98a891]/70">Account Type:</span>
                    <span className="ml-2 text-[#98a891]">Standard</span>
                  </div>
                  <div>
                    <span className="text-[#98a891]/70">Department:</span>
                    <span className="ml-2 text-[#98a891]">Engineering</span>
                  </div>
                  <div>
                    <span className="text-[#98a891]/70">Location:</span>
                    <span className="ml-2 text-[#98a891]">Remote</span>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
                variant="outline"
                onClick={onClose}
                className="border-[#3c4438] text-[#98a891] hover:bg-[#1a1a1a] rounded-2xl bg-transparent"
            >
              Close
            </Button>
            {onEdit && (
                <Button onClick={() => onEdit(user)} className="bg-[#98a891] hover:bg-[#98a891]/80 text-[#121212] rounded-2xl">
                  Edit User
                </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}