"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2, Info } from "lucide-react"

interface CancelAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  hasSubscription: boolean
  currentPlan: string
  phoneNumber: string
}

export function CancelAccountModal({
  isOpen,
  onClose,
  onSuccess,
  hasSubscription,
  currentPlan,
  phoneNumber
}: CancelAccountModalProps) {
  const [cancellationType, setCancellationType] = useState<"immediate" | "end_of_period">("end_of_period")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationStep, setConfirmationStep] = useState(false)

  const handleCancel = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          immediate: cancellationType === "immediate" || !hasSubscription,
          reason: reason.trim() || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel account")
      }

      onSuccess()
      alert(data.message)
      onClose()
    } catch (err: any) {
      setError(err.message || "An error occurred during cancellation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmationStep(false)
      setCancellationType("end_of_period")
      setReason("")
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {confirmationStep ? "Confirm Cancellation" : "Cancel Your Account"}
          </DialogTitle>
          <DialogDescription>
            {confirmationStep 
              ? "Please review your cancellation details before confirming."
              : "We're sorry to see you go. Please let us know how we can improve."}
          </DialogDescription>
        </DialogHeader>

        {!confirmationStep ? (
          <div className="space-y-4 py-4">
            {hasSubscription && (
              <div className="space-y-3">
                <Label>Cancellation Type</Label>
                <RadioGroup
                  value={cancellationType}
                  onValueChange={(value) => setCancellationType(value as "immediate" | "end_of_period")}
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="end_of_period" id="end_of_period" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="end_of_period" className="font-normal cursor-pointer">
                        Cancel at end of billing period
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Keep access to your {currentPlan} plan features until your current billing period ends
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="immediate" className="font-normal cursor-pointer">
                        Cancel immediately
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Lose access to paid features right away (no refund for unused time)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Please share why you're cancelling to help us improve..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>What happens after cancellation:</strong>
                <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
                  <li>Your email-to-text address ({phoneNumber.replace('+1', '')}@txt.emailtotextnotify.com) will stop working</li>
                  <li>You'll lose access to message history after 30 days</li>
                  <li>Your phone number usage will be tracked if you re-signup</li>
                  <li>You can re-activate your account anytime by signing in again</li>
                </ul>
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Final Confirmation</strong>
                <p className="mt-2">
                  You are about to cancel your {currentPlan} plan
                  {hasSubscription && cancellationType === "immediate" 
                    ? " immediately. You will lose access to all paid features right away."
                    : hasSubscription
                    ? ". Your account will remain active until the end of your current billing period."
                    : ". Your free account will be cancelled immediately."}
                </p>
              </AlertDescription>
            </Alert>

            {reason && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Your feedback:</p>
                <p className="text-sm text-muted-foreground mt-1">{reason}</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {confirmationStep ? "Go Back" : "Keep My Account"}
          </Button>
          {!confirmationStep ? (
            <Button
              variant="destructive"
              onClick={() => setConfirmationStep(true)}
              disabled={isLoading}
            >
              Continue with Cancellation
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}