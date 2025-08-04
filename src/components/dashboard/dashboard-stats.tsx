"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, Clock, CheckCircle, XCircle } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useUser } from "@clerk/nextjs"

export function DashboardStats() {
  const { user } = useUser()
  const companies = useQuery(api.companies.getAllCompanies, { userId: user?.id ?? "" }) || []

  // Calculate stats from real data
  const totalApplications = companies.length
  const activeInterviews = companies.filter((c) => 
    c.status === "Interview" || c.status === "Technical round"
  ).length
  const offersReceived = companies.filter((c) => c.status === "Offer").length
  const rejections = companies.filter((c) => c.status === "Rejected").length

  const stats = [
    {
      name: "Total Applications",
      value: totalApplications.toString(),
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      name: "Active Interviews",
      value: activeInterviews.toString(),
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      name: "Offers Received",
      value: offersReceived.toString(),
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/10 to-green-500/10",
    },
    {
      name: "Rejections",
      value: rejections.toString(),
      icon: XCircle,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
    },
  ]

  if (!user) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="w-full max-w-sm mx-auto h-48 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gray-700/50 w-12 h-12"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-center">
                <div className="h-4 bg-gray-700/50 rounded w-24 mx-auto"></div>
                <div className="h-8 bg-gray-700/50 rounded w-16 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-0  sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className="  mx-auto w-44 h-44 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:border-gray-600/50 backdrop-blur-sm"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-center">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent >
            <div className="space-y-1 text-center">
              <h3 className="text-sm font-medium text-slate-300 leading-tight">{stat.name}</h3>
              <div className="text-4xl font-bold text-white tracking-tight">{stat.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}