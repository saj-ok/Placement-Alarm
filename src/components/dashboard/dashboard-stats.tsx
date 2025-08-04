"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react"

// Mock data for dashboard
const mockCompanies = [
  { _id: "1", name: "Google", role: "Software Engineer", status: "Interview", package: "₹50 LPA" },
  { _id: "2", name: "Microsoft", role: "SDE-1", status: "Applied", package: "₹45 LPA" },
  { _id: "3", name: "Amazon", role: "Software Developer", status: "Offer", package: "₹42 LPA" },
  { _id: "4", name: "Meta", role: "Frontend Engineer", status: "Rejected", package: "₹48 LPA" },
  { _id: "5", name: "Netflix", role: "Full Stack Developer", status: "Interview", package: "₹55 LPA" },
  { _id: "6", name: "Apple", role: "iOS Developer", status: "Applied", package: "₹52 LPA" },
  { _id: "7", name: "Tesla", role: "Software Engineer", status: "Offer", package: "₹60 LPA" },
  { _id: "8", name: "Spotify", role: "Backend Engineer", status: "Interview", package: "₹46 LPA" },
]

export function DashboardStats() {
  const companies = mockCompanies

  const stats = [
    {
      name: "Total Applications",
      value: companies.length.toString(),
      icon: Building2,
      change: "+12%",
      changeType: "positive" as const,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      name: "Active Interviews",
      value: companies.filter((c) => c.status === "Interview").length.toString(),
      icon: Clock,
      change: "+23%",
      changeType: "positive" as const,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      name: "Offers Received",
      value: companies.filter((c) => c.status === "Offer").length.toString(),
      icon: CheckCircle,
      change: "+8%",
      changeType: "positive" as const,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10",
    },
    {
      name: "Rejections",
      value: companies.filter((c) => c.status === "Rejected").length.toString(),
      icon: XCircle,
      change: "-5%",
      changeType: "negative" as const,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-0 sm:grid-cols-2 lg:grid-cols-4 ">
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className=" w-48 h-48 rounded-4xl  border-white/10 hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={stat.changeType === "positive" ? "text-emerald-400" : "text-red-400"}>
                  {stat.change}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-center">
              <h3 className="text-sm font-medium text-slate-400">{stat.name}</h3>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
