"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyTable } from "./company-table"
import { CompanyFilters } from "./company-filters"
import { Building2, Filter } from "lucide-react"

export function CompanyDirectory() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    driveType: "all",
  })


  return (
    <Card className=" border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Company Applications</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Manage your job applications</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter & Search</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <CompanyFilters filters={filters} onFiltersChange={setFilters} />
        <CompanyTable filters={filters}  />
      </CardContent>
    </Card>
  )
}
