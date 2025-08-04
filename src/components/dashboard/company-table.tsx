"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Building2 } from "lucide-react"
import toast from "react-hot-toast"
import { StatusUpdateModal } from "./status-update-modal"

// Add "type" to each company
const mockCompanies = [
  {
    _id: "1",
    name: "Google",
    role: "Software Engineer",
    package: "₹50 LPA",
    appliedDate: "2024-01-15",
    status: "Interview",
    driveType: "On-Campus",
    registrationLink: "https://careers.google.com/jobs/1",
    type: "Intern+FTE", // ✅ new field
  },
  {
    _id: "2",
    name: "Microsoft",
    role: "SDE-1",
    package: "₹45 LPA",
    appliedDate: "2024-01-10",
    status: "Applied",
    driveType: "Off-Campus",
    registrationLink: "https://careers.microsoft.com/jobs/2",
    type: "Intern",
  },
  {
    _id: "3",
    name: "Amazon",
    role: "Software Developer",
    package: "₹42 LPA",
    appliedDate: "2024-01-08",
    status: "Offer",
    driveType: "On-Campus",
    registrationLink: "https://www.amazon.jobs/en/jobs/3",
    type: "Intern+PPO",
  },
  {
    _id: "4",
    name: "Meta",
    role: "Frontend Engineer",
    package: "₹48 LPA",
    appliedDate: "2024-01-12",
    status: "Rejected",
    driveType: "Off-Campus",
    registrationLink: "https://www.metacareers.com/jobs/4",
    type: "Job",
  },
  {
    _id: "5",
    name: "Netflix",
    role: "Full Stack Developer",
    package: "₹55 LPA",
    appliedDate: "2024-01-20",
    status: "Interview",
    driveType: "On-Campus",
    registrationLink: "https://jobs.netflix.com/positions/5",
    type: "Hackathon",
  },
  {
    _id: "6",
    name: "Apple",
    role: "iOS Developer",
    package: "₹52 LPA",
    appliedDate: "2024-01-18",
    status: "Applied",
    driveType: "Off-Campus",
    registrationLink: "https://www.apple.com/jobs/us/6",
    type: "Job",
  },
]

interface CompanyTableProps {
  filters: {
    search: string
    status: string
    driveType: string
  }
}

export function CompanyTable({ filters }: CompanyTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [companies, setCompanies] = useState(mockCompanies)

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.role.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus =
      filters.status === "all" ||
      company.status.toLowerCase() === filters.status
    const matchesDriveType =
      filters.driveType === "all" ||
      company.driveType
        .toLowerCase()
        .replace("-", "") === filters.driveType.replace("-", "")

    return matchesSearch && matchesStatus && matchesDriveType
  })

  const handleDelete = async (companyId: string) => {
    try {
      setCompanies((prev) => prev.filter((c) => c._id !== companyId))
      toast.success("Company deleted successfully")
    } catch (error) {
      toast.error("Failed to delete company")
    }
  }

  const handleStatusUpdate = (companyId: string, newStatus: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c._id === companyId ? { ...c, status: newStatus } : c
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Applied":
        return "bg-gray-700/20 text-gray-300 border-gray-700/30"
      case "Applied":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Shortlisted":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Pre Placement Talk":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
      case "OA":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "Aptitude round":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "GD":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30"
      case "Technical round":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Interview":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Offer":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }


  if (companies.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="mx-auto h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-400">
          No companies added yet. Click "Add Company" to get started!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-950">
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-300">Company</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Package</TableHead>
              <TableHead className="text-gray-300">Deadline</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Drive Type</TableHead>
              <TableHead className="text-gray-300">
                Registration Link
              </TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company, index) => (
              <TableRow
                key={company._id}
                className="border-gray-700 hover:bg-gray-800/50 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell className="font-medium text-white">
                  {company.name}
                </TableCell>
                <TableCell className="text-gray-300">
                  {company.role}
                </TableCell>
                <TableCell className="text-gray-300">
                  {company.type}
                </TableCell>

                <TableCell className="text-gray-300 font-semibold">
                  {company.package}
                </TableCell>
                <TableCell className="text-gray-400">
                  {formatDate(company.appliedDate)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(company.status)} border`}
                  >
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {company.driveType}
                </TableCell>
                <TableCell>
                  <a
                    href={company.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Register
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSelectedCompany(company._id)
                      }
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(company._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StatusUpdateModal
        companyId={selectedCompany}
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onSuccess={(companyId, status) => {
          handleStatusUpdate(companyId, status)
        }}
        companies={companies}
      />
    </>
  )
}
