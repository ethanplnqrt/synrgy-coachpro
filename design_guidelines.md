# Design Guidelines: Coaching SaaS Platform (TrueCoach-Inspired)

## Design Approach

**Selected Approach:** Modern Design System with Reference-Based Enhancement

**Primary References:** Linear (clean productivity), Notion (information hierarchy), TrueCoach (fitness context)

**Core Principles:**
- Clarity over decoration - coaches and clients need immediate comprehension
- Hierarchy through typography and spacing, not color
- Functional beauty - every element serves a purpose
- Data-forward design - progress and programs are the heroes

---

## Typography System

**Font Stack:** 
- Primary: Inter (via Google Fonts CDN) - clean, readable, professional
- Monospace: JetBrains Mono - for data/metrics display

**Hierarchy:**
- Hero/Dashboard Headers: text-4xl, font-bold (36px)
- Section Headers: text-2xl, font-semibold (24px)
- Card Titles: text-lg, font-semibold (18px)
- Body Text: text-base, font-normal (16px)
- Supporting Text: text-sm, font-normal (14px)
- Captions/Labels: text-xs, font-medium, uppercase, tracking-wider (12px)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (badges, inline elements): p-2, gap-2
- Standard component padding: p-4, p-6
- Section spacing: py-8, py-12
- Page margins: p-8, p-12
- Large breaks: mb-16, mt-16

**Grid System:**
- Dashboard: 2-column layout (sidebar + main content)
- Sidebar: fixed w-64 on desktop, slide-over on mobile
- Main content: max-w-7xl mx-auto px-8
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Form layouts: max-w-2xl for optimal readability

---

## Component Library

### Navigation
**Coach Dashboard Sidebar:**
- Fixed left sidebar (w-64) with logo at top (h-16)
- Navigation items: py-3 px-4, rounded-lg, with icon (w-5 h-5) + text
- Active state: distinct background treatment
- Sections: Dashboard, Clients, Programs, Messages, Settings
- User profile at bottom with avatar (w-10 h-10, rounded-full) + name + role label

**Top Bar (Main Content Area):**
- h-16, flex justify-between items-center, px-8
- Page title (text-2xl font-semibold)
- Action buttons on right (primary CTA prominent)

### Cards
**Client Card (Grid View):**
- Rounded-xl, border, p-6
- Avatar (w-16 h-16, rounded-full) at top
- Client name (text-lg font-semibold)
- Metadata row: last active, program status (text-sm with icons)
- Quick actions: icon buttons at bottom-right (w-8 h-8)

**Program Card:**
- Rounded-lg, border, overflow-hidden
- Header section: p-4 with program name (text-lg font-semibold) + duration badge
- Exercise list: divide-y, each item p-3 with exercise name + sets/reps
- Footer: p-4 with progress bar and completion percentage

**Workout Exercise Item:**
- Flex layout: exercise name (flex-1) + sets/reps/weight (text-sm)
- Checkbox for completion (w-5 h-5, rounded)
- Icon for exercise type (w-6 h-6)
- Hover state reveals edit/delete actions

### Forms
**Input Fields:**
- Height: h-11 (44px for mobile-friendly touch targets)
- Padding: px-4 py-3
- Border: rounded-lg, border with focus:ring-2 treatment
- Label: text-sm font-medium, mb-2
- Helper text: text-xs, mt-1

**Button System:**
- Primary: px-6 py-3, rounded-lg, font-medium, text-base
- Secondary: px-6 py-3, rounded-lg, font-medium, border
- Icon button: w-10 h-10, rounded-lg, flex items-center justify-center
- Destructive: same sizing, distinct treatment
- Sizes: Small (px-4 py-2 text-sm), Default (px-6 py-3), Large (px-8 py-4 text-lg)

### Data Display
**Stats Dashboard:**
- Grid: grid-cols-2 md:grid-cols-4, gap-4
- Stat card: rounded-xl, border, p-6
- Label: text-xs font-medium, uppercase, tracking-wider
- Value: text-3xl font-bold, mt-2
- Change indicator: text-sm with icon (↑/↓) and percentage

**Progress Tracking:**
- Progress bars: h-2, rounded-full, relative overflow-hidden
- Weekly view: 7 columns (grid-cols-7), each day shows completion dot
- Chart containers: min-h-[300px] for proper data visualization space

### Messaging Interface
**Chat Layout:**
- Split view: conversation list (w-80) + active conversation (flex-1)
- Message bubbles: max-w-md, rounded-2xl, p-4, mb-2
- Coach messages: ml-auto (align right)
- Client/AI messages: mr-auto (align left)
- Input area: fixed at bottom, h-16, with text input + send button
- AI indicator: subtle badge/icon to distinguish AI responses

**AI Chat Panel:**
- Overlay/modal: max-w-2xl, rounded-2xl, max-h-[600px]
- Scrollable message area with suggestions at start
- Example prompts as clickable cards: rounded-lg, border, p-3, hover state

### Authentication Pages
**Login/Register:**
- Centered card: max-w-md, mx-auto, mt-20
- Rounded-xl, border, p-8
- Logo at top (mb-8)
- Form fields with spacing: space-y-4
- Social login options: grid grid-cols-2 gap-3
- Footer link: text-sm, text-center, mt-6

### Tables (Client/Program Lists)
**Data Table:**
- Rounded-lg, border, overflow-hidden
- Header: font-medium, text-sm, uppercase, tracking-wider, px-6 py-4
- Rows: px-6 py-4, border-t, hover state
- Actions column: flex gap-2 with icon buttons
- Pagination: flex justify-between items-center, px-6 py-4, border-t

---

## Page Layouts

### Coach Dashboard (Homepage)
- Grid: grid-cols-1 lg:grid-cols-3, gap-8
- Stats overview: 4 stat cards in grid-cols-2 lg:grid-cols-4
- Recent clients: card with list, max 5 items, "View All" link
- Upcoming sessions: timeline view with time + client + program
- Quick actions: prominent cards for "Add Client" and "Create Program"

### Client List Page
- Search bar at top: h-11, rounded-lg, with search icon
- Filter pills: flex gap-2, each rounded-full, px-4 py-2
- Grid view: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Empty state: centered, max-w-md, with illustration placeholder + "Add Client" CTA

### Program Builder
- 2-column: exercise library (w-80, scrollable) + program editor (flex-1)
- Drag-and-drop zones: min-h-[200px], dashed border when empty
- Exercise cards in builder: rounded-lg, p-4, with drag handle icon
- Sets/reps inputs: inline, w-16 each, grouped

### Client Dashboard (Client View)
- Hero section: h-48, rounded-xl, p-8, with welcome message + current program card
- Today's workout: prominent card, rounded-xl, p-6
- Progress section: grid-cols-1 md:grid-cols-2, gap-6, charts and stats
- AI coach CTA: floating button bottom-right, w-14 h-14, rounded-full, with chat icon

### Stripe Checkout Page
- Centered layout: max-w-lg, mx-auto
- Plan comparison: 2 cards side-by-side (Free vs Pro)
- Selected plan: rounded-xl, border-2 (distinct), p-6
- Feature list: space-y-3, with checkmark icons (w-5 h-5)
- Payment form: embedded Stripe Elements with consistent styling

---

## Animation Guidelines

**Use Sparingly:**
- Page transitions: simple fade (150ms)
- Card hover: subtle lift with shadow (transform: translateY(-2px))
- Button interactions: inherent states only
- Loading states: subtle spinner or skeleton screens
- NO scroll-triggered animations
- NO complex entrance animations

---

## Images

**Usage Strategy:**
- Authentication pages: Abstract fitness imagery or gradient background (optional)
- Empty states: Simple line illustrations for "no clients," "no programs"
- User avatars: circular, consistent sizing (w-10 h-10, w-16 h-16, w-24 h-24)
- Exercise library: Optional exercise demonstration thumbnails (w-20 h-20, rounded-lg)
- NO large hero images - this is a utility app, not marketing

**Hero Sections:**
- Client dashboard only: h-48 background treatment with gradient or subtle pattern
- Purpose: Welcome message + quick program access, not visual wow factor

---

## Mobile Responsiveness

- Sidebar: slide-over drawer on mobile (triggered by hamburger menu)
- Card grids: stack to single column (grid-cols-1) on mobile
- Tables: horizontal scroll on mobile or convert to card view
- Chat: full-screen on mobile, hide conversation list when viewing active chat
- Bottom navigation bar on mobile: fixed bottom-0, h-16, with 4-5 main nav items
- Touch targets: minimum h-11 (44px) for all interactive elements