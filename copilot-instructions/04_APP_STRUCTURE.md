# App.js Structure

## File: `src/App.js`

This single file contains the entire application. Structure it as follows:

### Import Section
```javascript
import React, { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';
```

### API Configuration
```javascript
const API_BASE = 'http://localhost:5001/api';
```

### Component Organization

The file should contain these components in order:

1. **Public Site Components**
   - `NavBar` - Navigation with mobile menu
   - `HeroSection` - Hero banner with CTA
   - `ServicesSection` - Services grid
   - `ProductsSection` - PanelSeal product showcase
   - `QuoteForm` - Quote request form
   - `AboutSection` - Company information
   - `CareersSection` - Job listings and application form
   - `Footer` - Contact info and quick links

2. **Authentication**
   - `LoginPage` - Admin login form

3. **Admin Panel Components**
   - `AdminPanel` - Main admin layout with sidebar
   - `DashboardModule` - Statistics and activity
   - `QuotesModule` - Quote management table
   - `InventoryModule` - Inventory management table
   - `ApplicationsModule` - Job applications table
   - `OrdersModule` - PanelSeal orders table
   - `SettingsModule` - Business settings form

4. **Main App Component**
   - Default export that manages routing between public/login/admin

### State Management

**Main App State:**
```javascript
const [currentPage, setCurrentPage] = useState('public'); // 'public', 'login', 'admin'
const [user, setUser] = useState(null);
```

**Form State Example (Quote Form):**
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  serviceType: 'rental',
  containerSize: '20ft',
  quantity: '1',
  duration: 'short-term',
  deliveryAddress: '',
  message: ''
});
const [submitted, setSubmitted] = useState(false);
```

### Key Functionality Requirements

**Smooth Scrolling:**
```javascript
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80;
    const targetPosition = element.offsetTop - headerHeight - 20;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }
};
```

**Form Submission Pattern:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      setSubmitted(true);
      // Reset form
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Login Handler:**
```javascript
const handleLogin = (userData) => {
  setUser(userData);
  setCurrentPage('admin');
};

const handleLogout = () => {
  setUser(null);
  setCurrentPage('public');
};
```

### Routing Logic

```javascript
export default function App() {
  const [currentPage, setCurrentPage] = useState('public');
  const [user, setUser] = useState(null);

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('public')} />;
  }

  if (currentPage === 'admin' && user) {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen">
      <NavBar onLoginClick={() => setCurrentPage('login')} />
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <QuoteForm />
      <AboutSection />
      <CareersSection />
      <Footer />
    </div>
  );
}
```

## Important Notes

- All components are functional (no class components)
- Use `useState` and `useEffect` hooks as needed
- Each section has an `id` attribute for smooth scrolling
- Mobile responsive using Tailwind's `md:` breakpoints
- Forms have validation (required fields)
- Loading states on async operations
- Error handling in try/catch blocks