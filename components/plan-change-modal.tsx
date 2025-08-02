"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, AlertCircle, Loader2 } from "lucide-react"

interface PlanChangeModalProps {
  currentPlan: string
  currentBillingCycle: string
  currentUsage: number
  onClose: () => void
  onSuccess: () => void
}

const plans = [
  {
    name: "basic",
    displayName: "Basic",
    monthlyPrice: 4.99,
    annualPrice: 47.88,
    limit: 100,
    features: [
      "100 texts per month",
      "30-day message history",
      "Auto-buy: $0.055/text after quota",
      "Priority support"
    ]
  },
  {
    name: "standard",
    displayName: "Standard",
    monthlyPrice: 9.99,
    annualPrice: 95.88,
    limit: 500,
    features: [
      "500 texts per month",
      "90-day message history",
      "Auto-buy: $0.022/text after quota",
      "Advanced analytics"
    ]
  },
  {
    name: "premium",
    displayName: "Premium",
    monthlyPrice: 19.99,
    annualPrice: 191.88,
    limit: 1000,
    features: [
      "1,000 texts per month",
      "Unlimited message history",
      "Auto-buy: $0.022/text after quota",
      "API access"
    ]
  }
]

export function PlanChangeModal({ currentPlan, currentBillingCycle, currentUsage, onClose, onSuccess }: PlanChangeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'annual'>(currentBillingCycle as any)
  const [loading, setLoading] = useState(false)
  const [proration, setProration] = useState<any>(null)
  const [loadingProration, setLoadingProration] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedPlan !== currentPlan || selectedBillingCycle !== currentBillingCycle) {
      fetchProration()
    }
  }, [selectedPlan, selectedBillingCycle])

  const fetchProration = async () => {
    setLoadingProration(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/change-plan?targetPlan=${selectedPlan}&billingCycle=${selectedBillingCycle}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.message || data.error)
      } else {
        setProration(data)
      }
    } catch (err) {
      setError("Failed to calculate proration")
    } finally {
      setLoadingProration(false)
    }
  }

  const handlePlanChange = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPlan: selectedPlan,
          billingCycle: selectedBillingCycle
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.message || "Failed to change plan")
      } else {
        onSuccess()
      }
    } catch (err) {
      setError("Failed to change plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanDetails = plans.find(p => p.name === selectedPlan)
  const isDowngrade = plans.findIndex(p => p.name === selectedPlan) < plans.findIndex(p => p.name === currentPlan)
  const exceedsLimit = selectedPlanDetails && currentUsage > selectedPlanDetails.limit

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Your Plan</DialogTitle>
          <DialogDescription>
            Select a new plan and billing cycle. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Billing Cycle Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Billing Cycle</Label>
            <RadioGroup value={selectedBillingCycle} onValueChange={(value) => setSelectedBillingCycle(value as any)}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annual" id="annual" />
                  <Label htmlFor="annual" className="cursor-pointer">
                    Annual <span className="text-green-600 font-semibold">(Save 20%)</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Plan Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Plan</Label>
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
              <div className="space-y-3">
                {plans.map((plan) => {
                  const isCurrent = plan.name === currentPlan
                  const price = selectedBillingCycle === 'annual' 
                    ? `$${(plan.annualPrice / 12).toFixed(2)}/mo`
                    : `$${plan.monthlyPrice}/mo`
                  
                  return (
                    <label
                      key={plan.name}
                      htmlFor={plan.name}
                      className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                        selectedPlan === plan.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      } ${isCurrent ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={plan.name} id={plan.name} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{plan.displayName}</span>
                            <span className="text-lg font-bold">{price}</span>
                            {isCurrent && (
                              <Badge variant="secondary" className="text-xs">Current</Badge>
                            )}
                          </div>
                          {selectedBillingCycle === 'annual' && (
                            <p className="text-sm text-green-600 mb-2">
                              ${plan.annualPrice}/year (save ${((plan.monthlyPrice * 12) - plan.annualPrice).toFixed(2)})
                            </p>
                          )}
                          <ul className="space-y-1">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Usage Warning */}
          {exceedsLimit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your current usage ({currentUsage} texts) exceeds the {selectedPlanDetails?.displayName} plan limit 
                ({selectedPlanDetails?.limit} texts). You cannot downgrade to this plan until your usage is below the limit.
              </AlertDescription>
            </Alert>
          )}

          {/* Proration Preview */}
          {proration && !exceedsLimit && (selectedPlan !== currentPlan || selectedBillingCycle !== currentBillingCycle) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {proration.credit > 0 && (
                    <div className="flex justify-between">
                      <span>Credit for unused time</span>
                      <span className="text-green-600">-${proration.credit.toFixed(2)}</span>
                    </div>
                  )}
                  {proration.immediateCharge > 0 && (
                    <div className="flex justify-between">
                      <span>Charge today</span>
                      <span className="font-semibold">${proration.immediateCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span>Next invoice ({new Date(proration.nextInvoiceDate).toLocaleDateString()})</span>
                    <span className="font-semibold">${proration.nextInvoiceAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handlePlanChange}
            disabled={
              loading || 
              loadingProration || 
              exceedsLimit || 
              (selectedPlan === currentPlan && selectedBillingCycle === currentBillingCycle)
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Changing Plan..." : "Confirm Change"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}