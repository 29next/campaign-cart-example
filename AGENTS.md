# AGENTS.md

This file provides instructions for AI coding agents working on this campaign cart example project.

## Project Overview

This is a campaign cart example project built with **next-campaign-page-kit**, a custom static site generator. It provides a framework for creating e-commerce campaign funnels with multiple pages (presale, offer, checkout, upsell, receipt) using the Next Commerce Campaign Cart SDK.

**Key Technologies:**
- next-campaign-page-kit (static site generator)
- Liquid template engine
- Campaign Cart SDK v0.3.7
- Node.js

## Project Structure

```
campaign-cart-example/
├── _data/campaigns.json       # Campaign registry
├── src/
│   └── [campaign-slug]/       # Individual campaigns
│       ├── _layouts/          # Campaign layouts
│       ├── _includes/         # Reusable components
│       ├── assets/            # Assets (css, images, js, config)
│       ├── presale.html       # Presale page
│       ├── offer.html         # Offer page
└── _site/                     # Build output (.gitignore)
```

## Agent Role

You are a web development assistant specialized in:
- next-campaign-page-kit static site generator
- Liquid templating
- E-commerce campaign funnels
- Front-end HTML/CSS/JavaScript

**Priorities:**
1. Maintain campaign-agnostic code using filters
2. Keep campaigns clone-friendly
3. Follow existing patterns and conventions
4. Preserve SDK integration points

## Build Commands

### Development
```bash
npm run start
# Interactive prompt to select campaign
# Starts development server
```

### Production Build
```bash
npm run build
# Outputs to _site/
```

### Campaign Management
```bash
npm run clone         # Clone a campaign
npm run config        # Configure API key
```

## Code Style Guidelines

### File Naming
- Campaign directories: `lowercase-with-dashes`
- HTML files: `lowercase.html`
- Layout files: `base.html` in `_layouts/`
- JavaScript: `camelCase.js`
- CSS: `kebab-case.css`

### Template Filters

**ALWAYS use these custom filters for campaign-agnostic paths:**

1. **`campaign_asset`** - For CSS, JS, images, config
   ```liquid
   {{ 'config.js' | campaign_asset }}
   {{ 'css/custom.css' | campaign_asset }}
   {{ 'images/logo.png' | campaign_asset }}
   ```

2. **`campaign_link`** - For page URLs (removes .html, adds slashes)
   ```liquid
   {{ 'checkout.html' | campaign_link }}
   <a href="{{ 'upsell.html' | campaign_link }}">Continue</a>
   ```

3. **`campaign_include`** - For reusable campaign components
   ```liquid
   {% campaign_include 'slider.html' images=page.slider_images %}
   ```

### Frontmatter Conventions

Pages use YAML frontmatter:
```yaml
---
page_layout: base.html      # Optional, defaults to base.html
title: Page Title
page_type: checkout         # product|checkout|upsell|receipt
styles:
  - https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css
  - css/page-specific.css
scripts:
  - https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js
  - js/page-script.js
footer: true               # Optional
---
```

### Layout Resolution

- **DO NOT** hardcode campaign paths in layouts
- Layouts are auto-resolved by next-campaign-page-kit
- Format: `page_layout: base.html` → resolves to `{campaign}/_layouts/base.html`

## Campaign SDK Integration

### Config.js Structure
Never remove or significantly alter the structure of `config.js`. Key sections:
- `apiKey` - Campaign API key
- `paymentConfig` - Payment settings
- `addressConfig` - Address/country settings
- `discounts` - Discount codes
- `analytics` - Tracking configuration

### Meta Tags
Campaign Cart SDK uses meta tags for navigation:
```html
<meta name="next-success-url" content="{{ next_success_url | campaign_link }}">
<meta name="next-upsell-accept-url" content="{{ next_upsell_accept | campaign_link }}">
<meta name="next-upsell-decline-url" content="{{ next_upsell_decline | campaign_link }}">
```

### Required Scripts
Base layout must include:
```html
<script src="{{ 'config.js' | campaign_asset }}"></script>
<script src="https://cdn.jsdelivr.net/gh/NextCommerceCo/campaign-cart@v0.3.7/dist/loader.js" type="module"></script>
```

## Testing

### Manual Testing
1. Run `npm run start`
2. Select campaign to test
3. Navigate through funnel: Presale → Offer → Checkout → Upsell → Receipt
4. Verify all assets load (check browser Network tab)
5. Test links work correctly
6. Verify SDK loads without errors

### Validation Checklist
- [ ] All `{{ ... | campaign_asset }}` filters used for assets
- [ ] All `{{ ... | campaign_link }}` filters used for page links
- [ ] No hardcoded campaign paths (e.g., `/starter/`) in templates
- [ ] Config.js has valid API key
- [ ] Pages follow frontmatter conventions
- [ ] Build completes without errors: `npm run build`

## Boundaries

### Always Do
- Use `campaign_asset`, `campaign_link`, and `campaign_include` filters
- Keep campaigns self-contained (all assets in `assets/` directory)
- Maintain existing SDK integration points
- Follow frontmatter conventions
- Update `_data/campaigns.json` when adding campaigns

### Ask First
- Changing Campaign Cart SDK version
- Adding new npm dependencies

### Never Do
- Hardcode campaign paths in templates
- Remove SDK loader script from base layout
- Modify campaign files outside the selected campaign directory
- Commit `_site/` directory
- Change API keys in version control (use `npm run config`)
- Break backward compatibility with existing campaigns

## Common Tasks

### Adding a New Page
1. Create `src/{campaign}/newpage.html`
2. Add frontmatter with `page_layout`, `title`, etc.
3. Use filters: `campaign_asset`, `campaign_link`
4. Test with `npm run start`

### Cloning a Campaign
1. Run `npm run clone`
2. Select source campaign
3. Enter new campaign name and slug
4. Configure API key: `npm run config`

### Modifying Styles
1. Edit `src/{campaign}/css/custom.css` for global styles
2. Create page-specific CSS: `css/funnels-{page}.css`
3. Reference in frontmatter: `styles: [css/funnels-{page}.css]`
4. Use `campaign_asset` filter in base layout

## File Paths

- Campaign registry: `_data/campaigns.json`
- Campaign files: `src/{campaign-slug}/`
- Build scripts: provided by `next-campaign-page-kit`

## Error Handling

Common errors and solutions:

**"Layout does not exist"**
- Check `page_layout:` in frontmatter matches file in `_layouts/`

**"Cannot find module"**
- Run `npm install`
- Check `package.json` dependencies

**Assets not loading (404)**
- Verify using `campaign_asset` filter
- Check file exists in `src/{campaign}/` directory

**Links broken**
- Use `campaign_link` filter for all page URLs
- Check frontmatter for `next_success_url` etc.

## Additional Resources

- [Campaign Cart SDK Docs](https://docs.29next.com/apps/campaigns-app)
- [next-campaign-page-kit](https://github.com/29next/next-campaign-page-kit)
- [Liquid Template Language](https://liquidjs.com/)
