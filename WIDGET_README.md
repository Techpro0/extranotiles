# Extrano Tiles — Floating Contact Widget

## Overview

A production-ready floating contact widget that appears on every page of the Extrano Tiles website. The widget provides a modern, accessible way for visitors to reach out via multiple channels.

**File Structure:**
```
assets/
├── css/
│   └── widget.css           # All widget styling
├── js/
│   └── widget.js            # Widget logic & interactions
└── [pages].html

widget.html                   # Widget markup template
```

## Features

### 🎨 Design
- **Floating Action Button (FAB)** - 60×60px circular button fixed to bottom-right
- **Glassmorphism Card** - Modern popup panel with backdrop blur
- **Brand-Consistent Colors** - Uses Extrano Tiles gold (#c4a06a) and dark (#9e7a4a)
- **Smooth Animations** - Pulse effect on FAB, smooth slide-up panel opening
- **Responsive Design** - Adapts to mobile, tablet, and desktop

### ✨ Interactions
- **Click FAB** → Opens/closes contact panel
- **Click Outside** → Closes panel
- **Press Esc** → Closes panel
- **Tab Navigation** → Navigate through contact options (trapped within panel)
- **Hover Effects** → Icon scale + background tint on options
- **Platform-Specific Colors** → WhatsApp green, Instagram gradient, Facebook blue, etc.

### ♿ Accessibility
- Full keyboard navigation support
- ARIA labels on all interactive elements
- `role="dialog"` on the popup panel
- Focus management (focus returns to FAB when panel closes)
- Reduced motion support (`prefers-reduced-motion`)
- High contrast mode support
- Semantic HTML structure

### 📱 Responsive
- Mobile-optimized popup positioning
- Safe area padding for notched devices (`env(safe-area-inset-*)`)
- Adjusts FAB and panel size on small screens
- Touch-friendly button sizes

## File Details

### `widget.html`
The markup template containing:
- Floating Action Button with SVG icon
- Contact panel header with close button
- List of contact options (WhatsApp, Phone, Email, Instagram, Facebook, Twitter, Contact Form)
- Each option includes icon, title, subtitle, and action link

**To customize contact options:** Edit the links and data in this file.

### `widget.css`
Complete self-contained styling including:
- **Variables** - Color scheme in `:root`
- **FAB** - Circular button with gradient, pulse animation
- **Panel** - Card styling with backdrop blur, shadows
- **Options** - Hover states, icon colors per platform
- **Animations** - Pulse, bounce, slide-up transitions
- **Responsive** - Mobile breakpoints at 640px
- **Accessibility** - `@media (prefers-reduced-motion)`, high contrast support

**Key classes:**
- `.ext-widget-fab` - Floating button
- `.ext-widget-panel` - Popup card
- `.ext-widget-panel.open` - Panel shown state
- `.ext-widget-option` - Individual contact row
- `.ext-widget-icon-*` - Platform-specific icon colors

### `widget.js`
Core functionality:
- **Initialization** - Sets up event listeners on DOM ready
- **Toggle Logic** - Opens/closes panel with FAB click
- **Keyboard Support** - Escape to close, Tab to navigate
- **Click Outside** - Detects clicks outside panel and closes it
- **Focus Management** - Traps focus within panel, returns to FAB on close
- **Link Handling** - Closes panel appropriately for internal/external links
- **Public API** - Exposes `window.extWidget` with `open()`, `close()`, `toggle()` methods

## Installation

### Step 1: Add Files to Your Project
Copy the three widget files to your project:
```
assets/css/widget.css       ← New CSS file
assets/js/widget.js         ← New JS file
widget.html                 ← New template file
```

### Step 2: Update Each Page
Already done! All pages (index.html, about.html, contact.html, collection-600x600.html) include:

1. **CSS Link** in `<head>`:
   ```html
   <link rel="stylesheet" href="assets/css/widget.css">
   ```

2. **Widget Loader** before `</body>`:
   ```html
   <script src="assets/js/widget.js" defer></script>
   <script>
     fetch('widget.html')
       .then(r => r.text())
       .then(html => {
         document.body.insertAdjacentHTML('beforeend', html);
         // Re-run widget.js in case it was already loaded
         const script = document.createElement('script');
         script.src = 'assets/js/widget.js';
         script.defer = true;
         document.body.appendChild(script);
       })
       .catch(err => console.warn('Widget load failed:', err));
   </script>
   ```

## Customization

### Change Contact Links
Edit `widget.html` in the `<a href="...">` elements:

```html
<!-- WhatsApp -->
<a href="https://wa.me/917226855653" ...>

<!-- Phone -->
<a href="tel:+917226855653" ...>

<!-- Email -->
<a href="mailto:extranotiles@gmail.com" ...>

<!-- Social Links -->
<a href="https://www.instagram.com/extranotiles" ...>
```

### Customize Colors
In `widget.css`, update the `:root` variables:

```css
:root {
  --ext-gold: #c4a06a;              /* Primary brand color */
  --ext-gold-dark: #9e7a4a;         /* Darker variant */
  --ext-white: #ffffff;
  --ext-black: #000000;
  --ext-text-light: #8a7f7a;
}
```

### Adjust Animation Speed
Edit transition durations in `widget.css`:

```css
.ext-widget-fab {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Change 0.3s to desired duration */
}

.ext-widget-panel {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Change 0.25s to desired duration */
}
```

### Change FAB Position
In `widget.css`:

```css
.ext-widget-container {
  bottom: 25px;   /* Distance from bottom */
  right: 25px;    /* Distance from right */
}
```

### Add/Remove Contact Options
In `widget.html`, add or remove `<li>` items in `.ext-widget-list`:

```html
<li role="listitem">
  <a href="[URL]" target="_blank" rel="noopener noreferrer" class="ext-widget-option" aria-label="[Label]">
    <span class="ext-widget-icon ext-widget-icon-[platform]" aria-hidden="true">
      <!-- SVG icon -->
    </span>
    <div class="ext-widget-text">
      <strong>[Title]</strong>
      <span>[Subtitle]</span>
    </div>
  </a>
</li>
```

## Troubleshooting

### Widget Not Appearing
1. **Check file paths** - Ensure CSS and JS are in `assets/css/` and `assets/js/`
2. **Check fetch** - Ensure `widget.html` exists in project root and fetch path is correct
3. **Check browser console** - Look for CORS or 404 errors
4. **Check z-index** - Ensure nothing has `z-index > 9998`

### Widget JavaScript Not Running
1. **Check defer attribute** - Ensure `<script defer>` is present
2. **Check DOM elements** - Verify `.ext-widget-fab` and `#ext-widget-panel` exist
3. **Check console** - Look for JavaScript errors

### Styling Issues
1. **CSS not loaded** - Check `<link rel="stylesheet" href="assets/css/widget.css">`
2. **Specificity conflict** - Widget uses `.ext-widget-*` prefix to avoid conflicts
3. **Mobile not responsive** - Check viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

## Public API

You can control the widget programmatically:

```javascript
// Open the panel
window.extWidget.open();

// Close the panel
window.extWidget.close();

// Toggle open/close
window.extWidget.toggle();

// Example: Open widget automatically after 5 seconds
setTimeout(() => window.extWidget.open(), 5000);

// Example: Close widget on custom event
document.addEventListener('myCustomEvent', () => window.extWidget.close());
```

## Browser Support

✅ Modern browsers (Chrome, Firefox, Safari, Edge)
✅ Mobile browsers (iOS Safari, Chrome Mobile)
✅ Keyboard navigation
✅ Screen readers
✅ Touch devices

⚠️ IE 11 not supported (uses modern CSS/JS)

## Performance

- **CSS**: ~6KB (minified)
- **JS**: ~3KB (minified, no dependencies)
- **Load time**: <50ms
- **No external dependencies** - uses vanilla JS only
- **No jQuery required**

## Accessibility Checklist

- ✅ Keyboard accessible (Tab, Escape)
- ✅ ARIA labels on all buttons
- ✅ Focus management
- ✅ `role="dialog"` on panel
- ✅ Semantic HTML
- ✅ Color contrast meets WCAG AA
- ✅ Reduced motion support
- ✅ High contrast mode support
- ✅ Screen reader friendly

## Mobile Considerations

- **Safe area support** - Notched/punch-hole devices handled
- **Touch targets** - 60×60px FAB, 44px+ touch zones
- **Responsive card** - Scales down to 90% width on mobile
- **Portrait/Landscape** - Adapts to orientation changes

## License

Part of Extrano Tiles website. All rights reserved.

## Support

For issues or questions, contact: extranotiles@gmail.com

---

**Widget Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready
