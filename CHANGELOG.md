# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-01-11

### Fixed
- 🐛 TypeScript error "Cannot find name 'animate'" when using Framer Motion animations
- Replaced `<motion.tr>` with properly typed `motion(TableRow)` component
- Added TypeScript `Variants` type for animation variants
- Fixed TypeScript compilation issues in generated components with animations

### Changed
- Improved Framer Motion TypeScript support in generated code
- Enhanced type safety for animation variants

## [1.0.3] - 2026-01-11

### Fixed
- 🐛 CLI not executing - Added auto-execute to `run()` function
- Fixed interactive prompts not showing when running `shadcn-page-gen`
- Updated bin path reference to correct dist location

### Changed
- Improved CLI startup reliability

## [1.0.2] - 2026-01-11

### Changed
- 📝 Updated README badges - Removed download badge (package too new)
- Added TypeScript and Next.js version badges
- Improved badge reliability

## [1.0.1] - 2026-01-11

### Changed
- 📝 Updated package name references in README
- Fixed npm badge URLs to match published package name
- Changed from `shadcn-page-gen` to `shadcn-nextjs-page-generator`

## [1.0.0] - 2026-01-11

### Added
- 🎉 Initial release of shadcn-nextjs-page-generator
- ✨ Interactive CLI with 10-step guided prompts
- 🏗️ Dual architecture support:
  - **DDD (Domain-Driven Design)**: Full Clean Architecture with Domain, Application, Infrastructure, and Presentation layers
  - **Simplified**: Component-only structure for rapid prototyping
- 🎨 **shadcn/ui Components**: Production-ready UI components
  - Table with sorting, filtering, pagination
  - Search functionality
  - Row actions (View, Edit, Delete)
  - Optional stats cards
  - Optional row selection with checkboxes
- 💨 **Tailwind CSS v4**: Modern CSS-first syntax with CSS variables
- 🎭 **Framer Motion Animations**:
  - Page transitions
  - List stagger animations
  - Card animations
  - 3 intensity levels: subtle, moderate, bold
- 📊 **Multiple Data Fetching Strategies**:
  - Mock data with repository pattern
  - TanStack Query (React Query) integration
  - Standard fetch with useEffect
- 🔧 **Configurable Features**:
  - Custom columns with type selection (string, number, boolean, date)
  - Multiple filter types (select, date, input)
  - Column sorting (ASC/DESC)
  - Pagination with size selection
  - Stats cards for metrics display
- 📦 **Production Ready Code**:
  - Full TypeScript support
  - Clean, maintainable code structure
  - Follows Next.js 14+ App Router conventions
  - Responsive design with Tailwind
- 📝 **Complete Documentation**:
  - Comprehensive README with examples
  - Usage instructions
  - Customization guide
  - FAQ section

### Technical Details
- Built with TypeScript 5.9+
- Bundled with tsup for optimal package size
- Uses prompts for interactive CLI
- Chalk and ora for beautiful terminal UI
- Support for Next.js 14+ with App Router
- Compatible with Node.js 18+

### Package Info
- **Package Name**: `shadcn-nextjs-page-generator`
- **CLI Command**: `shadcn-page-gen`
- **License**: MIT
- **Author**: Jatmiko

### Installation
```bash
# Run with npx (recommended)
npx shadcn-nextjs-page-generator

# Or install globally
npm install -g shadcn-nextjs-page-generator
```

### Generated File Structure

**DDD Architecture:**
```
modules/{moduleName}/
├── domain/
│   ├── entities/{moduleName}.entity.ts
│   └── repositories/{moduleName}.repository.interface.ts
├── application/
│   └── use-cases/get-{moduleName}s.use-case.ts
├── infrastructure/
│   └── repositories/{moduleName}.repository.ts
└── presentation/
    └── components/{moduleName}-list.tsx

app/(dashboard)/{routePath}/
├── page.tsx
└── template.tsx  (if animations enabled)
```

**Simplified Architecture:**
```
components/{moduleName}/
└── {moduleName}-list.tsx

app/(dashboard)/{routePath}/
├── page.tsx
└── template.tsx  (if animations enabled)
```

### What's Next
- More templates (forms, modals, detail pages)
- Custom component library support
- Configuration file support
- GitHub Actions for CI/CD
- Additional animation presets
- More data fetching strategies

---

[1.0.4]: https://github.com/jymiko/Shadcn-Page-Generator/releases/tag/v1.0.4
[1.0.3]: https://github.com/jymiko/Shadcn-Page-Generator/releases/tag/v1.0.3
[1.0.2]: https://github.com/jymiko/Shadcn-Page-Generator/releases/tag/v1.0.2
[1.0.1]: https://github.com/jymiko/Shadcn-Page-Generator/releases/tag/v1.0.1
[1.0.0]: https://github.com/jymiko/Shadcn-Page-Generator/releases/tag/v1.0.0
