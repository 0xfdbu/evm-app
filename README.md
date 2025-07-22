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
  - **wagmi**

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

## 📘 Contract Functions

### 📝 Public Write Functions
- `createPost(string _title, string _content)`
  - Creates a new post with title and content.
- `addComment(uint256 _postId, string _content)`
  - Adds a comment to a specific post.

### 📖 Public Read/View Functions
- `getPost(uint256 _postId) → Post`
  - Returns full details of a single post.
- `getPostCount() → uint256`
  - Returns the total number of posts.
- `getComments(uint256 _postId) → Comment[]`
  - Returns all comments for a given post.
- `getCommentsPaginated(uint256 _postId, uint256 offset, uint256 limit) → Comment[]`
  - Returns a paginated list of comments for a given post.
- `getPostsPaginated(uint256 offset, uint256 limit) → Post[]`
  - Returns a paginated list of posts.
- `searchPosts(string query, uint256 maxResults) → Post[]`
  - Returns posts matching a query (basic placeholder, not functional on-chain).

### 🧾 Public State Variables (Getters)
- `posts(uint256) → Post`
  - Mapping of post ID to post struct.
- `comments(uint256, uint256) → Comment`
  - Nested mapping of post ID and comment index to comment struct.


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
