# Mobile Responsiveness Quick Reference Guide

## 🎯 Key Numbers to Remember

### Touch Targets
- **Minimum:** 48px × 48px
- **Buttons:** `min-h-12` class (48px)
- **Button padding:** `py-3 sm:py-3.5` (12-14px vertical)
- **Form inputs:** `py-2.5 sm:py-3` (10-12px)
- **Links:** `py-2` or `py-3` for clickable area

### Typography Progression
- **Mobile (base):** text-sm (14px)
- **Tablet (sm):** text-base (16px)
- **Desktop (md):** text-lg (18px)
- **Large (lg):** text-xl (20px)

### Spacing Increments
- **Smallest:** gap-1 (4px), space-y-1 (4px)
- **Small:** gap-3 (12px), space-y-3 (12px)
- **Medium:** gap-4 (16px), space-y-4 (16px)
- **Large:** gap-6 (24px), space-y-6 (24px)
- **Extra:** gap-8 (32px), space-y-8 (32px)

### Container Padding
- **Mobile:** px-4 (16px left/right)
- **Tablet:** sm:px-6 (24px left/right)
- **Desktop:** lg:px-8 (32px left/right)

### Responsive Breakpoints
- **base:** 0px+ (mobile)
- **sm:** 640px+ (tablet)
- **md:** 768px+ (large tablet)
- **lg:** 1024px+ (desktop)
- **xl:** 1280px+ (large desktop)

---

## 📱 Common Responsive Patterns

### Hero Section
```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
<p className="text-sm sm:text-base md:text-lg lg:text-xl">
<button className="min-h-12 py-3 sm:py-3.5">
```

### Cards/Grids
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
<div className="p-4 sm:p-6 md:p-8">
```

### Navigation
```tsx
<div className="h-16 sm:h-20"> {/* navbar container */}
<img className="h-10 sm:h-14 w-auto" /> {/* logo */}
<div className="hidden lg:flex"> {/* desktop menu */}
```

### Images
```tsx
<Image
  src={src}
  alt={alt}
  fill
  className="h-48 sm:h-72 object-cover"
  quality={75}
  priority={isPriority}
/>
```

### Forms
```tsx
<input className="w-full px-3 sm:px-4 py-2.5 sm:py-3">
<label className="text-xs sm:text-sm">
```

---

## ✅ Testing Checklist

### Quick Mobile Test
- [ ] No horizontal scrolling
- [ ] Text readable without zoom
- [ ] Buttons touch-able (48×48px min)
- [ ] Forms usable on mobile
- [ ] Images load properly
- [ ] Navigation accessible
- [ ] Fast page load (<3s)

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1920px)

### Browser Testing
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

---

## 🚀 Performance Tips

1. **Images:** Always use Next.js Image component with quality={75}
2. **Lazy loading:** Add `loading="lazy"` to non-critical images
3. **Priority:** Mark above-fold images with `priority`
4. **CSS:** Use Tailwind utilities, avoid custom CSS
5. **JavaScript:** Keep client-side code minimal
6. **Caching:** Set proper cache headers in next.config.mjs

---

## ♿ Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Heading hierarchy proper (h1 → h2 → h3)
- [ ] Form labels associated with inputs
- [ ] ARIA labels on icon buttons
- [ ] Keyboard navigation works
- [ ] Touch targets ≥ 48×48px
- [ ] Alt text on all images
- [ ] Focus states visible

---

## 📋 Code Style Guide

### Do's ✅
```tsx
// Good: Responsive typography
<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">

// Good: Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

// Good: Touch-friendly buttons
<button className="min-h-12 py-3 px-6 sm:px-8">

// Good: Images with quality optimization
<Image src={src} quality={75} alt={alt} />
```

### Don'ts ❌
```tsx
// Bad: Fixed sizing that doesn't scale
<h2 className="text-3xl"> {/* same on all screens */}

// Bad: Unresponsive layout
<div className="grid grid-cols-3"> {/* breaks on mobile */}

// Bad: Too small touch targets
<button className="py-1 px-2"> {/* less than 48px */}

// Bad: Unoptimized images
<img src={src} /> {/* no quality optimization */}
```

---

## 🔗 Useful Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 📞 Common Issues & Solutions

### Issue: Text too small on mobile
**Solution:** Add responsive sizing: `text-sm sm:text-base md:text-lg`

### Issue: Buttons hard to tap
**Solution:** Ensure `min-h-12` and proper padding: `py-3`

### Issue: Grid breaks on mobile
**Solution:** Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Issue: Images distorted
**Solution:** Use `object-cover` with fixed aspect ratio container

### Issue: Horizontal scrolling
**Solution:** Ensure container has `w-full` and `overflow-hidden`

### Issue: Slow on mobile
**Solution:** Optimize images with Next.js Image component and quality={75}

---

## 📊 Performance Targets

- Lighthouse Score: ≥ 90 on mobile
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.5s

---

**Last Updated:** January 27, 2026
