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

const API_BASE = 'http://localhost:5001/api'
// admin components are now in ./admin

/* ---------- Main App ---------- */
export default function App(){
  const [currentPage, setCurrentPage] = useState('public')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // set document padding to avoid header overlap
    document.documentElement.style.scrollPaddingTop = '100px'
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
  useEffect(()=>{
    const t = localStorage.getItem('midway_token')
    if (t && !user) {
      setUser({ username: 'admin', token: t })
      setCurrentPage('admin')
    }
  },[])

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
    <div className="min-h-screen">
      <NavBar onLoginClick={handleAdminClick} scrollTo={scrollToSection} />
      <main className="pt-24">
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <QuoteForm />
        <AboutSection />
        <CareersSection />
        <Footer />
      </main>
    </div>
  )
}
