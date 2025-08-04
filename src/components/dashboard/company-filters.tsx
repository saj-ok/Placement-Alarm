"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface CompanyFiltersProps {
  filters: {
    search: string
    status: string
    driveType: string
  }
  onFiltersChange: (filters: any) => void
}

export function CompanyFilters({ filters, onFiltersChange }: CompanyFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      driveType: "all",
      dateRange: "all",
    })
  }

  const hasActiveFilters = filters.search || filters.status !== "all" || filters.driveType !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-4 animate-slide-in">
      <div className="flex-1">
        <Input
          placeholder="Search companies or roles..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-all duration-200"
        />
      </div>
      <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="all" className="text-white hover:bg-gray-700">
            All Status
          </SelectItem>
          <SelectItem value="applied" className="text-white hover:bg-gray-700">
            Applied
          </SelectItem>
          <SelectItem value="interview" className="text-white hover:bg-gray-700">
            Interview
          </SelectItem>
          <SelectItem value="offer" className="text-white hover:bg-gray-700">
            Offer
          </SelectItem>
          <SelectItem value="rejected" className="text-white hover:bg-gray-700">
            Rejected
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.driveType} onValueChange={(value) => updateFilter("driveType", value)}>
        <SelectTrigger className="w-full sm:w-[180px] bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Drive Type" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="all" className="text-white hover:bg-gray-700">
            All Types
          </SelectItem>
          <SelectItem value="oncampus" className="text-white hover:bg-gray-700">
            On-Campus
          </SelectItem>
          <SelectItem value="offcampus" className="text-white hover:bg-gray-700">
            Off-Campus
          </SelectItem>
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full sm:w-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  )
}
