"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, LogIn } from "lucide-react"
import { AddCompanyModal } from "./add-company-modal"
import { SignedIn,  SignInButton, UserButton } from "@clerk/nextjs"
import { Unauthenticated } from "convex/react"
import { useAuth } from "@clerk/nextjs"
import toast from "react-hot-toast"

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isSignedIn } = useAuth()

 const handleAddCompany = () => {
    if(!isSignedIn) {
      toast.custom((t) => (
        <div className={`bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm border border-blue-400/30 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-3 transform transition-all duration-300 ${
          t.visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}>
          <LogIn className="w-5 h-5 text-blue-500" />
          <span className="font-medium">Please sign in to add a company.</span>
        </div>
      ))
      return

    }
    setIsModalOpen(true)  
 }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mr-32" style={{
        animation: "fadeInUp 0.8s ease-out"
      }}>
        <div className="space-y-2 ">
          <div className="flex items-center space-x-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <Sparkles className="h-7 w-7 text-yellow-400" style={{
              animation: "pulse 2s ease-in-out infinite"
            }} />
          </div>
          <p className="text-slate-300 text-lg font-medium">Track your applications and land your dream job</p>
        </div>

        <div className="flex items-start gap-16">
          <Button
            onClick={handleAddCompany}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 px-6 py-3 text-base font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>

          <Unauthenticated>
            <div
              className="cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <LogIn className="h-5 w-5 mr-2" />
              <SignInButton mode="modal">
                <span>Sign In</span>
              </SignInButton>
            </div>
          </Unauthenticated>
          <SignedIn><UserButton /></SignedIn>

        </div>
      </div>
      <AddCompanyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
