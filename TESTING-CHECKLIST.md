# Testing Checklist - Midway Mobile Storage

**Last Updated**: November 22, 2025  
**Status**: Ready for Testing

---

## 🎯 Quick Start Testing

### Prerequisites
1. Backend running: `cd php-backend && php -S localhost:8000 api/router.php`
2. Frontend running: `cd frontend && npm run dev`
3. Database: MySQL with all migrations applied
4. Test credentials: `admin` / `admin123` (DEBUG_MODE only)

---

## ✅ Public Website Tests

### Navigation & UI
- [ ] Page loads without errors
- [ ] Logo displays correctly
- [ ] Skip to main content link works (Tab key)
- [ ] Navigation links scroll to correct sections
- [ ] Mobile menu works on small screens
- [ ] Focus indicators visible when tabbing through (2px red outline)
- [ ] All links are keyboard accessible
- [ ] Smooth scrolling works properly

### Forms - CSRF Protection
All public forms must include CSRF token:

#### Quote Request Form
- [ ] Form loads without errors
- [ ] CSRF token loads (check browser console)
- [ ] All fields have proper labels (click label focuses input)
- [ ] Name field required validation works
- [ ] Email field validates proper format
- [ ] Service dropdown has all options
- [ ] Container size dropdown works
- [ ] Form submits successfully
- [ ] Success toast appears
- [ ] Form clears after submission
- [ ] Submission without CSRF token returns 403 error

#### Contact Modal
- [ ] Modal opens when clicking "Contact" button
- [ ] CSRF token loads
- [ ] Name and email fields required
- [ ] Subject and message optional
- [ ] Form submits successfully
- [ ] Modal closes after submission
- [ ] Success toast appears
- [ ] Close button (X) works

#### Career Application Form
- [ ] Form in Careers section loads
- [ ] CSRF token loads
- [ ] Name, email, phone fields work
- [ ] Position dropdown has all options
- [ ] Experience textarea accepts input
- [ ] Message textarea works
- [ ] Form submits successfully
- [ ] Success message appears

#### PanelSeal Order Modal
- [ ] Modal opens from Products section
- [ ] CSRF token loads
- [ ] Customer name required
- [ ] Email validation works
- [ ] Phone field optional
- [ ] Address field required
- [ ] Gallons field accepts numbers
- [ ] Notes textarea optional
- [ ] Form submits successfully
- [ ] Order appears in admin panel

### Footer & Legal
- [ ] Privacy Policy link works
- [ ] Privacy Policy page loads
- [ ] Back button returns to home
- [ ] Terms of Service link works
- [ ] Terms page loads
- [ ] Browser back button works
- [ ] Footer displays company info
- [ ] Admin Login link in footer works

---

## 🔐 Admin Panel Tests

### Authentication
- [ ] Admin login page loads
- [ ] Logo displays on login page
- [ ] Invalid credentials show error
- [ ] Valid credentials (admin/admin123) succeed
- [ ] JWT token stored in localStorage
- [ ] Session persists on page reload (if token restoration enabled)
- [ ] Token expires after 2 hours
- [ ] Expired token redirects to login
- [ ] Logout clears token
- [ ] Back to Site button works (keeps token)

### Dashboard Module
- [ ] Dashboard loads without errors
- [ ] Shows total counts for each entity
- [ ] Counts are accurate
- [ ] Quick stats display properly
- [ ] Module switching works

### Quote Requests Module
**Read Operations:**
- [ ] Quotes list loads
- [ ] Shows all quote fields
- [ ] Sorted by date (newest first)
- [ ] Status badge colors correct (yellow=pending, green=responded)
- [ ] "No quotes" message when empty
- [ ] Refresh button works

**Detail View:**
- [ ] "View" button opens detail modal
- [ ] All quote fields displayed correctly
- [ ] Customer name, email, phone visible
- [ ] Service type, size, quantity shown
- [ ] Duration and delivery address displayed
- [ ] Message text preserved with line breaks
- [ ] Created date formatted correctly

**Status Updates:**
- [ ] Status button toggles pending ↔ responded
- [ ] Status updates immediately in modal
- [ ] Status updates in table view
- [ ] Success toast appears
- [ ] No page reload needed

**Delete Operations:**
- [ ] "Delete" button opens confirmation
- [ ] Confirmation shows quote details
- [ ] Cancel button closes modal
- [ ] Confirm button deletes quote
- [ ] Quote removed from list
- [ ] Success toast appears
- [ ] Modal closes after delete

**Other:**
- [ ] Copy JSON button works
- [ ] Close button works
- [ ] Modal backdrop click closes (or doesn't)

### Messages Module
- [ ] Messages list loads
- [ ] All columns display: name, email, subject, message, date
- [ ] Empty state message shows when no messages
- [ ] Refresh button reloads data

**Actions:**
- [ ] "Copy JSON" button copies message data
- [ ] "Mark Responded" button updates status
- [ ] Success toast on status update
- [ ] "Delete" button shows confirmation
- [ ] Delete removes message from list
- [ ] Confirmation modal has proper messaging

### Job Applications Module
**List View:**
- [ ] Applications table loads
- [ ] Shows name, position, date, status
- [ ] Status badges: blue=new, yellow=reviewing, green=hired, gray=other
- [ ] Empty state message displays

**Detail Modal:**
- [ ] "View" button opens full details
- [ ] Position displayed
- [ ] Email and phone shown
- [ ] Experience text displayed (no resume upload)
- [ ] Message field visible
- [ ] Submitted date formatted

**Status Management:**
- [ ] Status button cycles: new → reviewing → interviewed → hired → rejected
- [ ] Status updates immediately
- [ ] Badge color changes appropriately
- [ ] Table updates without reload
- [ ] Success toast appears

**Delete:**
- [ ] Delete confirmation shows applicant name
- [ ] Deletion works
- [ ] Application removed from list

### PanelSeal Orders Module
**List View:**
- [ ] Orders table displays
- [ ] Customer name, product, quantity visible
- [ ] Date and status columns work
- [ ] Status colors: yellow=processing, green=shipped, blue=delivered

**Detail Modal:**
- [ ] All order details displayed
- [ ] Customer contact info complete
- [ ] Product and quantity correct
- [ ] Shipping address shown
- [ ] Order total displays with $ formatting
- [ ] Tracking number field shown (may be empty)
- [ ] Notes field displayed
- [ ] Order date formatted

**Status Cycling:**
- [ ] Status cycles: processing → shipped → delivered → cancelled
- [ ] Color updates match status
- [ ] Table reflects changes immediately
- [ ] No page refresh needed

**Delete:**
- [ ] Confirmation shows customer name
- [ ] Delete removes order
- [ ] Success feedback

### Inventory Module
**List View:**
- [ ] Inventory table loads
- [ ] Shows: Type, Condition, Status, Quantity
- [ ] "Add Item" button visible
- [ ] Empty state when no items
- [ ] Refresh button works

**Create New Item:**
- [ ] "Add Item" opens modal
- [ ] Type field accepts text
- [ ] Condition field accepts text
- [ ] Status dropdown: Available/Unavailable
- [ ] Quantity field accepts numbers
- [ ] "Create" button submits
- [ ] New item appears in table immediately
- [ ] Success toast shows
- [ ] Modal closes

**Edit Item:**
- [ ] "Edit" button opens edit modal
- [ ] All fields pre-populated
- [ ] Type editable
- [ ] Condition editable
- [ ] Status dropdown works
- [ ] Quantity editable (numeric)
- [ ] "Save" button updates item
- [ ] Table updates without reload
- [ ] Success toast

**View Details:**
- [ ] "Details" button opens read-only modal
- [ ] All item info displayed
- [ ] Status toggle button works (Available ↔ Unavailable)
- [ ] Status updates immediately
- [ ] "Edit" button switches to edit mode
- [ ] "Close" button works

**Delete:**
- [ ] Delete confirmation shows item type
- [ ] Deletion works
- [ ] Item removed from table
- [ ] If viewing deleted item, modal closes

**Quantity Field:**
- [ ] Quantity displays correctly (after migration)
- [ ] Existing items have quantity values
- [ ] New items can set quantity
- [ ] Edit preserves quantity

### Site Info Module
- [ ] Site settings form loads
- [ ] Business name, contact info editable
- [ ] Hours field works
- [ ] Save updates settings
- [ ] Settings persist on reload

### Media & Settings Module
- [ ] Logo upload works
- [ ] Logo preview displays
- [ ] Set active logo works
- [ ] Images list loads
- [ ] Delete images works
- [ ] File upload accepts images only

---

## 🔒 Security Tests

### CSRF Protection
- [ ] All public POST requests include CSRF token
- [ ] Request without token returns 403
- [ ] Invalid token returns 403
- [ ] Token refreshes on page load
- [ ] Expired tokens handled gracefully

### Rate Limiting
- [ ] 10 requests within 5 minutes allowed
- [ ] 11th request returns 429 error
- [ ] Error message: "Too many requests"
- [ ] Different endpoints have separate limits
- [ ] Admin endpoints not rate limited (use JWT)

### JWT Authentication
- [ ] Admin endpoints return 401 without token
- [ ] Invalid JWT returns 401
- [ ] Expired JWT returns 401 (after 2 hours)
- [ ] Token includes username in payload
- [ ] Only HS256 algorithm accepted

### Input Validation
- [ ] SQL injection attempts blocked (prepared statements)
- [ ] XSS attempts sanitized (`<script>` tags removed)
- [ ] Email validation rejects invalid formats
- [ ] Required fields enforce presence
- [ ] Length limits enforced (e.g., name max 255 chars)
- [ ] Numeric fields validate numbers

### Security Headers
Check in browser DevTools → Network → Response Headers:
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: no-referrer-when-downgrade`
- [ ] `Strict-Transport-Security` (if HTTPS)

---

## ♿ Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] Skip to main content link works (Tab from page load)
- [ ] Focus indicators visible (2px red outline)
- [ ] No mouse-only interactions
- [ ] Modal can be closed with Escape key (if implemented)
- [ ] Dropdown menus keyboard accessible

### Screen Reader
- [ ] Form labels properly associated (htmlFor)
- [ ] ARIA labels present on forms
- [ ] Table captions exist (sr-only class)
- [ ] Buttons have descriptive text
- [ ] Images have alt text
- [ ] Modal title announced
- [ ] Toast messages announced (if aria-live)

### Visual
- [ ] Focus indicators don't show on mouse click (focus-visible)
- [ ] Color contrast sufficient (test with tool)
- [ ] Text readable at 200% zoom
- [ ] No content only conveyed by color

---

## ⚡ Performance Tests

### Page Load
- [ ] Initial bundle < 500KB (check Network tab)
- [ ] Admin panel lazy loads (separate chunk)
- [ ] Modules lazy load (separate chunks)
- [ ] Time to Interactive < 3 seconds
- [ ] No console errors
- [ ] No console warnings (except dev mode)

### Database Performance
- [ ] Quotes query < 100ms (check with 1000+ records)
- [ ] Messages query < 100ms
- [ ] Status updates < 50ms
- [ ] Indexes present on all queried columns (SHOW INDEX)

### Network
- [ ] API responses < 500ms
- [ ] Images optimized/compressed
- [ ] No unnecessary requests
- [ ] Requests properly cached

---

## 🐛 Edge Cases & Error Handling

### Network Errors
- [ ] API down shows error message
- [ ] Timeout handled gracefully
- [ ] Retry button available
- [ ] User gets clear feedback

### Form Validation
- [ ] Empty required fields show validation
- [ ] Invalid email format rejected
- [ ] Quantity 0 or negative rejected
- [ ] Very long text fields truncated/validated
- [ ] Special characters handled

### Concurrent Updates
- [ ] Two admins updating same record
- [ ] Delete during view shows appropriate error
- [ ] Stale data handling

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 📝 Final Checklist Before Production

### Code Quality
- [ ] No console.log() in production code (except error logging)
- [ ] No TODO comments for critical features
- [ ] All functions have error handling
- [ ] Loading states for all async operations
- [ ] Success/error feedback for all actions

### Configuration
- [ ] DEBUG_MODE = false in php-backend/config.php
- [ ] JWT_SECRET is strong random value (not default)
- [ ] Database credentials secure (not default)
- [ ] ALLOWED_ORIGINS set to production domain
- [ ] Error display off in PHP (display_errors = 0)

### Security
- [ ] create-admin.php deleted from server
- [ ] Production admin user has strong password (not admin123)
- [ ] File upload directory not web-accessible (or protected)
- [ ] Database user has minimal permissions
- [ ] HTTPS enabled (SSL certificate)

### Database
- [ ] All migrations applied
- [ ] Database backed up
- [ ] Indexes created (13 indexes on 5 tables)
- [ ] Test data removed

### Monitoring
- [ ] Error logging configured
- [ ] Disk space monitoring
- [ ] Uptime monitoring
- [ ] Database connection pool limits set

---

## 🎉 Test Results Summary

**Date Tested**: _____________  
**Tester**: _____________

**Test Coverage**:
- [ ] All public forms tested
- [ ] All admin modules tested
- [ ] Security tests passed
- [ ] Accessibility tests passed
- [ ] Performance acceptable
- [ ] Edge cases handled

**Critical Issues Found**: _____________

**Notes**:
```
[Add any observations, bugs found, or recommendations]
```

**Ready for Production**: ☐ Yes  ☐ No  ☐ With Notes

---

## 🔄 Regression Testing (After Updates)

When making changes, re-test:
- [ ] Modified modules
- [ ] Related features
- [ ] CSRF token functionality
- [ ] Authentication flow
- [ ] Database operations

---

**Document Version**: 1.0  
**Last Updated**: November 22, 2025  
**Maintained By**: Development Team
