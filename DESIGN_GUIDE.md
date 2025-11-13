# 🎨 Design System Guide

## Color Palette

### Primary Colors

```css
/* Brand Primary - Deep Red */
#82181A
rgb(130, 24, 26)

/* Brand Secondary - Bright Orange */
#EE4918
rgb(238, 73, 24)

/* Brand Accent - Golden Orange */
#ff9900
rgb(255, 153, 0)
```

### Usage Guidelines

#### Primary Red (#82181A)

**Use for:**

- Header/Navigation background
- Primary buttons
- Important badges
- Category accents
- Footer social icons

**Don't use for:**

- Large text blocks (readability)
- Form inputs
- Disabled states

#### Secondary Orange (#EE4918)

**Use for:**

- Call-to-action buttons
- Price tags
- Hover states
- Highlighted items
- Gradient combinations

**Don't use for:**

- Body text
- Backgrounds without sufficient contrast

#### Accent Gold (#ff9900)

**Use for:**

- Star ratings
- Special badges
- Decorative elements
- Gradient accents
- Success indicators

**Don't use for:**

- Primary navigation
- Large backgrounds

---

## Typography

### Font Families

#### K2D (Body Font)

```css
font-family: "K2D", sans-serif;
```

**Weights Available:**

- 300 - Light
- 400 - Regular
- 500 - Medium
- 600 - Semi Bold
- 700 - Bold
- 800 - Extra Bold

**Use for:**

- Body text
- Paragraphs
- UI elements
- Buttons
- Form labels

#### Pacifico (Display Font)

```css
font-family: "Pacifico", cursive;
```

**Use for:**

- Brand logo
- Special headings
- Decorative text elements

**Don't use for:**

- Body paragraphs
- Form inputs
- Small text (below 16px)

---

## Component Patterns

### Buttons

#### Primary Button

```tsx
<Button className="bg-brand-secondary hover:bg-brand-primary text-white">
  Click Me
</Button>
```

#### Secondary Button

```tsx
<Button
  variant="outline"
  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
>
  Click Me
</Button>
```

#### Ghost Button (Navigation)

```tsx
<Button
  variant="ghost"
  className="text-gray-100 hover:text-gray-900 hover:bg-white/90"
>
  Click Me
</Button>
```

---

### Cards

#### Design Card

```tsx
<div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-brand-secondary transition-all duration-300">
  {/* Card content */}
</div>
```

#### Category Card

```tsx
<div className="group bg-white rounded-xl border border-red-200 shadow-sm hover:shadow-2xl hover:border-brand-secondary transition-all duration-300 animate-fadeInUp">
  {/* Card content */}
</div>
```

---

### Badges

#### Price Badge

```tsx
<span className="bg-brand-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-float">
  $29
</span>
```

#### Category Badge

```tsx
<span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-md">
  Web Design
</span>
```

#### Tag Badge

```tsx
<span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer">
  #modern
</span>
```

---

## Animation Classes

### Fade In Up

```css
.animate-fadeInUp
```

**Duration:** 1s
**Easing:** ease-out
**Use for:** Section headers, cards, CTAs

### Slide In

```css
.animate-slideIn
```

**Duration:** 1s
**Easing:** ease-out
**Use for:** Side panels, modals, images

### Gradient Animation

```css
.animate-gradient
```

**Duration:** 6s
**Easing:** linear, infinite
**Use for:** Hero text, special headings

### Float

```css
.animate-float
```

**Duration:** 3s
**Easing:** ease-in-out, infinite
**Use for:** Price badges, floating elements

---

## Spacing Scale

```css
/* Recommended spacing values */
gap-2  (0.5rem / 8px)
gap-3  (0.75rem / 12px)
gap-4  (1rem / 16px)
gap-6  (1.5rem / 24px)
gap-8  (2rem / 32px)

/* Padding */
p-3  (0.75rem)
p-4  (1rem)
p-5  (1.25rem)
p-6  (1.5rem)
p-8  (2rem)

/* Margins */
mb-2, mb-3, mb-4, mb-6, mb-8, mb-12, mb-16
```

---

## Shadows

### Light Shadow

```css
shadow-sm - Subtle card elevation
```

### Medium Shadow

```css
shadow-md - Interactive elements
```

### Large Shadow

```css
shadow-lg - Important CTAs
```

### Extra Large Shadow

```css
shadow-xl - Featured content
```

### Double Extra Large Shadow

```css
shadow-2xl - Hover states, elevated cards
```

---

## Gradients

### Primary Gradient

```css
bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent
```

**Use for:** CTA sections, hero backgrounds

### Text Gradient

```css
bg-gradient-to-r from-brand-primary to-brand-secondary
```

**With:** `bg-clip-text text-transparent`

---

## Border Radius

```css
rounded-md   (0.375rem / 6px) - Buttons, tags
rounded-lg   (0.5rem / 8px) - Small cards
rounded-xl   (0.75rem / 12px) - Standard cards
rounded-2xl  (1rem / 16px) - Large sections
rounded-full - Badges, pills, avatars
```

---

## Responsive Breakpoints

```css
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

---

## Hover Effects

### Standard Transition

```css
transition-all duration-300
```

### Smooth Custom Transition

```css
transition-smooth (0.3s cubic-bezier)
```

### Transform on Hover

```css
hover:scale-105    - Slight grow
hover:scale-110    - Medium grow
hover:-translate-y-1 - Lift up
hover:translate-x-1  - Shift right
```

---

## Best Practices

### DO ✅

- Use brand colors consistently
- Apply animations to enhance UX
- Maintain adequate contrast ratios
- Test on mobile devices
- Use semantic HTML
- Follow accessibility guidelines

### DON'T ❌

- Mix too many animation types
- Use brand colors on brand colors (low contrast)
- Overuse animations (causes distraction)
- Ignore mobile breakpoints
- Use Pacifico for body text
- Skip hover states on interactive elements

---

## Accessibility

### Color Contrast

- **AA Standard:** 4.5:1 for normal text
- **AAA Standard:** 7:1 for normal text
- All brand colors tested for contrast

### Focus States

```css
focus-visible: ring-2 ring-brand-primary;
```

### ARIA Labels

Always include for icon-only buttons:

```tsx
<button aria-label="Close menu">
  <X />
</button>
```

---

## Component Library Reference

### Import Statements

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
```

### Icon Library

**Lucide React** - Consistent, modern icon set

- ArrowRight - Navigation, CTAs
- Star - Ratings
- Download - Download counts
- Eye - View buttons
- Heart - Likes

---

## Performance Tips

1. **Lazy Load Images**: Use Next.js Image component
2. **Optimize Fonts**: Use font-display: swap
3. **Reduce Animations**: On mobile, disable heavy animations
4. **Use CSS Variables**: For dynamic theming
5. **Minimize Reflows**: Use transform instead of position changes

---

## Version History

**v1.0.0** - November 13, 2025

- Initial design system implementation
- Brand color palette defined
- Animation library created
- Component patterns established

---

## Support

For design questions or improvements, refer to:

- `DESIGN_UPDATE_SUMMARY.md` - Complete change log
- `globals.css` - All custom CSS and animations
- DESIGN-MARKETPLACE folder - Original design reference

---

**Last Updated**: November 13, 2025
**Maintained By**: Design Team
