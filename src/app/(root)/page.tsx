import { CompanyDirectory } from "@/components/dashboard/company-directory"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardLayout } from "@/components/layout/dashboard-layout"




export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardStats />
        <CompanyDirectory />
      </div>
    </DashboardLayout>
  )
}
