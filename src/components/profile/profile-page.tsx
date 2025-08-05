"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone, Mail, Edit3, Save, X, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

export function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
  })

  // Get user profile from Convex
  const profile = useQuery(
    api.profiles.getUserProfile,
    user?.id ? { userId: user.id } : "skip"
  )

  // Mutation to update profile
  const upsertProfile = useMutation(api.profiles.upsertProfile)

  // Initialize form data when user or profile loads
  useEffect(() => {
    if (user && isLoaded) {
      setFormData({
        name: profile?.name || user.fullName || "",
        email: profile?.email || user.primaryEmailAddress?.emailAddress || "",
        whatsappNumber: profile?.whatsappNumber || "",
      })
    }
  }, [user, profile, isLoaded])

  const handleSave = async () => {
    if (!user) return

    try {
      await upsertProfile({
        userId: user.id,
        name: formData.name,
        email: formData.email,
        whatsappNumber: formData.whatsappNumber || undefined,
        profileImage: user.imageUrl || undefined,
      })
      
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Profile update error:", error)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (user && isLoaded) {
      setFormData({
        name: profile?.name || user.fullName || "",
        email: profile?.email || user.primaryEmailAddress?.emailAddress || "",
        whatsappNumber: profile?.whatsappNumber || "",
      })
    }
    setIsEditing(false)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="h-8 w-8 bg-gray-700 rounded-xl"></div>
          <div className="h-8 w-48 bg-gray-700 rounded"></div>
        </div>
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-24 w-24 bg-gray-700 rounded-full mx-auto"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-10 bg-gray-700 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 text-lg">Please sign in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ animation: "fadeInUp 0.8s ease-out" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-300 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-slate-300 text-lg font-medium">Manage your account information</p>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/70"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src={user.imageUrl || "/default-avatar.png"}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full border-4 border-gradient-to-r from-purple-500 to-blue-600 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl text-white font-bold">
            {formData.name || "User Profile"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300 font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              disabled={!isEditing}
              className={`bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 transition-all duration-300 ${
                isEditing ? "focus:border-purple-500 focus:bg-gray-700/70" : "opacity-70"
              }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={!isEditing}
              className={`bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 transition-all duration-300 ${
                isEditing ? "focus:border-purple-500 focus:bg-gray-700/70" : "opacity-70"
              }`}
              placeholder="Enter your email address"
            />
          </div>

          {/* WhatsApp Number Field */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-gray-300 font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              WhatsApp Number
              <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                For Deadline Reminders
              </span>
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => updateField("whatsappNumber", e.target.value)}
              disabled={!isEditing}
              className={`bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 transition-all duration-300 ${
                isEditing ? "focus:border-purple-500 focus:bg-gray-700/70" : "opacity-70"
              }`}
              placeholder="+91 9876543210"
            />
            <p className="text-xs text-gray-400 mt-1">
              Include country code (e.g., +91 for India). This will be used for deadline reminder notifications.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-400 font-medium mb-1">Deadline Reminders</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Add your WhatsApp number to receive automated reminders about upcoming application deadlines. 
                  You'll get notifications 4 hours, 3 hours, and 2 hours before each deadline.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}