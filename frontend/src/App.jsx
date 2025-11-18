import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import ProductsSection from './components/ProductsSection'
import QuoteForm from './components/QuoteForm'
import AboutSection from './components/AboutSection'
import CareersSection from './components/CareersSection'
import Footer from './components/Footer'
import LoginPage from './admin/LoginPage'
import AdminPanel from './admin/AdminPanel'
import ToastContainer from './components/Toast'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import ErrorBoundary from './components/ErrorBoundary'
import { fetchSiteSettings, generateStructuredData, injectStructuredData } from './lib/structuredData'

import { API_BASE } from './config'
// admin components are now in ./admin

/* ---------- Main App ---------- */
// App responsibilities:
// - Render the public site pages
// - Manage a lightweight admin authentication state (token stored in localStorage)
// - Switch between public, login, and admin views
export default function App(){
  const [currentPage, setCurrentPage] = useState('public')
  const [user, setUser] = useState(null)
  const [siteSettings, setSiteSettings] = useState(null)

  useEffect(()=>{
    // set document padding to avoid header overlap
    document.documentElement.style.scrollPaddingTop = '100px'
    
    // Fetch site settings and inject structured data
    fetchSiteSettings().then(settings => {
      setSiteSettings(settings)
      const structuredData = generateStructuredData(settings)
      injectStructuredData(structuredData)
    })
  },[])

  const handleLogin = (userData) => { 
    setUser(userData); 
    if (userData?.token) localStorage.setItem('midway_token', userData.token)
    setCurrentPage('admin') 
  }
  const handleLogout = () => { localStorage.removeItem('midway_token'); setUser(null); setCurrentPage('public') }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const headerHeight = 80
      const targetPosition = el.offsetTop - headerHeight - 20
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

  // restore token on mount
  // On mount, restore token from localStorage so the admin session survives
  // page reloads. This keeps the demo simple: any valid token in storage will
  // put the app into the admin view (no token validation performed here).
  useEffect(()=>{
    const t = localStorage.getItem('midway_token')
    if (t && !user) {
      setUser({ username: 'admin', token: t })
      setCurrentPage('admin')
    }
  },[])

  // deep-linking: set page from URL on mount and handle back/forward
  useEffect(()=>{
    const path = window.location.pathname || '/'
    if (path === '/privacy') setCurrentPage('privacy')
    else if (path === '/terms') setCurrentPage('terms')

    const onPop = () => {
      const p = window.location.pathname
      if (p === '/privacy') setCurrentPage('privacy')
      else if (p === '/terms') setCurrentPage('terms')
      else setCurrentPage('public')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Update page title and meta tags when currentPage changes
  useEffect(()=>{
    const updateMeta = (title, description, url) => {
      document.title = title
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', description)
      
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', title)
      
      const ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', description)
      
      const ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.setAttribute('content', url)
      
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) twitterTitle.setAttribute('content', title)
      
      const twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) twitterDesc.setAttribute('content', description)
      
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) canonical.setAttribute('href', url)
    }

    if (currentPage === 'privacy') {
      updateMeta(
        'Privacy Policy — Midway Mobile Storage',
        'Our privacy policy explains how Midway Mobile Storage collects, uses, and protects your personal information.',
        'https://midwaymobilestorage.com/privacy'
      )
    } else if (currentPage === 'terms') {
      updateMeta(
        'Terms of Service — Midway Mobile Storage',
        'Terms of Service for Midway Mobile Storage. Review our terms governing use of our website and services.',
        'https://midwaymobilestorage.com/terms'
      )
    } else {
      updateMeta(
        'Midway Mobile Storage — Portable Storage & Container Rentals',
        'Midway Mobile Storage provides portable storage containers, rentals, and delivery across the region. Secure, weather-resistant containers for residential and commercial needs.',
        'https://midwaymobilestorage.com/'
      )
    }
  }, [currentPage])

  if (currentPage === 'login') return <LoginPage onLogin={handleLogin} onBack={()=>setCurrentPage('public')} />
  if (currentPage === 'admin' && user) return <AdminPanel user={user} onLogout={handleLogout} onBackToSite={() => setCurrentPage('public')} />

  const handleAdminClick = () => {
    const t = localStorage.getItem('midway_token')
    if (t) {
      setUser({ username: 'admin', token: t })
      setCurrentPage('admin')
    } else {
      setCurrentPage('login')
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <NavBar onLoginClick={handleAdminClick} scrollTo={scrollToSection} />
        <main id="main-content" className="pt-24" tabIndex="-1">
          {currentPage === 'privacy' ? (
            <PrivacyPolicy onBack={()=>{ setCurrentPage('public'); window.history.pushState({}, '', '/') }} />
          ) : currentPage === 'terms' ? (
            <TermsOfService onBack={()=>{ setCurrentPage('public'); window.history.pushState({}, '', '/') }} />
          ) : (
            <>
              <HeroSection />
              <ServicesSection />
              <ProductsSection />
              <QuoteForm />
              <AboutSection />
              <CareersSection />
            </>
          )}
          <Footer onLoginClick={handleAdminClick} onNavigate={(page)=>{
            setCurrentPage(page)
            if (page === 'privacy') window.history.pushState({}, '', '/privacy')
            else if (page === 'terms') window.history.pushState({}, '', '/terms')
          }} />
        </main>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
