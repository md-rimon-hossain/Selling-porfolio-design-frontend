# 🚀 Quick Reference - Design System

## Colors (Copy-Paste Ready)

```tsx
// Brand Colors
className = "bg-brand-primary"; // #82181A - Deep Red
className = "bg-brand-secondary"; // #EE4918 - Bright Orange
className = "bg-brand-accent"; // #ff9900 - Golden Orange

className = "text-brand-primary";
className = "text-brand-secondary";
className = "text-brand-accent";

className = "border-brand-primary";
className = "border-brand-secondary";
className = "border-brand-accent";

className = "hover:bg-brand-primary";
className = "hover:bg-brand-secondary";
className = "hover:text-brand-secondary";
```

## Fonts

```tsx
// Pacifico (Brand/Display)
className = "font-pacifico";

// K2D (Body) - Default, no class needed
```

## Animations

```tsx
// Fade In Up
className="animate-fadeInUp"
style={{ animationDelay: '0.1s' }}

// Slide In
className="animate-slideIn"

// Float (for badges, icons)
className="animate-float"

// Gradient Text
className="animate-gradient"
```

## Common Patterns

### Primary Button

```tsx
<Button className="bg-brand-secondary hover:bg-brand-primary text-white">
  Click Me
</Button>
```

### Outline Button

```tsx
<Button
  variant="outline"
  className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300"
>
  Click Me
</Button>
```

### Card with Hover

```tsx
<div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-brand-secondary transition-all duration-300 overflow-hidden">
  {/* Content */}
</div>
```

### Price Badge (Floating)

```tsx
<span className="bg-brand-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md animate-float">
  ${price}
</span>
```

### Section Header

```tsx
<div className="animate-fadeInUp">
  <h2 className="text-4xl font-bold text-gray-900 mb-2">Section Title</h2>
  <p className="text-lg text-gray-600">Subtitle text</p>
</div>
```

### Gradient Background

```tsx
<section className="bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent">
  {/* Content */}
</section>
```

### Tag with Hover

```tsx
<span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md hover:bg-brand-secondary hover:text-white transition-colors cursor-pointer">
  #{tag}
</span>
```

### Icon Button

```tsx
<button className="w-9 h-9 rounded-lg bg-brand-primary hover:bg-brand-secondary flex items-center justify-center transition-colors">
  <Icon className="w-4 h-4" />
</button>
```

### Stats Box

```tsx
<div className="inline-flex items-center gap-8 px-8 py-6 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl shadow-lg">
  <div className="text-center">
    <div className="text-3xl font-bold text-white mb-1">1000+</div>
    <div className="text-sm text-white/90">Designs</div>
  </div>
</div>
```

## Grid Layouts

```tsx
// 3-Column Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// With Staggered Animation
{items.map((item, index) => (
  <div
    key={item.id}
    className="animate-fadeInUp"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Content */}
  </div>
))}
```

## Navigation Link

```tsx
<Link
  href="/path"
  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive
      ? "text-gray-900 bg-white"
      : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
  }`}
>
  Link Text
</Link>
```

## Image with Hover Scale

```tsx
<div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
  <Image
    src={imageUrl}
    alt={title}
    fill
    className="object-cover transition-all duration-500 group-hover:scale-110"
  />
</div>
```

## CTA Section

```tsx
<section className="py-24 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent relative overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
  </div>
  <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
    <h2 className="text-5xl font-bold text-white mb-6 animate-fadeInUp">
      Call to Action
    </h2>
    <p className="text-xl text-white/90 mb-10 animate-fadeInUp">
      Subtitle text
    </p>
  </div>
</section>
```

## Star Rating

```tsx
<div className="flex items-center gap-2">
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-brand-accent fill-brand-accent" : "text-gray-300"
        }`}
      />
    ))}
  </div>
  <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
</div>
```

## Glassmorphism Effect

```tsx
<div className="glass-effect p-6 rounded-xl">
  {/* Content */}
</div>

// Or inline
<div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl">
  {/* Content */}
</div>
```

## Loading State

```tsx
<div className="animate-pulse">
  <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
  <div className="p-5 space-y-3">
    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
  </div>
</div>
```

## Responsive Text Sizes

```tsx
// Headings
className = "text-3xl md:text-4xl lg:text-5xl";

// Body
className = "text-base md:text-lg";

// Small
className = "text-sm md:text-base";
```

## Color Combinations

### Light Background

```tsx
bg-white + text-gray-900 + hover:text-brand-secondary
```

### Dark Background

```tsx
bg-gray-900 + text-white + hover:text-brand-accent
```

### Brand Background

```tsx
bg-brand-primary + text-white + hover:bg-brand-secondary
```

## Z-Index Layers

```tsx
z - 0; // Background
z - 10; // Content
z - 20; // Hero content
z - 50; // Header/Navigation
z - [60]; // Modals/Overlays
```

## Common Widths

```tsx
max-w-7xl // Main container (1280px)
max-w-4xl // Content sections (896px)
max-w-2xl // Text content (672px)
max-w-xl  // Narrow content (576px)
```

---

**Pro Tips:**

1. Always use `transition-all duration-300` for smooth effects
2. Group related classes together for readability
3. Use `group` and `group-hover:` for parent-child hover effects
4. Test all animations on mobile devices
5. Maintain consistent spacing (multiples of 4px)

---

**Last Updated**: November 13, 2025
