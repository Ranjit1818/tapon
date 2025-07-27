import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AnalyticsContext = createContext()

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider = ({ children }) => {
  const location = useLocation()

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])

  const trackEvent = (action, category, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackLead = (source, medium, campaign) => {
    trackEvent('lead_generated', 'engagement', source, 1)
    
    // Track UTM parameters
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: {
          'custom_parameter_1': 'source',
          'custom_parameter_2': 'medium',
          'custom_parameter_3': 'campaign',
        },
        source: source,
        medium: medium,
        campaign: campaign,
      })
    }
  }

  const trackProfileView = (profileId, source) => {
    trackEvent('profile_view', 'engagement', source, 1)
  }

  const trackNFCScan = (cardType, location) => {
    trackEvent('nfc_scan', 'interaction', cardType, 1)
  }

  const trackQRScan = (qrType, source) => {
    trackEvent('qr_scan', 'interaction', qrType, 1)
  }

  const trackDemoBooking = (product, source) => {
    trackEvent('demo_booked', 'conversion', product, 1)
  }

  const trackAppDownload = (platform) => {
    trackEvent('app_download', 'conversion', platform, 1)
  }

  const trackContactForm = (formType) => {
    trackEvent('contact_form_submitted', 'engagement', formType, 1)
  }

  const value = {
    trackEvent,
    trackLead,
    trackProfileView,
    trackNFCScan,
    trackQRScan,
    trackDemoBooking,
    trackAppDownload,
    trackContactForm,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
} 