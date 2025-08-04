"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    package: "",
    driveType: "",
    deadline: "",
    link: "",
    type: "",
    status: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const addCompany = useMutation(api.companies.addCompany);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.role || !formData.package || !formData.driveType || !formData.deadline || !formData.type) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      
      await addCompany(formData);

      toast.success("Company added successfully")
      setFormData({ name: "", role: "", package: "", driveType: "", deadline: "", link: "", type: "", status: "" })
      onClose()
    } catch (error) {
      toast.error("Failed to add company")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Company Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Google"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">
                Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Software Engineer"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="package" className="text-gray-300">
                Package
              </Label>
              <Input
                id="package"
                value={formData.package}
                onChange={(e) => updateField("package", e.target.value)}
                placeholder="₹50 LPA"
                className=" bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driveType" className="text-gray-300">
                Drive Type
              </Label>
              <Select value={formData.driveType} onValueChange={(value) => updateField("driveType", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="On-Campus" className="text-white hover:bg-gray-700">
                    On-Campus
                  </SelectItem>
                  <SelectItem value="Off-Campus" className="text-white hover:bg-gray-700">
                    Off-Campus
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-gray-300">
                Deadline
              </Label>
              <Input
                type="date"
                id="deadline"
                value={formData.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                className={`w-44 bg-gray-700 border-gray-600 ${formData.deadline ? 'text-white' : 'text-gray-400'} placeholder:text-gray-400`}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-gray-300">
                Apply Link
              </Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => updateField("link", e.target.value)}
                placeholder="https://company.com"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driveType" className="text-gray-300">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => updateField("type", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Intern + FTE" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Intern" className="text-white hover:bg-gray-700">
                    Intern
                  </SelectItem>
                  <SelectItem value="Intern + FTE" className="text-white hover:bg-gray-700">
                    Intern + FTE
                  </SelectItem>
                  <SelectItem value="Intern + PPO" className="text-white hover:bg-gray-700">
                    Intern + PPO
                  </SelectItem>
                  <SelectItem value="Job" className="text-white hover:bg-gray-700">
                    Job
                  </SelectItem>
                  <SelectItem value="Hackathon" className="text-white hover:bg-gray-700">
                    Hackathon
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 ">
              <Label htmlFor="status" className="text-gray-300">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="Not Applied" className="text-white hover:bg-gray-700">Not Applied</SelectItem>
                  <SelectItem value="Applied" className="text-white hover:bg-gray-700">Applied</SelectItem>
                  <SelectItem value="Shortlisted" className="text-white hover:bg-gray-700">Shortlisted</SelectItem>
                  <SelectItem value="Pre Placement Talk" className="text-white hover:bg-gray-700">Pre Placement Talk</SelectItem>
                  <SelectItem value="OA" className="text-white hover:bg-gray-700">OA</SelectItem>
                  <SelectItem value="Aptitude round" className="text-white hover:bg-gray-700">Aptitude round</SelectItem>
                  <SelectItem value="GD" className="text-white hover:bg-gray-700">GD</SelectItem>
                  <SelectItem value="Technical round" className="text-white hover:bg-gray-700">Technical round</SelectItem>
                  <SelectItem value="Interview" className="text-white hover:bg-gray-700">Interview</SelectItem>
                  <SelectItem value="Offer" className="text-white hover:bg-gray-700">Offer</SelectItem>
                  <SelectItem value="Rejected" className="text-white hover:bg-gray-700">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Company"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
