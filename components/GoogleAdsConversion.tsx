"use client"

import { useEffect } from "react"

interface GoogleAdsConversionProps {
  conversionEvent: 'BEGIN_CHECKOUT_1' | 'PURCHASE_1'
}

export function GoogleAdsConversion({ conversionEvent }: GoogleAdsConversionProps) {
  useEffect(() => {
    // Add the conversion helper function to window
    if (typeof window !== 'undefined') {
      (window as any).gtagSendEvent = function(url: string) {
        const callback = function() {
          if (typeof url === 'string') {
            window.location.href = url;
          }
        };
        
        if ((window as any).gtag) {
          (window as any).gtag('event', `ads_conversion_${conversionEvent}`, {
            'event_callback': callback,
            'event_timeout': 2000,
          });
        } else {
          // If gtag not loaded, just navigate
          callback();
        }
        return false;
      };
      
      // Also add the standard conversion function
      (window as any).gtag_report_conversion = function(url?: string) {
        const callback = function() {
          if (typeof url === 'string') {
            window.location.href = url;
          }
        };
        
        if ((window as any).gtag) {
          // Need the actual conversion labels from Google Ads
          // These are placeholder values - replace with actual conversion labels
          const conversionLabel = conversionEvent === 'BEGIN_CHECKOUT_1' 
            ? 'oLRnCJnB3rkZEMSZ5t8q' // Replace with actual BEGIN_CHECKOUT conversion label
            : 'hK2xCJzB3rkZEMSZ5t8q'; // Replace with actual PURCHASE conversion label
            
          (window as any).gtag('event', 'conversion', {
            'send_to': `AW-11473435972/${conversionLabel}`,
            'value': conversionEvent === 'PURCHASE_1' ? 1.0 : 0,
            'currency': 'USD',
            'event_callback': callback
          });
        } else if (url) {
          // If gtag not loaded, just navigate
          window.location.href = url;
        }
        return false;
      };
    }
  }, [conversionEvent])
  
  return null
}