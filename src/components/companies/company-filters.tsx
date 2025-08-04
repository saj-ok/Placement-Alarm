"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyFiltersProps {
  filters: {
    search: string
    status: string
    driveType: string
    dateRange: string
  }
  onFiltersChange: (filters: any) => void
}

export function CompanyFilters({ filters, onFiltersChange }: CompanyFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search companies..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>
      <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="offer">Offer</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.driveType} onValueChange={(value) => updateFilter("driveType", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Drive Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="on-campus">On-Campus</SelectItem>
          <SelectItem value="off-campus">Off-Campus</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
