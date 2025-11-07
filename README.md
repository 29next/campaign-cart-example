# campaign-cart-example
Example Campaign using Campaign Cart SDK

## Getting Started

### Running a Local Server

To view these pages, you'll need to run a local web server. Here are three simple options:

#### Option 1: Using Python (Recommended - No installation needed)

If you have Python 3 installed, simply run:

```bash
python3 serve.py
```

This will automatically start a server on `http://localhost:8000` and open the landing page in your browser.

Alternatively, you can use Python's built-in server (requires manually opening the browser):

```bash
python3 -m http.server 8000 --bind localhost
```

#### Option 2: Using Node.js

If you have Node.js installed, you can use the included serve script:

```bash
npm start
```

This will automatically start a server and open the landing page in your browser.

Or run directly:

```bash
npx http-server . -p 8000 -a localhost -o landing.html
```

#### Option 3: Using VS Code Live Server Extension

If you're using VS Code, you can use the Live Server extension (requires installation if not already installed):

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) from the VS Code marketplace
2. Right-click on `landing.html` in the file explorer
3. Select "Open with Live Server"

The page will automatically open in your browser and reload when you make changes.

## Connecting to Your Campaign in Campaigns App

You can connect this example campaign to your campaign in the Campaigns App. Make sure to update the example API key with your campaign API key from the Campaigns App.

For more details, see the [Campaigns App documentation](https://docs.29next.com/apps/campaigns-app).

## Test Orders

You can use our [test cards](https://docs.29next.com/manage/orders/test-orders) to create a card order