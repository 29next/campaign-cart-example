# AGENTS.md

This file provides instructions for AI coding agents working on this campaign cart example project.

## Project Overview

This is a campaign cart example project built with **Eleventy (11ty)** static site generator. It provides a framework for creating e-commerce campaign funnels with multiple pages (landing, checkout, upsell, receipt) using the 29 Next Campaign Cart SDK.

**Key Technologies:**
- Eleventy 3.x (static site generator)
- Liquid template engine
- Campaign Cart SDK v0.3.7
- Node.js

## Project Structure

```
campaign-cart-example/
├── _data/campaigns.json       # Campaign registry
├── src/
│   ├── src.11tydata.js        # Auto-resolves layouts
│   └── [campaign-slug]/       # Individual campaigns
│       ├── _layouts/          # Campaign layouts
│       ├── css/               # Styles
│       ├── images/            # Assets
│       ├── js/                # Scripts
│       ├── config.js          # SDK config
│       └── *.html             # Pages
├── lib/                       # Build scripts
├── .eleventy.js               # Eleventy config
└── _site/                     # Build output (ignored)
```

## Plugin Architecture

The campaign builder uses a modular plugin architecture:

**`lib/eleventy-plugin.js`** - Main Eleventy plugin
- Registers `campaign_asset` and `campaign_link` filters
- Sets up passthrough copy for campaign assets
- Creates collections for each campaign

**`lib/config.js`** - Shared configuration module
- Path resolution utilities (`getCampaignsPath`, `getSrcPath`, `getOutputPath`)
- Campaign data loaders (`loadCampaigns`, `saveCampaigns`)
- Used by all CLI tools for consistent path handling

**`.eleventy.js`** - Minimal configuration
```javascript
const campaignBuilderPlugin = require('./lib/eleventy-plugin');
eleventyConfig.addPlugin(campaignBuilderPlugin);
```

## Agent Role

You are a web development assistant specialized in:
- Eleventy/11ty static site generators
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
npm run dev
# Interactive prompt to select campaign
# Starts server on port 8082
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

### Frontmatter Conventions

Pages use YAML frontmatter:
```yaml
---
page_layout: base.html      # Optional, defaults to base.html
title: Page Title
page_type: checkout         # product|checkout|upsell|receipt
styles:
  - css/page-specific.css
scripts:
  - js/page-script.js
use_swiper: true           # Optional, for image galleries
footer: true               # Optional
---
```

### Layout Resolution

- **DO NOT** hardcode campaign paths in layouts
- Layouts are auto-resolved via `src/src.11tydata.js`
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
1. Run `npm run dev`
2. Select campaign to test
3. Navigate through funnel: Landing → Checkout → Upsell → Receipt
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
- Use `campaign_asset` and `campaign_link` filters
- Keep campaigns self-contained (all assets in campaign directory)
- Maintain existing SDK integration points
- Follow frontmatter conventions
- Update `_data/campaigns.json` when adding campaigns

### Ask First
- Changing Campaign Cart SDK version
- Modifying `src/src.11tydata.js` (layout resolution logic)
- Changing `.eleventy.js` configuration
- Altering `config.js` structure significantly
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
4. Test with `npm run dev`

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
- Eleventy config: `.eleventy.js`
- Eleventy plugin: `lib/eleventy-plugin.js`
- Shared config utilities: `lib/config.js`
- Layout resolver: `src/src.11tydata.js`
- Build scripts: `lib/dev.js`, `lib/clone-campaign.js`, `lib/configure-campaign.js`
- Campaign files: `src/{campaign-slug}/`

## Error Handling

Common errors and solutions:

**"Layout does not exist"**
- Check `page_layout:` in frontmatter matches file in `_layouts/`
- Ensure `src/src.11tydata.js` exists

**"Cannot find module"**
- Run `npm install`
- Check `package.json` dependencies

**Assets not loading (404)**
- Verify using `campaign_asset` filter
- Check file exists in `src/{campaign}/` directory
- Ensure passthrough copy in `.eleventy.js`

**Links broken**
- Use `campaign_link` filter for all page URLs
- Check frontmatter for `next_success_url` etc.

## Additional Resources

- [Campaign Cart SDK Docs](https://docs.29next.com/apps/campaigns-app)
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Liquid Template Language](https://liquidjs.com/)
