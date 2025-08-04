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
        <div
          className={`bg-blue-50 border border-blue-300 text-blue-800 px-4 py-2 rounded shadow flex items-center space-x-2 ${
        t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <LogIn className="w-5 h-5 text-blue-500" />
          <span>Please sign in to add a company.</span>
        </div>
      ))
      return

    }
    setIsModalOpen(true)  
 }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up mr-32">
        <div className="space-y-2 ">
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-slate-400 text-lg">Track your applications and land your dream job</p>
        </div>

        <div className="flex items-start gap-16">
          <Button
            onClick={handleAddCompany}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover-glow transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>

          <Unauthenticated>
            <div
              className="cursor-pointer bg-blue-500 hover:bg-blue-600  text-white border-0 shadow-lg flex items-center gap-2 px-4 py-2 rounded transition-all duration-300"
            >
              <LogIn className="h-4 w-4 mr-2" />
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
