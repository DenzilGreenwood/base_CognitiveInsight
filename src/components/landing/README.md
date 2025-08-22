# Landing Page Components

This directory contains the modular components for the CognitiveInsight landing page.

## Structure

The landing page has been broken down into the following modular components:

### Core Components

- **`HeroSection.tsx`** - Main hero section with headline, CTA buttons, and key stats
- **`YourStorySection.tsx`** - Personal story and background section  
- **`ProblemSection.tsx`** - Problem statement section highlighting AI auditability challenges
- **`SolutionSection.tsx`** - Solution overview featuring CIAF + LCM
- **`StakeholdersSection.tsx`** - Value propositions for different stakeholder groups
- **`DemoSection.tsx`** - Interactive simulation with sliders and metrics
- **`WhitePaperSection.tsx`** - Contact form for white paper requests
- **`CTASection.tsx`** - Call-to-action section for pilot requests
- **`Footer.tsx`** - Site footer with copyright and links

### Shared Components

- **`SectionHeader.tsx`** - Reusable section header with kicker, title, and subtitle
- **`types.ts`** - TypeScript type definitions shared across components
- **`index.ts`** - Barrel export file for easy importing

## Usage

```tsx
import CognitiveInsightLanding from "@/components/CognitiveInsightLanding";

export default function HomePage() {
  return <CognitiveInsightLanding />;
}
```

Or import individual sections:

```tsx
import { HeroSection, ProblemSection, SolutionSection } from "@/components/landing";
```

## Benefits of Modular Structure

1. **Maintainability** - Each section is self-contained and easier to update
2. **Reusability** - Components can be reused across different pages
3. **Testing** - Individual components can be unit tested in isolation
4. **Performance** - Enables code splitting and lazy loading
5. **Collaboration** - Different team members can work on different sections

## State Management

The main landing page component manages shared state (like simulation parameters) and passes it down to child components via props. Each component receives only the props it needs, following the principle of least privilege.

## Styling

All components use:
- Tailwind CSS for styling
- Existing UI components from `@/components/ui/`
- Consistent spacing and typography scales
- Dark theme with indigo/purple gradients

## File Organization

```
src/components/landing/
├── index.ts              # Barrel exports
├── types.ts              # Shared TypeScript types
├── SectionHeader.tsx     # Reusable section header
├── HeroSection.tsx       # Hero section
├── YourStorySection.tsx  # Story section
├── ProblemSection.tsx    # Problem section
├── SolutionSection.tsx   # Solution section
├── StakeholdersSection.tsx # Stakeholders section
├── DemoSection.tsx       # Demo section
├── WhitePaperSection.tsx # White paper section
├── CTASection.tsx        # CTA section
└── Footer.tsx            # Footer
```
