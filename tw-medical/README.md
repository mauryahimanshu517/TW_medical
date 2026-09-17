# TW Medical — Frontend Demo

A frontend-only medical e-commerce demo built with HTML5, CSS3 and vanilla JavaScript. It has no backend, database, login or payment gateway.

## Run

Open `index.html` in a browser. No build step is needed.
Font Awesome and Google Fonts load from a CDN, so icons need an internet connection. Everything else works offline.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home: hero carousel, categories, brand marquee, recently viewed, top-rated suppliers |
| `products.html` | Listing with filters. Supports `?category=`, `&sub=`, `?brand=`, `?q=`, `?sort=`, `?view=brands` and `?view=categories` |
| `product.html?id=101` | Product details: gallery, variants, pack selector, pincode check, highlights |
| `cart.html` | Cart with quantity controls, coupons and a price summary |
| `wishlist.html` | Saved products |

## Configuration

These settings are at the top of `js/app.js`:

```js
const whatsappNumber = "YOUR_NUMBER_HERE"; // e.g. "919876543210"
const TW_CONFIG = { freeDeliveryAbove: 499, deliveryCharge: 49, taxRate: 0.05, ... };
```

If you don't set a WhatsApp number, the button opens WhatsApp and lets the user pick a chat.

## Data

Products, categories, brands and sellers are in `js/products.js`. To add a product, append an object to `PRODUCTS`. The `art` field picks one of the built-in SVG illustrations (for example `tape`, `bandage`, `glucometer`, `bpmonitor` or `oximeter`), and the site generates 4–6 gallery images from it.

To use real photos instead, replace the `images` array with image URLs, such as files in `assets/images/`.

The browser stores the cart, wishlist, recently viewed products and the last pincode in `localStorage`. The keys are `tw_cart`, `tw_wishlist`, `tw_recent` and `tw_pincode`.

Demo coupons: `TWFIRST` and `HEALTH50`.
