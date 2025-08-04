"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit } from "lucide-react"
import { StatusUpdateModal } from "./status-update-modal"

// Mock data - replace with Convex query
const mockCompanies = [
  {
    id: "1",
    name: "Google",
    role: "Software Engineer",
    package: "₹50 LPA",
    appliedDate: "2024-01-15",
    status: "Interview",
    driveType: "On-Campus",
  },
  {
    id: "2",
    name: "Microsoft",
    role: "SDE-1",
    package: "₹45 LPA",
    appliedDate: "2024-01-10",
    status: "Applied",
    driveType: "Off-Campus",
  },
  {
    id: "3",
    name: "Amazon",
    role: "Software Developer",
    package: "₹42 LPA",
    appliedDate: "2024-01-08",
    status: "Offer",
    driveType: "On-Campus",
  },
]

interface CompanyTableProps {
  filters: {
    search: string
    status: string
    driveType: string
    dateRange: string
  }
}

export function CompanyTable({ filters }: CompanyTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800"
      case "Interview":
        return "bg-yellow-100 text-yellow-800"
      case "Offer":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Drive Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.role}</TableCell>
                <TableCell>{company.package}</TableCell>
                <TableCell>{company.appliedDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                </TableCell>
                <TableCell>{company.driveType}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/companies/${company.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(company.id)}>
                      <Edit className="h-4 w-4" />
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
      />
    </>
  )
}
