# StyleCom frontend

## Demo storefront

Run `npm install` and `npm run dev` from this directory. The storefront uses
12 sample products by default, including six men's and six women's products.
Images come from the existing `public` directory, so browsing and cart testing
do not need a running backend or external product image service.

Open a product card, choose a size and quantity, then add it to your cart.
The cart supports quantity changes and removal and persists across refreshes.
Demo checkout allows previewing totals without logging in; placing orders is
disabled for sample products.

To use real inventory, set `VITE_DEMO_DATA=false` and `VITE_API_URL` in `.env`,
then restart Vite (or rebuild for deployment). Demo and live carts use separate
browser storage keys. Edit `src/data/demoProducts.js` to change the sample data.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
