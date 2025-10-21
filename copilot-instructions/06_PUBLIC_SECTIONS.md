# Public Website Sections

## HeroSection Component

### Requirements
- Background: Gradient `bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52]`
- Padding: Top 32 (`pt-32`), Bottom 20 (`pb-20`)
- Grid layout: 2 columns on desktop (`md:grid-cols-2`)
- Main heading with accent: "Storage Solutions <span className="text-[#e84424]">Delivered</span>"
- Two CTA buttons: "Get Free Quote" (orange) and "View Services" (outlined white)
- Benefits card with checkmarks in Orange-Red
- Text color: White for headings, gray-200 for body

---

## ServicesSection Component

### Requirements
- Section ID: `id="services"`
- Background: White `bg-white`
- Padding: 20 (`py-20`)
- 2-column grid on desktop (`md:grid-cols-2`)
- Service cards with:
  - Light gray background `bg-gray-50`
  - Top border: 4px Orange-Red `border-t-4 border-[#e84424]`
  - Navy Blue headings `text-[#0a2a52]`
  - Orange-Red bullet points `text-[#e84424]`
  - Shadow on hover `hover:shadow-xl`

### Services Data
```javascript
const services = [
  {
    title: "Container Rentals",
    description: "Short-term and long-term shipping container rentals...",
    features: ["20ft & 40ft options", "Weather-resistant", "Secure locking systems"]
  },
  {
    title: "Container Sales",
    description: "Purchase new or used shipping containers...",
    features: ["New & used inventory", "Certified quality", "Delivery included"]
  },
  {
    title: "Trailer Rentals",
    description: "Full-size enclosed trailers...",
    features: ["Various sizes", "Enclosed protection", "Flexible terms"]
  },
  {
    title: "Custom Builds",
    description: "Transform containers into custom solutions...",
    features: ["Custom modifications", "Professional installation", "Design consultation"]
  }
];
```

---

## ProductsSection Component

### Requirements
- Section ID: `id="products"`
- Background: Gray `bg-gray-100`
- 2-column grid layout
- Left side: Orange-Red gradient box `bg-gradient-to-br from-[#e84424] to-[#d13918]`
- Display "PanelSeal" branding prominently
- Right side: Product description with checkmarks
- CTA button: "Order PanelSeal" in Orange-Red
- Scrolls to contact section on click

---

## QuoteForm Component

### Requirements
- Section ID: `id="quote"`
- Background: White
- Form background: Gray `bg-gray-50` with Orange-Red top border
- 2-column grid for fields on desktop
- Navy Blue labels `text-[#0a2a52]`
- Focus ring: Orange-Red `focus:ring-2 focus:ring-[#e84424]`

### Form Fields
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  serviceType: 'rental', // rental, purchase, trailer, custom
  containerSize: '20ft', // 20ft, 40ft, trailer, custom
  quantity: '1', // 1, 2, 3, 4+
  duration: 'short-term', // short-term, medium-term, long-term, purchase
  deliveryAddress: '',
  message: ''
});
```

### Submit Behavior
- POST to `/api/quotes`
- Show success message on submit
- Reset form after successful submission
- Display green success banner

---

## AboutSection Component

### Requirements
- Section ID: `id="about"`
- Background: Gray `bg-gray-100`
- 2-column layout: text left, commitments card right
- Navy Blue headings
- Commitment card with:
  - White background
  - Orange-Red top border
  - Orange-Red checkmark circles
  - Navy Blue subheadings

### Commitments
- Quality Products
- Professional Service
- Flexible Solutions
- Competitive Pricing

---

## CareersSection Component

### Requirements
- Section ID: `id="careers"`
- Background: White
- 2-column layout: benefits left, application form right
- Orange-Red bullets for benefits
- Application form similar to quote form styling

### Form Fields
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  position: '', // driver, fabrication, sales, customer-service, other
  experience: '',
  message: '',
  resume: null
});
```

### Current Openings
- Delivery Driver / Equipment Operator
- Fabrication Specialist
- Sales Representative
- Customer Service Coordinator

---

## Footer Component

### Requirements
- Section ID: `id="contact"`
- Background: Navy Blue `bg-[#0a2a52]`
- 4-column grid layout
- Orange-Red logo text and icons
- Contact info with icons from lucide-react (Phone, Mail, MapPin, Clock)
- Quick Links column with hover effects
- Container Dimensions table (2 columns span)
- Border color: Light Navy `border-[#1a4d7a]`

### Container Dimensions Data
```javascript
const containerDimensions = [
  { size: "20ft Standard", dimensions: "20' L × 8' W × 8'6\" H", capacity: "1,172 cu ft" },
  { size: "40ft Standard", dimensions: "40' L × 8' W × 8'6\" H", capacity: "2,390 cu ft" },
  { size: "40ft High Cube", dimensions: "40' L × 8' W × 9'6\" H", capacity: "2,694 cu ft" }
];
```

## Color Consistency

All sections must use:
- Navy Blue: `#0a2a52` for headings and primary backgrounds
- Orange-Red: `#e84424` for accents, CTAs, and highlights
- White and Gray: For backgrounds and text
- Proper contrast for accessibility