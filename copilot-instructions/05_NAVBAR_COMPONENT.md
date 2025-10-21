# NavBar Component

## Component: `NavBar`

**Props:**
- `onLoginClick` - Function to navigate to login page

**State:**
- `mobileMenuOpen` - Boolean for mobile menu visibility

## Requirements

### Desktop Navigation
- Fixed position at top (`fixed top-0 left-0 right-0`)
- Background: Navy Blue `bg-[#0a2a52]`
- Height: 80px (`h-20`)
- Z-index: 50 (`z-50`)
- Logo text: "Midway Mobile Storage" in Orange-Red `text-[#e84424]`
- Navigation links: Services, Products, Get Quote, About, Careers, Contact
- Admin Login button: Orange-Red background `bg-[#e84424]`
- Links hover to Orange-Red `hover:text-[#e84424]`

### Mobile Navigation
- Hamburger menu icon (Menu from lucide-react)
- Hidden on desktop (`md:hidden`)
- Mobile menu slides down when open
- Background: Dark Navy `bg-[#0d3464]`
- Border top: Light Navy `border-[#1a4d7a]`
- Same links as desktop, stacked vertically
- Close icon (X from lucide-react) when open

### Navigation Functionality
- Each link uses `scrollToSection()` function
- Smooth scroll to section IDs: 'services', 'products', 'quote', 'about', 'careers', 'contact'
- Mobile menu closes after clicking link
- Admin Login button calls `onLoginClick` prop

## Example Structure

```javascript
function NavBar({ onLoginClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    // Smooth scroll implementation
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0a2a52] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-[#e84424]">
            Midway Mobile Storage
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Links */}
            <button onClick={() => scrollToSection('services')}>Services</button>
            {/* More links... */}
            <button onClick={onLoginClick} className="bg-[#e84424]">
              Admin Login
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d3464] border-t border-[#1a4d7a]">
          {/* Mobile links */}
        </div>
      )}
    </nav>
  );
}
```

## Styling Requirements

- Max width container: `max-w-7xl mx-auto`
- Padding: `px-4 sm:px-6 lg:px-8`
- Text color: White
- Font weight: Regular for links, bold for logo
- Transitions on all interactive elements
- Box shadow: `shadow-lg`