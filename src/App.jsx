import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AnalyticsProvider } from './contexts/AnalyticsContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import LoadingSpinner from './components/common/LoadingSpinner'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import PublicProfilePage from './pages/PublicProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// App Section Pages
import AppRegisterPage from './pages/app/RegisterPage'
import AppLoginPage from './pages/app/LoginPage'
import AppDashboardPage from './pages/app/DashboardPage'
// Admin imports
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger)

function App() {
  // Removed global ScrollTrigger setup to prevent conflicts with individual sections

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnalyticsProvider>
          <div className="App min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Helmet>
              <title>FiindIt- Digital Profile Platform | Share Instantly. Connect Effortlessly.</title>
              <meta name="description" content="FiindIt is a revolutionary digital profile platform for NFC-based smart sharing and lead management. Transform your networking experience with instant sharing and effortless connections." />
              <meta name="keywords" content="NFC, digital business card, lead management, smart sharing, professional networking, FiindIt" />
              <link rel="canonical" href="https://connectionunlimited.com" />
            </Helmet>

            <Routes>
              {/* App Section Routes */}
              <Route path="/app/register" element={<AppRegisterPage />} />
              <Route path="/app/login" element={<AppLoginPage />} />
              <Route path="/app/*" element={<AppDashboardPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/*" element={<AdminDashboardPage />} />

              {/* Main Website Routes with Layout */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <HomePage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/products" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProductsPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/product/:slug" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ProductDetailPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <AboutPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <ContactPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/dashboard/*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <DashboardPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
              <Route path="/profile/:username" element={<PublicProfilePage />} />
              <Route path="/p/:username" element={<PublicProfilePage />} />
              <Route path="*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <NotFoundPage />
                  </main>
                  <Footer />
                  <ScrollToTop />
                </>
              } />
            </Routes>
          </div>
        </AnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 