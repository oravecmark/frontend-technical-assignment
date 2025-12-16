# Organization Onboarding Application

A multi-tenant organization onboarding system built with React, TypeScript, and TailwindCSS. This application provides a complete user journey from authentication through organization creation to dashboard management.

## 🚀 Features

### Authentication & User Management

- Secure login system with form validation
- Multi-user support with data isolation
- Role-based user identification (Admin, Manager, User)
- Protected routes and session management

### Onboarding Flow

- **3-step progressive disclosure form:**
  1. Tenant Configuration (environment, region, identifier)
  2. Organization Details (business information, industry, country)
  3. Labels & Categories (customizable tags with color coding)
- Real-time form validation with visual feedback
- Progress tracking with completion indicators
- Form state persistence during navigation
- Success confirmation screen

### Dashboard

- **Organization Overview:**
  - Dynamic statistics cards (tenant info, organization count, active labels)
  - Organization switcher dropdown (multi-org support)
  - Detailed organization information display
  - Color-coded label management
- **Recent Activity Timeline:**
  - Organization creation events
  - Label addition tracking
  - Timestamp-based sorting
- **Organization Management:**
  - Create new organizations
  - Delete existing organizations (with confirmation, also for you for testing purposes)
  - Switch between multiple organizations seamlessly (using the org dropdown)

### UX Polish

- Global toast notification system
- Loading states with animations
- Input field character limits
- Text truncation for long names
- Responsive form validation (touched state pattern)
- Optional field handling (green validation without red errors, used on fields that are not mandatory)

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 3 with custom animations
- **Routing:** React Router v7
- **State Management:** React Hooks (useState, useEffect)
- **Data Fetching:** TanStack Query v5 (React Query)
- **Icons:** Heroicons v2
- **Backend Simulation:** json-server v1.0 (beta)
- **TypeScript:** v5.9

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/oravecmark/frontend-technical-assignment.git
cd frontend-technical-assignment
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Start the API server (in a separate terminal):**

```bash
npm run api:start
```

5. **Open your browser:**

```
http://localhost:5173
```

### Demo Credentials

The application includes three test users:

- **Admin User:** `admin@financehub.com` / `password123`
- **Manager:** `marek@financehub.com` / `password123`
- **User:** `john@financehub.com` / `password123`

## 🏗️ Architecture Decisions

### Customer-Facing vs Platform Admin View

This implementation focuses on the **customer-facing application** rather than the platform administrative dashboard shown in some Figma designs.

**Rationale:**

- The assignment emphasizes "organization onboarding flow" - a customer journey
- Demonstrates proper multi-tenant architecture with data isolation
- Shows complete end-to-end user experience (signup → onboard → manage)
- Better alignment with the onboarding focus of the assignment

**What this application provides:**

- ✅ Customers create and manage their own organizations
- ✅ Multi-user support with isolated data per user
- ✅ Organization switching for users with multiple orgs
- ✅ Personal dashboard showing user-specific data

**What a platform admin view would provide (different application layer):**

- ❌ FinanceHub employees managing all customers
- ❌ Platform-wide statistics (all users, all organizations)
- ❌ Cross-customer data access and management

### Multi-Tenant Data Architecture

The application uses a simulated relational database structure:

```
users: { id, email, password, name, role }
submission: { id, userId, createdAt, tenant, organization, labels }
```

**Key features:**

- Foreign key relationships (userId links submissions to users)
- Data isolation (users only access their own submissions)
- Timestamp tracking for activity logs
- RESTful API patterns

### Form Validation Strategy

**Required fields:** Red border when empty + touched, green when valid
**Optional fields:** Gray border when empty, green when filled (never red)

This approach provides clear visual feedback without penalizing users for skipping optional fields.

## 📁 Project Structure

```
src/
├── components/
│   ├── AccordionComponent.tsx    # Collapsible section wrapper
│   ├── Login.tsx                 # Authentication page
│   ├── OnboardingFlow.tsx        # Main onboarding orchestrator
│   ├── TenantForm.tsx            # Step 1: Tenant configuration
│   ├── OrganizationForm.tsx      # Step 2: Organization details
│   ├── LabelsForm.tsx            # Step 3: Label management
│   ├── Dashboard.tsx             # User dashboard
│   ├── LoadingSpinner.tsx        # Reusable loading component
│   ├── Toast.tsx                 # Notification component
│   └── SuccessScreen.tsx         # Completion confirmation
├── contexts/
│   └── ToastContext.tsx          # Global toast state management
├── App.tsx                       # Routing configuration
└── main.tsx                      # Application entry point
```

## 🎯 Key Technical Highlights

1. **State Management:** Context API for global notifications, React Query for server state
2. **TypeScript:** Full type safety with interfaces for all data structures
3. **Form Handling:** Controlled components with validation logic
4. **API Integration:** RESTful operations (GET, POST, DELETE) with json-server
5. **Responsive Design:** TailwindCSS utility classes with custom animations
6. **Code Organization:** Component-based architecture with clear separation of concerns

## 🔄 Data Flow

1. **Login:** User credentials → API validation → localStorage session → Route to dashboard/onboarding
2. **Onboarding:** Form data collection → Validation → API POST with userId → Success confirmation
3. **Dashboard:** Fetch user submissions → Display latest org → Allow switching → Recent activity aggregation

## 🚧 Future Improvements

With additional time, I would implement:

### High Priority

- **Role-based dashboards:** Different views for Admin vs Manager vs User roles
- **Environment switching:** Toggle between Production, Sandbox, and Development environments
- **Edit functionality:** Modify existing organizations and labels
- **Soft delete:** Archive organizations instead of permanent deletion
- **Activity log persistence:** Separate activities table for comprehensive history

### Medium Priority

- **Search & filtering:** Find organizations and filter by criteria
- **Pagination:** For users with many organizations
- **Export functionality:** Download organization data as CSV/PDF
- **Email notifications:** Organization creation confirmations

### Nice-to-Have

- **Dark mode:** Theme toggle
- **Internationalization:** Multi-language support
- **Advanced charts:** Organization analytics and trends
- **Collaboration:** Invite team members to organizations

## 🧪 Testing

To test the multi-tenant isolation:

1. Login as `admin@financehub.com` and create an organization
2. Logout and login as `marek@financehub.com`
3. Verify you cannot see admin's organizations
4. Create your own organization
5. Switch back to admin - verify data separation

Obviously this is one of many test scenarios you can try, the application is also "endpoint proof", meaning if you try to manually go to /dashboard without actually having an organization, you will be prompted to create one, and so on.

Each of the 3 users has a different setting so you can try multiple scenarios which goes like this:

1. Login as admin → See 3 orgs, test switcher
2. Login as Marek → See onboarding flow
3. Login as John → See single org dashboard

## 📝 Notes

- The application uses `json-server` for backend simulation. In production, this would be replaced with a proper backend (Node.js, Django, etc.)
- Passwords are stored in plain text in `db.json` for demo purposes. Production would use proper hashing
- The application demonstrates frontend capabilities; production would require proper authentication
- Timestamps use ISO format for consistency and timezone handling

## 👤 Author

Marek Oravec

- GitHub: [@oravecmark](https://github.com/oravecmark)

## 📄 License

This project was created as a technical assignment for Ohpen.
