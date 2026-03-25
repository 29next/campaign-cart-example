# [ARCHIVED] Next Commerce Campaign Example

> **This repository has been archived.** Please visit [campaign-cart-starter-templates](https://github.com/NextCommerceCo/campaign-cart-starter-templates) for the latest starter templates.

Next Commerce campaign using the Campaign Cart SDK. This example uses [next-campaign-page-kit](https://github.com/nextcommerceco/campaign-page-kit) for local development and page building with Liquid templating.

## Setup

### Installation

```bash
npm install
```

### Development

Start the development server with interactive campaign selection:

```bash
npm run start
```

This will:
1. Show a list of available campaigns
2. Let you select which campaign to preview
3. Start the development server
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

> [!IMPORTANT]
> Get your Campaign API key from Campaigns App in your store. See [Campaigns App Guide](https://developers.nextcommerce.com/docs/campaigns/).


### Clone Campaign

Clone an existing campaign to create a new one:

```bash
npm run clone
```

## Campaign File Structure

```
campaign-cart-example/
├── _data/
│   └── campaigns.json          # Campaign registry (contains data for all campaigns)
├── src/
│   └── [campaign-slug]/        # Individual campaign directory
│       ├── _layouts/           # Campaign-specific layouts
│       │   └── base.html       # Base layout template
│       ├── assets/             # Campaign assets (CSS, images, JS, config)
│       │   ├── css/            # Campaign styles
│       │   ├── images/         # Campaign images
│       │   ├── js/             # Campaign scripts
│       │   └── config.js       # SDK configuration
│       ├── presale.html        # Presale page (Base URL)
│       ├── checkout.html       # Checkout page
│       ├── upsell.html         # Upsell page
│       ├── receipt.html        # Receipt page
│       └── *.html              # Any other page
└── package.json
```

### Key Files

- **`_data/campaigns.json`** - Register all campaigns and their configuration data here
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
  - https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css
  - css/offer.css
scripts:
  - https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js
  - js/offer.js
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
| `styles` | array | No | Page-specific CSS files (relative paths or external URLs) |
| `scripts` | array | No | Page-specific JS files (relative paths or external URLs) |
| `footer` | boolean | No | Show footer on this page |

## Campaign Context (`campaign`)

Each page automatically has access to its campaign's data from `_data/campaigns.json` via the `campaign` object. This allows you to provide configured context directly to your pages.

### Usage

You can access any key defined in your campaign's entry in `_data/campaigns.json`:

```liquid
<h1>{{ campaign.name }}</h1>
<p>Contact: {{ campaign.support_email }}</p>
```

### Adding Custom Context

To add more context, simply add new keys to your campaign in `_data/campaigns.json`. Each entry is keyed by the campaign slug, which must match the campaign's directory name under `src/`.

```json
{
  "starter": {
    "name": "Starter Campaign",
    "support_email": "support@example.com",
    "custom_headline": "Welcome to our Store!"
  }
}
```

Then use it in your templates:

```liquid
<h2>{{ campaign.custom_headline }}</h2>
```

### Layout Resolution

Layouts are automatically resolved to the campaign's `_layouts/` directory:

- `page_layout: base.html` → `starter/_layouts/base.html`
- `page_layout: custom.html` → `starter/_layouts/custom.html`

**No layout specified?** Defaults to `base.html`.

## Template Filters

The following Liquid template filters are available for campaign-agnostic paths.

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

---

### `campaign_include`

Includes a file relative to the current campaign's `_includes` directory. This is useful for including reusable components that are specific to a campaign.

**Syntax:**
```liquid
{% campaign_include 'filename.html' arg=value %}
```

**Examples:**
```liquid
<!-- Include a slider component -->
{% campaign_include 'slider.html' images=page.slider_images %}

<!-- Include with parameters -->
{% campaign_include 'slider.html' images=page.slider_images show_package_image=true %}
```

**Use for:** Reusable components within a campaign (e.g., sliders, testimonials).

## Connecting to Campaigns App

To connect this campaign to your 29 Next Campaigns App:

1. Run `npm run config`
2. Select your campaign
3. Enter your API key from the Campaigns App
4. Deploy your campaign

For more details, see the [Campaigns App documentation](https://docs.29next.com/apps/campaigns-app).

## Test Orders

You can use our [test cards](https://docs.29next.com/manage/orders/test-orders) to create test orders.
