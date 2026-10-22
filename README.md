
# EcoDrop — E-Waste Recycling Tracker

## 1. Project Overview

EcoDrop is a decentralised application (DApp) designed to improve transparency in electronic waste recycling. It allows users to register electronic waste on a blockchain and track whether the items have been collected by an authorised recycler.

## 2. Objectives

- Register electronic waste records on the blockchain.
- Track the collection status of registered items.
- Authorise recyclers using wallet addresses.
- Maintain transparent and tamper-resistant records.
- Demonstrate blockchain-based access control.

## 3. Technologies Used

- Solidity — Smart contract development
- Remix IDE — Smart contract compilation and deployment
- Ethereum Sepolia Testnet — Blockchain testing
- MetaMask — Wallet connection and transaction approval
- HTML, CSS and JavaScript — Frontend
- Ethers.js — Frontend-to-blockchain communication
- Node.js and npm — Development tools and dependencies

## 4. Features

- Connect a MetaMask wallet.
- Register electronic waste by category and description.
- Authorise recycler wallets.
- Confirm collection of registered waste.
- Display waste records and collection status.
- Display total, pending and collected record counts.

## 5. Project Structure

```text
EcoDrop-DApp/
├── contracts/
│   └── EcoDrop.sol
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── screenshots/
├── README.md
├── .gitignore
└── package.json
```

## 6. How to Run

1. Install Node.js and npm.
2. Clone or download this repository.
3. Open the project folder in VS Code.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Deploy `EcoDrop.sol` using Remix and MetaMask on the Sepolia testnet.
6. Copy the deployed contract address and ABI into `frontend/app.js`.
7. Connect MetaMask to Sepolia.
8. Start the frontend from the project root:

   ```bash
   npx lite-server --baseDir=frontend
   ```

9. Open the local URL displayed in the terminal.

## 7. Testing

The following test cases are intended to be performed:

- TC01: Register electronic waste and verify that the record appears.
- TC02: Authorise a recycler and confirm collection of a registered item.
- TC03: Verify that an unauthorised wallet cannot confirm collection.

Update this section with the actual results after running each test.

## 8. Screenshots

Screenshots of the working application and test results are available in the `screenshots/` directory.

## 9. Network and Disclaimer

This project is an educational prototype tested on the Ethereum Sepolia testnet. It is not intended for handling real funds or confidential personal information.
