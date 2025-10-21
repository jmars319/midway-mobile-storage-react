# Admin Panel Components

## LoginPage Component

### Props
- `onLogin` - Function called with user data on successful login
- `onBack` - Function to return to public site

### Requirements
- Full screen with Navy gradient background
- White card in center with logo and form
- Username and password fields
- Error message display
- Navy Blue headings `text-[#0a2a52]`
- Orange-Red submit button `bg-[#e84424]`
- Demo credentials displayed below form
- Loading state during authentication

### Login Logic
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.success) {
      onLogin(data.user);
    } else {
      setError('Invalid credentials');
    }
  } catch (err) {
    setError('Login failed');
  } finally {
    setLoading(false);
  }
};
```

---

## SettingsModule Component

### Requirements
- Navy Blue headings
- White cards with form fields
- Orange-Red save button `bg-[#e84424]`
- Business information form
- Add Admin button (blue)

### Form Fields
```javascript
// Business Information
- Business Phone (tel input)
- Email (email input)
- Address (text input)
- Save Changes button
```

### Structure
```javascript
function SettingsModule() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0a2a52] mb-8">Settings</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Business Information</h2>
          {/* Form fields */}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Admin Users</h2>
          <button className="bg-blue-600">Add New Admin</button>
        </div>
      </div>
    </div>
  );
}
```

---

## Common Table Styling

All admin tables should follow this pattern:

```javascript
<div className="bg-white rounded-lg shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-[#0a2a52] text-white">
      <tr>
        <th className="px-6 py-3 text-left">Column Name</th>
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id} className="border-b hover:bg-gray-50">
          <td className="px-6 py-4">{item.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Status Badge Component Pattern

```javascript
<span className={`px-3 py-1 rounded-full text-sm ${
  status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
  status === 'responded' ? 'bg-green-100 text-green-800' :
  'bg-blue-100 text-blue-800'
}`}>
  {status}
</span>
```

---

## Action Buttons Pattern

```javascript
<button className="text-[#e84424] hover:text-[#d13918] font-semibold mr-3">
  View
</button>
<button className="text-blue-600 hover:text-blue-700 font-semibold">
  Details
</button>
```

## AdminPanel Component

### Props
- `user` - Current user object
- `onLogout` - Function to logout

### Layout
- Flexbox layout: Sidebar (256px) + Main content (flex-1)
- Full screen height `h-screen`
- Gray background `bg-gray-100`

### Sidebar
- Width: 64 (`w-64`)
- Background: Navy Blue `bg-[#0a2a52]`
- Logo: Orange-Red `text-[#e84424]`
- Active menu item: Orange-Red background `bg-[#e84424]`
- Hover: Dark Navy `hover:bg-[#0d3464]`
- Logout button at bottom: Red `bg-red-600`

### Modules
```javascript
const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'quotes', name: 'Quote Requests', icon: '💬' },
  { id: 'inventory', name: 'Inventory', icon: '📦' },
  { id: 'applications', name: 'Job Applications', icon: '👥' },
  { id: 'orders', name: 'PanelSeal Orders', icon: '🛒' },
  { id: 'settings', name: 'Settings', icon: '⚙️' }
];
```

### Module Switching
```javascript
const [activeModule, setActiveModule] = useState('dashboard');

// Render active module
{activeModule === 'dashboard' && <DashboardModule />}
{activeModule === 'quotes' && <QuotesModule />}
// etc...
```

---

## DashboardModule Component

### Requirements
- Navy Blue heading `text-[#0a2a52]`
- 4 stat cards in grid
- Each card has colored icon circle
- Recent activity list with timestamps

### Stats
```javascript
const stats = [
  { label: 'Pending Quotes', value: '12', color: 'bg-blue-500' },
  { label: 'Active Rentals', value: '38', color: 'bg-green-500' },
  { label: 'Available Units', value: '15', color: 'bg-[#e84424]' },
  { label: 'New Applications', value: '5', color: 'bg-purple-500' }
];
```

---

## QuotesModule Component

### Requirements
- Navy Blue heading
- White table with Navy Blue header `bg-[#0a2a52]`
- Status badges (yellow for pending, green for responded)
- Orange-Red action buttons `text-[#e84424]`
- Hover effect on rows `hover:bg-gray-50`

### Sample Data
```javascript
const [quotes, setQuotes] = useState([
  { id: 1, name: 'John Smith', service: 'Container Rental', size: '20ft', status: 'pending', date: '2025-10-18' },
  { id: 2, name: 'ABC Construction', service: 'Custom Build', size: '40ft', status: 'responded', date: '2025-10-17' },
]);
```

### Table Columns
- Customer
- Service
- Size
- Date
- Status (badge)
- Actions (View, Respond buttons)

---

## InventoryModule Component

### Requirements
- Similar table structure to QuotesModule
- Status badges: Green for Available, Orange for Rented
- Edit and Details action buttons

### Sample Data
```javascript
const inventory = [
  { id: 1, type: '20ft Container', condition: 'New', status: 'Available', quantity: 8 },
  { id: 2, type: '40ft Container', condition: 'Used - Good', status: 'Available', quantity: 12 },
  { id: 3, type: '40ft High Cube', condition: 'New', status: 'Available', quantity: 5 },
  { id: 4, type: 'Full-Size Trailer', condition: 'Excellent', status: 'Rented', quantity: 3 }
];
```

---

## ApplicationsModule Component

### Requirements
- Table with job applications
- Status badges: Blue (new), Yellow (reviewing), Green (interviewed)
- View and Resume action buttons

### Sample Data
```javascript
const applications = [
  { id: 1, name: 'Mike Johnson', position: 'Delivery Driver', date: '2025-10-19', status: 'new' },
  { id: 2, name: 'Sarah Williams', position: 'Sales Rep', date: '2025-10-18', status: 'reviewing' },
];
```

---

## OrdersModule Component

### Requirements
- Table for PanelSeal orders
- Status badges: Yellow (processing), Green (shipped)
- View and Track action buttons

### Sample Data
```javascript
const orders = [
  { id: 1, customer: 'HomeDepot Supply', product: 'PanelSeal (5 gal)', quantity: 10, date: '2025-10-19', status: 'shipped' },
  { id: 2, customer: "Bob's Roofing", product: 'PanelSeal (1 gal)', quantity: 25, date: '2025-10-18', status: 'processing' }
];
```

---