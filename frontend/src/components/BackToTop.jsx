import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * BackToTop Button
 * Appears when user scrolls down, positioned in bottom right
 * Scrolls smoothly to top of page when clicked
 * Disappears when in footer area to avoid overlap
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const footer = document.querySelector('footer')
      const footerTop = footer ? footer.offsetTop : documentHeight

      // Show button after scrolling 300px down
      const shouldShow = scrolled > 300
      
      // Hide button when reaching footer (leave 100px margin)
      const isNearFooter = scrolled + windowHeight > footerTop - 100

      setIsVisible(shouldShow && !isNearFooter)
    }

    // Check on mount
    toggleVisibility()

    // Check on scroll
    window.addEventListener('scroll', toggleVisibility)
    
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-[#e84424] text-white p-3 rounded-full shadow-lg hover:bg-[#d13918] transition-all duration-300 z-40 focus:outline-none focus:ring-2 focus:ring-[#e84424] focus:ring-offset-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  )
}
