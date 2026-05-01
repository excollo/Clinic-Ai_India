---
name: Clinic AI India Design System
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006c47'
  on-secondary: '#ffffff'
  secondary-container: '#82f9be'
  on-secondary-container: '#00734c'
  tertiary: '#5e3c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d5200'
  on-tertiary-container: '#ffca81'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#82f9be'
  secondary-fixed-dim: '#65dca4'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#ffddb3'
  tertiary-fixed-dim: '#ffb950'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  grid_columns: '12'
  gutter: 24px
  margin: auto
---

## Brand & Style

The design system is built to convey a sense of absolute precision, clinical reliability, and empathetic intelligence. It serves a dual audience: healthcare providers who require data density and speed, and patients who need clarity and reassurance. 

The aesthetic follows a **Corporate / Modern** direction infused with **Minimalism**. By prioritizing high-functionality and whitespace, the interface reduces cognitive load—a critical factor in medical decision-making. The visual language avoids decorative clutter, ensuring that AI-generated insights are the focal point. The result is a professional environment that feels advanced yet accessible, balancing the "cold" efficiency of technology with the "warm" care of medicine.

## Colors

This design system utilizes a palette grounded in medical trust. The **Primary Blue** is used for core actions and navigational elements, signaling authority. The **Secondary Teal** is applied to health-positive indicators and supportive UI elements to create a calming effect.

For the **Dark Mode** implementation, the background shifts to a deep navy-slate (#091E42) rather than pure black to maintain softness. Text contrast ratios are strictly managed to meet WCAG AA standards, ensuring legibility for users with visual impairments. The **Informative Amber** is reserved strictly for cautionary AI insights or pending statuses, ensuring it remains an effective attention-grabber without causing alarm.

## Typography

The design system employs a dual-font strategy to balance character with utility. **Manrope** is used for headlines to provide a modern, refined geometric feel that distinguishes the brand. **Inter** is utilized for all body copy, data tables, and input fields due to its exceptional tall x-height and readability in dense information environments.

Hierarchy is established primarily through weight and scale. Large headlines are reserved for dashboard summaries and patient names, while a robust set of small labels ensures that complex medical data remains scannable.

## Layout & Spacing

A **Fixed Grid** system is used for desktop layouts to ensure maximum control over line lengths for medical reports, transitioning to a **Fluid Grid** for tablet and mobile devices. 

The rhythm is governed by an 8px base unit. Component internal padding should favor the "md" (24px) unit to create a spacious, airy feel that prevents the UI from feeling claustrophobic—especially important in high-stress clinical environments. Consistent gutters of 24px provide clear gutters between data cards and sidebar navigation.

## Elevation & Depth

Visual hierarchy in the design system is achieved through **Ambient Shadows** and tonal layering. Surfaces do not use heavy borders; instead, depth is communicated via soft, multi-layered shadows with low opacity (10-15%) tinted with the primary blue to maintain a cohesive "cool" temperature.

- **Level 0 (Background):** #F4F5F7 (Light) / #091E42 (Dark).
- **Level 1 (Cards/Surface):** Pure White (Light) / #172B4D (Dark).
- **Level 2 (Hover/Active states):** Soft shadow (0px 4px 12px rgba(0, 82, 204, 0.08)).
- **Level 3 (Modals/Popovers):** Deep shadow (0px 12px 32px rgba(0, 0, 0, 0.12)).

In Dark Mode, elevation is further reinforced by increasing the lightness of the surface container rather than increasing shadow density.

## Shapes

The design system utilizes **Rounded** geometry to soften the clinical nature of the product. A standard radius of 8px is applied to small components like input fields and buttons, while larger containers like cards and modals utilize a 12px - 16px radius.

This "soft-rectangle" approach maintains a professional structure while appearing modern and approachable. Interactive elements like chips or badges may utilize a pill-shape (full radius) to distinguish them from actionable buttons.

## Components

### Buttons
Primary buttons feature solid #0052CC fills with white text. Secondary buttons use a subtle teal ghost style or outline. All buttons have a minimum height of 44px to ensure touch-targets are accessible for users in fast-paced environments.

### Input Fields
Inputs utilize a light gray stroke (#DFE1E6) that thickens and changes to Primary Blue on focus. Error states use a 2px red border with supporting micro-copy positioned below the field.

### Cards
Cards are the primary container for AI insights. They must include a subtle 1px border (#EBECF0) and a level-1 shadow. Headers within cards should be separated by a hairline divider to organize metadata effectively.

### AI Indicators
Distinctive "Intelligence" chips use a soft teal background with a 10% opacity and a high-contrast teal icon to denote AI-generated content. This ensures the user can immediately distinguish between human-entered data and machine-generated suggestions.

### Status Badges
Badges use high-contrast text on low-contrast backgrounds (e.g., Amber text on light Amber background) to signal status without overwhelming the visual field.