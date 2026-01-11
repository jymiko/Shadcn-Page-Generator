# shadcn-nextjs-page-generator

> CLI tool to generate production-ready Next.js pages with shadcn/ui, Tailwind CSS v4, and Framer Motion animations.

[![npm version](https://img.shields.io/npm/v/shadcn-nextjs-page-generator.svg)](https://www.npmjs.com/package/shadcn-nextjs-page-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

## Features

✨ **Interactive CLI** - User-friendly prompts guide you through the generation process
🏗️ **Flexible Architecture** - Choose between DDD (Domain-Driven Design) or Simplified structure
🎨 **shadcn/ui Components** - Beautiful, accessible components built with Radix UI
� **Auto-Install** - Automatically detects and installs missing shadcn components
💨 **Tailwind CSS v4** - Latest Tailwind with modern CSS-first syntax
🎭 **Framer Motion** - Smooth animations with configurable intensity
📊 **Complete CRUD** - Tables with search, filter, sort, pagination out of the box
🔄 **Multiple Data Fetching** - Support for Mock data, TanStack Query, or standard fetch
⚡ **TypeScript First** - Full type safety and IntelliSense support
♻️ **Smart Overwrite** - Regenerate files safely with automatic overwrite detection

## Quick Start

```bash
# Run with npx (no installation required)
npx shadcn-nextjs-page-generator

# Or install globally
npm install -g shadcn-nextjs-page-generator
shadcn-page-gen
```

## Prerequisites

Your Next.js project should have:

- Next.js 14+ with App Router
- shadcn/ui components installed ([installation guide](https://ui.shadcn.com/docs/installation/next))
- Tailwind CSS v4+ configured
- TypeScript

## What Gets Generated

### DDD Architecture

```
modules/your-module/
├── domain/
│   ├── entities/your-module.entity.ts
│   └── repositories/your-module.repository.interface.ts
├── application/
│   └── use-cases/get-your-modules.use-case.ts
├── infrastructure/
│   └── repositories/your-module.repository.ts
└── presentation/
    └── components/your-module-list.tsx

app/(dashboard)/your-route/
├── page.tsx
└── template.tsx  # if animations enabled
```

### Simplified Architecture

```
components/your-module/
└── your-module-list.tsx

app/(dashboard)/your-route/
├── page.tsx
└── template.tsx  # if animations enabled
```

## Usage

### 1. Run the CLI

```bash
npx shadcn-nextjs-page-generator
```

### 2. Answer Interactive Prompts

```
? What is the name of the page? User Management
? What is the route path? admin/users
? Choose architecture pattern: DDD (Domain-Driven Design)
? What is the Entity name? User
? Use default columns? Yes
? Add filters? Yes
? Include Stats Cards at the top? Yes
? Include Row Selection (Checkboxes)? No
? Data Fetching Strategy? TanStack Query
? Enable Column Sorting? Yes
? Add page transition animations? Yes
? Animate table rows on load? Yes
? Animation intensity: Moderate (balanced)
```

### 3. Install Dependencies (if needed)

The CLI automatically checks and installs missing shadcn/ui components! You'll see:

```
🔍 Checking shadcn components...
  ✓ button already installed
  ✓ table already installed
  - card missing, installing...
  - pagination missing, installing...

✓ Installed 2 component(s): card, pagination
```

If you prefer to install manually or need additional dependencies:

```bash
# If you selected TanStack Query
npm install @tanstack/react-query

# If you enabled animations
npm install framer-motion
```

> **Note:** Auto-install requires shadcn/ui to be initialized in your project (`npx shadcn@latest init`)

### 4. Navigate to Your Page

```bash
npm run dev
# Visit http://localhost:3000/admin/users
```

## Generated Features

### 📋 Table Features

- **Search** - Full-text search across columns
- **Filters** - Select, Date, and Input filters
- **Sorting** - Configurable column sorting (ASC/DESC)
- **Pagination** - Page size selection (10, 20, 30, 50, 100)
- **Row Actions** - View, Edit, Delete buttons
- **Row Selection** - Optional checkboxes for bulk actions

### 📊 Optional Features

- **Stats Cards** - 4 metric cards at the top
- **Animations** - Framer Motion with 3 intensity levels (subtle, moderate, bold)
  - Page transitions
  - List stagger animations
  - Card animations

### 🔄 Data Fetching Strategies

1. **Mock Data (Default)**
   - Repository pattern with in-memory data
   - 10 sample items
   - 500ms simulated API delay

2. **TanStack Query**
   - Automatic caching and revalidation
   - Optimistic updates
   - Query key based on search params

3. **Standard Fetch**
   - Basic `useEffect` + `useState`
   - Simple for beginners
   - Easy to customize

## Architecture Options

### DDD (Domain-Driven Design)

**Best for:**
- Large applications
- Team projects
- Complex business logic
- Maintainability and testability

**Structure:**
- Domain layer (Entities, Repositories)
- Application layer (Use Cases)
- Infrastructure layer (Implementations)
- Presentation layer (Components)

### Simplified

**Best for:**
- Small projects
- Prototypes
- Simple CRUD operations
- Quick iterations

**Structure:**
- Components folder
- Direct data fetching
- No layered architecture

## Animation Variants

### Subtle (Professional)
```typescript
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.2 }
```

### Moderate (Balanced)
```typescript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.3, ease: "easeInOut" }
```

### Bold (Eye-catching)
```typescript
initial: { opacity: 0, scale: 0.95, y: 30 }
animate: { opacity: 1, scale: 1, y: 0 }
transition: { duration: 0.4 }
```

## Examples

### Generate User Management Page

```bash
npx shadcn-nextjs-page-generator
```

**Configuration:**
- Page Name: "User Management"
- Route: "admin/users"
- Architecture: DDD
- Columns: Name, Email, Role, Created At
- Filters: Role (Select), Status (Select)
- Features: Stats Cards ✓, Row Selection ✗
- Data Fetching: TanStack Query
- Animations: Moderate intensity

### Generate Simple Product List

```bash
npx shadcn-nextjs-page-generator
```

**Configuration:**
- Page Name: "Products"
- Route: "products"
- Architecture: Simplified
- Columns: Name, Price, Stock, Category
- Filters: Category (Select)
- Features: Stats Cards ✗, Row Selection ✓
- Data Fetching: Mock
- Animations: Subtle intensity

## Customization

### Replace Mock Data with Real API

#### DDD Architecture

Edit `infrastructure/repositories/your-module.repository.ts`:

```typescript
async findAll(params?: any): Promise<Entity[]> {
  // Replace mock implementation
  const response = await fetch('/api/your-endpoint');
  return await response.json();
}
```

#### Simplified Architecture

Edit `components/your-module/your-module-list.tsx`:

```typescript
// Find the fetchData function or useQuery
const response = await fetch('/api/your-endpoint');
const data = await response.json();
```

### Add TanStack Query Provider

Wrap your app in `app/layout.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Customize Animations

Edit animation variants in generated component:

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Adjust stagger delay
      delayChildren: 0.2,    // Add delay before children animate
    }
  }
};
```

## shadcn/ui Components Used

The generator automatically detects and installs the required shadcn/ui components based on your configuration:

**Always installed:**
- `button`
- `table`
- `card`
- `input`
- `select`
- `badge`
- `pagination`
- `dropdown-menu`

**Conditionally installed:**
- `popover` + `calendar` (if date filters enabled)
- `checkbox` (if row selection enabled)

### Auto-Install Feature

The CLI automatically checks for missing components and installs them using:

```bash
npx shadcn@latest add <component> --yes --overwrite
```

This happens before generating your files, ensuring all required components are available.

### Manual Installation

If you prefer to install components manually:

```bash
npx shadcn@latest add button table card input select badge pagination dropdown-menu popover calendar checkbox
```

## FAQ

### Can I use this with Pages Router?

Currently, this tool generates code for Next.js App Router only. Pages Router support may be added in the future.

### Does this work with JavaScript projects?

The generated code is TypeScript. You can remove type annotations manually, but TypeScript is recommended for better developer experience.

### Can I customize the templates?

Currently, templates are built into the CLI. Custom template support is planned for a future release.

### What if I don't use shadcn/ui?

This tool is specifically designed for shadcn/ui. Using other component libraries would require significant code changes.

### How do I update the generated code?

The generated code is meant to be a starting point. Edit it directly in your project - it won't be overwritten unless you regenerate to the same location.

## Troubleshooting

### "Module not found" errors

Make sure you've installed all required shadcn/ui components and dependencies.

### TanStack Query not working

Ensure your app is wrapped in `<QueryClientProvider>`. See [Customization](#add-tanstack-query-provider) above.

### Tailwind styles not applying

Check that your `tailwind.config.ts` includes the generated file paths:

```typescript
content: [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './modules/**/*.{ts,tsx}',  // For DDD architecture
]
```

### Framer Motion animations not showing

Install framer-motion:

```bash
npm install framer-motion
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT © SALT Solutions

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com/)

---

Made with ❤️ by SALT Solutions
