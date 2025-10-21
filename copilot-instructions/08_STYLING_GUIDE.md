# Styling Guide

## Brand Colors

### Primary Colors
Use these exact hex codes throughout the application:

```javascript
// Navy Blue - Primary
'#0a2a52' // Backgrounds, headers, text

// Orange-Red - Accent
'#e84424' // CTAs, highlights, links

// Dark Navy - Secondary
'#0d3464' // Gradients, hover states

// Light Navy - Borders
'#1a4d7a' // Dividers, borders

// Hover Orange
'#d13918' // Button hover states
```

### Tailwind Custom Classes
Use bracket notation for custom colors:
- `bg-[#0a2a52]`
- `text-[#e84424]`
- `border-[#1a4d7a]`
- `hover:bg-[#d13918]`

---

## Typography

### Headings
```javascript
// H1 - Main Page Headings
className="text-4xl font-bold text-[#0a2a52] mb-4"

// H2 - Section Titles
className="text-3xl font-bold text-[#0a2a52] mb-6"

// H3 - Card Titles
className="text-2xl font-bold text-[#0a2a52] mb-4"

// H4 - Subsections
className="text-xl font-bold text-[#0a2a52] mb-2"
```

### Body Text
```javascript
// Regular paragraph
className="text-lg text-gray-700 mb-4"

// Secondary text
className="text-gray-600"

// Small text
className="text-sm text-gray-500"
```

---

## Buttons

### Primary CTA (Orange-Red)
```javascript
className="bg-[#e84424] hover:bg-[#d13918] text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105"
```

### Secondary CTA (Outlined)
```javascript
className="border-2 border-white hover:bg-white hover:text-[#0a2a52] text-white px-8 py-4 rounded-lg font-semibold transition"
```

### Text Button
```javascript
className="text-[#e84424] hover:text-[#d13918] font-semibold transition"
```

---

## Forms

### Input Fields
```javascript
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84424]"
```

### Labels
```javascript
className="block text-[#0a2a52] font-semibold mb-2"
```

### Select Dropdowns
```javascript
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84424]"
```

### Textarea
```javascript
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84424]"
rows="4"
```

### Submit Button
```javascript
className="w-full bg-[#e84424] hover:bg-[#d13918] text-white py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
```

---

## Cards

### Service Card
```javascript
className="bg-gray-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition border-t-4 border-[#e84424]"
```

### Admin Card
```javascript
className="bg-white rounded-lg shadow p-6"
```

### Feature Card
```javascript
className="bg-white rounded-lg p-8 shadow-xl border-t-4 border-[#e84424]"
```

---

## Sections

### Standard Section
```javascript
<section id="section-name" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Alternate Background Section
```javascript
<section id="section-name" className="py-20 bg-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

---

## Grid Layouts

### 2-Column Grid (Desktop)
```javascript
className="grid md:grid-cols-2 gap-8"
// or gap-12 for more spacing
```

### 4-Column Grid (Stats)
```javascript
className="grid md:grid-cols-4 gap-6"
```

---

## Responsive Design

### Breakpoints
- Mobile: default (no prefix)
- Desktop: `md:` (768px and up)

### Common Patterns
```javascript
// Hidden on mobile, visible on desktop
className="hidden md:flex"

// Visible on mobile, hidden on desktop
className="md:hidden"

// Full width on mobile, auto on desktop
className="w-full md:w-auto"

// Stack on mobile, grid on desktop
className="grid md:grid-cols-2"
```

---

## Spacing

### Padding
- Section vertical: `py-20`
- Card padding: `p-6` or `p-8`
- Input padding: `px-4 py-3`

### Margin
- Bottom margin between elements: `mb-4`, `mb-6`, `mb-8`
- Section title margin: `mb-12` or `mb-16`

### Gap
- Grid gap: `gap-6`, `gap-8`, `gap-12`
- Flex gap: `gap-4`

---

## Shadows

```javascript
// Standard shadow
className="shadow-lg"

// Hover shadow
className="shadow-lg hover:shadow-xl"

// Extra shadow
className="shadow-2xl"
```

---

## Borders

```javascript
// Top border accent
className="border-t-4 border-[#e84424]"

// All borders
className="border border-gray-300"

// Bottom border only
className="border-b"

// Rounded corners
className="rounded-lg" // 8px
className="rounded" // 4px
className="rounded-full" // pill shape
```

---

## Transitions

Always add transitions to interactive elements:
```javascript
className="transition"
// or more specific:
className="transition transform hover:scale-105"
```

---

## Icons

### Import from lucide-react
```javascript
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';
```

### Usage
```javascript
<Phone size={18} className="mr-2 text-[#e84424]" />
<Mail size={18} className="mr-2 text-[#e84424]" />
<MapPin size={18} className="mr-2 text-[#e84424]" />
<Clock size={18} className="mr-2 text-[#e84424]" />
```

---

## Accessibility

### Contrast
- Navy Blue + White text = WCAG AAA compliant
- Orange-Red + White text = WCAG AA compliant
- Always use these combinations

### Focus States
All interactive elements must have focus states:
```javascript
className="focus:outline-none focus:ring-2 focus:ring-[#e84424]"
```

### Required Fields
Mark with asterisk in label:
```javascript
<label>Full Name *</label>
```

---

## Consistency Checklist

- ✅ All Navy Blue uses `#0a2a52`
- ✅ All Orange-Red uses `#e84424`
- ✅ All headings use Navy Blue
- ✅ All CTAs use Orange-Red
- ✅ All forms have focus rings
- ✅ All buttons have hover states
- ✅ All interactive elements have transitions
- ✅ All sections have proper padding
- ✅ All text has proper contrast