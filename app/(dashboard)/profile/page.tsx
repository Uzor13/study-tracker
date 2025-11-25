'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  GraduationCap,
  Lock,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Bell,
  Building2,
  DollarSign,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  degreeType: string
  emailVerified: Date | null
  notificationsEnabled: boolean
  emailNotifications: boolean
  reminderDays: number
  defaultCurrency: string
  programOfStudy: string | null
  institutionName: string | null
  intakeYear: number | null
  intakeTerm: string | null
  createdAt: Date
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Profile fields
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [degreeType, setDegreeType] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reminderDays, setReminderDays] = useState(7)
  const [defaultCurrency, setDefaultCurrency] = useState('CAD')
  const [programOfStudy, setProgramOfStudy] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [intakeYear, setIntakeYear] = useState<number | undefined>(undefined)
  const [intakeTerm, setIntakeTerm] = useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setProfile(data.user)
      setName(data.user.name || '')
      setImage(data.user.image || '')
      setDegreeType(data.user.degreeType || '')
      setNotificationsEnabled(data.user.notificationsEnabled)
      setEmailNotifications(data.user.emailNotifications)
      setReminderDays(data.user.reminderDays)
      setDefaultCurrency(data.user.defaultCurrency || 'CAD')
      setProgramOfStudy(data.user.programOfStudy || '')
      setInstitutionName(data.user.institutionName || '')
      setIntakeYear(data.user.intakeYear || undefined)
      setIntakeTerm(data.user.intakeTerm || '')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load profile'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image: image || null,
          degreeType,
          notificationsEnabled,
          emailNotifications,
          reminderDays,
          defaultCurrency,
          programOfStudy,
          institutionName,
          intakeYear,
          intakeTerm,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setProfile(data.user)
      toast.success('Profile updated successfully!')

      // Update session with new name and image
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          image: data.user.image,
        },
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setIsChangingPassword(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change password'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                  <User className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="image">Profile Photo URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a URL to your profile photo
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
              {profile?.emailVerified && (
                <Badge className="absolute right-2 top-2 bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Degree Type */}
          <div className="space-y-2">
            <Label htmlFor="degreeType">Degree Type</Label>
            <select
              id="degreeType"
              value={degreeType}
              onChange={(e) => setDegreeType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select degree type</option>
              <option value="undergrad">Undergraduate</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Member since{' '}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleUpdateProfile}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* School & Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            School Information & Preferences
          </CardTitle>
          <CardDescription>Manage your study plans and financial settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Currency */}
          <div className="space-y-2">
            <Label htmlFor="defaultCurrency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Default Currency
            </Label>
            <select
              id="defaultCurrency"
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="USD">USD - US Dollar</option>
              <option value="NGN">NGN - Nigerian Naira</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="EUR">EUR - Euro</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
            <p className="text-xs text-muted-foreground">
              All expenses will be displayed in this currency on your dashboard
            </p>
          </div>

          {/* Program of Study */}
          <div className="space-y-2">
            <Label htmlFor="programOfStudy">Program of Study</Label>
            <Input
              id="programOfStudy"
              type="text"
              placeholder="e.g., Computer Science, Business Administration"
              value={programOfStudy}
              onChange={(e) => setProgramOfStudy(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The specific program you&apos;re applying for
            </p>
          </div>

          {/* Institution Name */}
          <div className="space-y-2">
            <Label htmlFor="institutionName">Target Institution</Label>
            <Input
              id="institutionName"
              type="text"
              placeholder="e.g., University of Toronto"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your primary target school (you can track multiple in Applications)
            </p>
          </div>

          {/* Intake Year and Term */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="intakeYear">Intake Year</Label>
              <Input
                id="intakeYear"
                type="number"
                placeholder="2025"
                min="2024"
                max="2030"
                value={intakeYear || ''}
                onChange={(e) => setIntakeYear(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intakeTerm">Intake Term</Label>
              <select
                id="intakeTerm"
                value={intakeTerm}
                onChange={(e) => setIntakeTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select term</option>
                <option value="Fall">Fall (September)</option>
                <option value="Winter">Winter (January)</option>
                <option value="Summer">Summer (May)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notifications Enabled */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about deadlines and updates
              </p>
            </div>
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get email reminders for upcoming deadlines
              </p>
            </div>
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          {/* Reminder Days */}
          <div className="space-y-2">
            <Label htmlFor="reminderDays">Reminder Days Before Deadline</Label>
            <select
              id="reminderDays"
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value={1}>1 day before</option>
              <option value={3}>3 days before</option>
              <option value={7}>7 days before (recommended)</option>
              <option value={14}>14 days before</option>
              <option value={30}>30 days before</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={
              isChangingPassword ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            variant="secondary"
            className="w-full"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
