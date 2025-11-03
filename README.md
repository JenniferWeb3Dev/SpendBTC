# SpendBTC Frontend

**SpendBTC** is a cross-chain decentralized app (dApp) allowing users to use Bitcoin (BTC) as collateral to borrow a stablecoin called **MUSD**, make payments via QR code, and manage their vault positions. The app connects to both Sepolia testnet and Mezo mainnet for demonstration purposes.

---

## **Features**

### 1. Dashboard

* Shows connected wallet address.
* Displays BTC collateral, MUSD debt, and vault health.
* Updates dynamically when borrowing or repaying MUSD.
* Collateral ratio represented as a visual progress bar.

### 2. Borrow MUSD

* Deposit BTC as collateral to mint MUSD.
* Input desired borrow amount.
* Manage collateral: add more BTC or repay MUSD to free collateral.
* Real-time updates in the vault overview.

### 3. Vault Overview

* Visual snapshot of BTC collateral, MUSD debt, collateral ratio, and health status.
* Automatic updates based on user actions.

### 4. Pay via QR Code

* Generate a QR code for payments in MUSD.
* Optionally link the QR to the app for repayment workflows.

### 5. Send BTC

* Simple interface to send BTC (mock or wrapped token).
* Input recipient address and amount.
* Transaction simulation for demonstration purposes.

### 6. Wallet Management

* Connect/disconnect wallet using MetaMask.
* Network verification handled in the background (Sepolia/Mezo).

### 7. Styling

* Black and gold theme.
* Fully center-aligned layout for optimal UX.
* Smooth, clean interface for dashboards, forms, and buttons.

---

## **Tech Stack**

* **React.js** - Frontend framework
* **Vite** - Development server
* **Wagmi** - Ethereum/Mezo wallet connection
* **ViEM** - Blockchain client
* **React Query** - Data fetching & caching
* **QRCode.react** - QR code generation
* **CSS** - Custom styling (black & gold theme)

---

## **Installation**

1. Clone the repo:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/spendbtc-frontend.git
cd spendbtc-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file if needed for API keys (e.g., Alchemy):

```env
VITE_ALCHEMY_SEPOLIA_KEY=your_alchemy_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in your browser:

```
http://localhost:5173
```

---

## **Folder Structure**

```
spendbtc-frontend/
├─ src/
│  ├─ App.jsx          # Main React component
│  ├─ App.css          # Styling (black & gold theme)
│  ├─ wagmiClient.js   # Wallet & blockchain clients setup
│  └─ walletClient.js  # Wallet connection helper
├─ package.json
└─ vite.config.js
```

---

## **Future Plans**

* Integrate real BTC vaults with MUSD minting.
* Full cross-chain repayment system via QR codes.
* Live stablecoin payments and lending protocol launch.
* Improved dashboard analytics for collateral and debt tracking.

---

## **Demo**

**SpendBTC** allows users to:

1. Connect their wallet (MetaMask) securely.
2. Deposit BTC as collateral and borrow MUSD.
3. Pay or receive payments with QR codes.
4. Monitor vault health and collateral ratio.
5. Disconnect the wallet at any time.

---

## **License**

MIT License – open source for hackathons, education, and prototype development.

---

## **Acknowledgments**

* Inspired by DeFi protocols and cross-chain lending systems.
* Mezo Hackathon demo project for showcasing blockchain integrations.
* Built with love using React, Wagmi, ViEM, and QR code technology.







