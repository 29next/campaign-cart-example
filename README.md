# Campaign Cart Example

Example campaign using the Campaign Cart SDK with customized 11ty static site generator.

## Setup

### Installation

```bash
npm install
```

### Development

Start the development server with interactive campaign selection:

```bash
npm run dev
```

This will:
1. Show a list of available campaigns
2. Let you select which campaign to preview
3. Start the Eleventy dev server on port 8082
4. Open your browser to the selected campaign

### Build

Build the static site for production:

```bash
npm run build
```

Output will be in the `_site` directory.

### Configuration

Configure a campaign's API key:

```bash
npm run config
```

This interactive tool will:
1. Show available campaigns
2. Prompt for campaign selection
3. Prompt for API key
4. Update the campaign's `config.js` file

### Copy Campaign

Clone an existing campaign to create a new one:

```bash
npm run copy
```

## Campaign File Structure

```
campaign-cart-example/
├── _data/
│   └── campaigns.json          # Campaign registry (list of all campaigns)
├── src/
│   ├── src.11tydata.js         # Auto-resolves layouts for all campaigns
│   └── [campaign-slug]/        # Individual campaign directory
│       ├── _layouts/           # Campaign-specific layouts
│       │   └── base.html       # Base layout template
│       ├── css/                # Campaign styles
│       │   ├── custom.css
│       │   ├── next-staging-core.css
│       │   └── funnels-*.css   # Page-specific styles
│       ├── images/             # Campaign images
│       │   ├── favicon.png
│       │   ├── webclip.png
│       │   └── ...
│       ├── js/                 # Campaign scripts
│       │   └── funnels-*.js    # Page-specific scripts
│       ├── config.js           # Campaign configuration (API key, etc.)
│       ├── landing.html        # Landing page
│       ├── checkout.html       # Checkout page
│       ├── upsell.html         # Upsell page
│       └── receipt.html        # Receipt/thank you page
├── scripts/
│   ├── dev.js                  # Development server launcher
│   ├── copy-campaign.js        # Campaign cloning tool
│   └── configure-campaign.js   # API key configuration tool
├── .eleventy.js                # Eleventy config with custom filters
└── package.json
```

### Key Files

- **`_data/campaigns.json`** - Register all campaigns here
- **`src/src.11tydata.js`** - Automatically resolves campaign-specific layouts
- **`src/[campaign]/_layouts/base.html`** - Campaign's base layout
- **`src/[campaign]/config.js`** - Campaign Cart SDK configuration

## Page Frontmatter

Each campaign page uses YAML frontmatter to configure the page.

### Example

```yaml
---
page_layout: base.html
title: Checkout
page_type: checkout
next_success_url: upsell.html
styles:
  - css/funnels-funnel-1-checkout.css
scripts:
  - js/custom-script.js
use_swiper: true
footer: true
---
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page_layout` | string | No | Layout file in `_layouts/`. Defaults to `base.html` |
| `title` | string | Yes | Page title for `<title>` tag |
| `page_type` | string | No | Page type: `product`, `checkout`, `upsell`, `receipt` |
| `permalink` | string | No | Custom URL path (e.g., `/starter/`) |
| `next_success_url` | string | No | Redirect URL after successful checkout |
| `next_upsell_accept` | string | No | URL when upsell accepted |
| `next_upsell_decline` | string | No | URL when upsell declined |
| `styles` | array | No | Page-specific CSS files (relative paths) |
| `scripts` | array | No | Page-specific JS files (relative paths) |
| `use_swiper` | boolean | No | Include Swiper library for image galleries |
| `footer` | boolean | No | Show footer on this page |

### Layout Resolution

Layouts are automatically resolved to the campaign's `_layouts/` directory:

- `page_layout: base.html` → `starter/_layouts/base.html`
- `page_layout: custom.html` → `starter/_layouts/custom.html`

**No layout specified?** Defaults to `base.html`.

## Template Tags (Filters)

Campaign Cart Example provides custom Eleventy filters for campaign-agnostic paths.

### `campaign_asset`

Resolves asset paths to the current campaign.

**Syntax:**
```liquid
{{ 'filename' | campaign_asset }}
```

**Examples:**
```liquid
<!-- Config -->
<script src="{{ 'config.js' | campaign_asset }}"></script>
<!-- Output: /starter/config.js -->

<!-- CSS -->
<link href="{{ 'css/custom.css' | campaign_asset }}" rel="stylesheet">
<!-- Output: /starter/css/custom.css -->

<!-- Images -->
<img src="{{ 'images/logo.png' | campaign_asset }}" alt="Logo">
<!-- Output: /starter/images/logo.png -->
```

**Use for:** CSS files, JavaScript files, images, config.js, any campaign asset.

---

### `campaign_link`

Generates clean URLs for inter-page navigation.

**Syntax:**
```liquid
{{ 'filename.html' | campaign_link }}
```

**Examples:**
```liquid
<!-- Navigation link -->
<a href="{{ 'checkout.html' | campaign_link }}">Checkout</a>
<!-- Output: /starter/checkout/ -->

<!-- Campaign Cart meta tag -->
<meta name="next-success-url" content="{{ next_success_url | campaign_link }}">
<!-- Output: /starter/upsell/ -->

<!-- Data attribute -->
<button data-next-url="{{ 'upsell.html' | campaign_link }}">Continue</button>
<!-- Output: /starter/upsell/ -->
```

**Features:**
- Removes `.html` extension
- Adds trailing slash
- Prepends campaign slug
- Handles anchor links (`#section`) and absolute URLs

**Use for:** Page links, navigation URLs, redirect URLs, Campaign Cart SDK meta tags.

## Connecting to Campaigns App

To connect this campaign to your 29 Next Campaigns App:

1. Run `npm run config`
2. Select your campaign
3. Enter your API key from the Campaigns App
4. Deploy your campaign

For more details, see the [Campaigns App documentation](https://docs.29next.com/apps/campaigns-app).

## Test Orders

You can use our [test cards](https://docs.29next.com/manage/orders/test-orders) to create test orders.