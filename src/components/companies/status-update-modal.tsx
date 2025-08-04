"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

interface StatusUpdateModalProps {
  companyId: string | null
  isOpen: boolean
  onClose: () => void
}

export function StatusUpdateModal({ companyId, isOpen, onClose }: StatusUpdateModalProps) {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (!status || !companyId) return

    setIsLoading(true)
    try {
      // TODO: Call Convex mutation to update status
      toast.success("Status updated successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>Change the status of this job application.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!status || isLoading}>
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
