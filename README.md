# Web3 Simple Forum 🧵

A lightweight, decentralized forum built on Optimism and other EVM-compatible networks. Users can create posts, view discussions, and interact with content on-chain. Powered by Solidity smart contracts and a modern React + Vite + TypeScript frontend.

## 🌐 Live Demo

https://evm-app.vercel.app/

## 🚀 Features

- Create and view forum posts stored on-chain
- Connect with MetaMask or other EVM-compatible wallets
- Deployed on Optimism Testnet (and easily extendable to other EVM chains)
- Clean and fast frontend using:
  - **React**
  - **Vite**
  - **TypeScript**
  - **ethers.js**
  - **RainbowKit** / **wagmi** (if used)

## 🛠 Tech Stack

| Layer     | Stack                        |
|-----------|------------------------------|
| Frontend  | React + Vite + TypeScript    |
| Backend   | Solidity Smart Contracts     |
| Network   | Optimism Testnet             |
| Wallets   | MetaMask, WalletConnect, etc |
| Tools     | Hardhat, Ethers.js, RainbowKit |

## 📄 Smart Contract

- **Deployed Address (Optimism Testnet):**  
  `0xd891A8dA619EDcb01c6cFc5599C62A0082951212`

### Contract Functions
- `createPost(string memory content)`  
- `getPost(uint256 id)`  
- `getAllPosts()`  

Each post is stored as a struct with:
- Author address
- Timestamp
- Content

## 📦 Installation

### Prerequisites

- Node.js (v16+)
- Yarn or npm
- MetaMask or any Web3 wallet

### 1. Clone the repo

```bash
git clone https://github.com/0xfdbu/evm-app.git
cd web3-simple-forum
npm install
npm run dev
