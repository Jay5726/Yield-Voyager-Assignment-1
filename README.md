# Web3 Social Graph (MVP)

A decentralized-hybrid social network application where users log in using their Ethereum Wallet (MetaMask) instead of traditional email/password credentials. The application creates a real-time social graph, allowing users to discover other wallets and manage friend connections via a secure request system.

## Project Overview

This project demonstrates the integration of **Web3 Authentication** with **Web2 Cloud Storage**. It serves as a Minimum Viable Product (MVP) for a decentralized social directory.

**Key Features:**

- **No Passwords:** Authentication via MetaMask (Ethers.js).
- **Real-time Database:** Instant updates using Firebase Firestore.
- **Social Graph:** Mutual friend connections stored on the cloud.

## Tech Stack

- **Frontend Library:** React.js (Create React App)
- **Language:** JavaScript (ES6+, Async/Await)
- **Blockchain Integration:** Ethers.js (v6)
- **Authentication:** MetaMask (Injected Web3 Provider)
- **Database:** Firebase Firestore (NoSQL)
- **Version Control:** Git & GitHub

---

## Features & Implementation Details

### 1. Decentralized Authentication (Login)

- **Logic:** The app bypasses traditional backend auth servers. It interacts directly with the window.ethereum object injected by MetaMask.
- **Identifier:** The user's public wallet address (e.g., `0x123...`) is used as the unique Primary Key (Document ID) in the database.

### 2. User Directory

- Fetches the `users` collection from Firestore.
- Filters the UI to distinguish between "You" (the logged-in user) and "Others."

### 3. Friend Request System (Logic Improvement)

- **Initial State (Bug/Alpha):** Originally, clicking "Add Friend" instantly added the user to the friend list (unilateral connection).
- **Current State (Fixed/Final):** Implemented a full 3-step handshake protocol to ensure mutual consent:
  1.  **Send:** User A clicks "Add Friend" → Adds User A's ID to User B's `incomingRequests` array.
  2.  **Pending:** User B sees the request in the "Requests" tab.
  3.  **Accept:** User B clicks "Accept" → Atomic transaction runs to:
      - Add User A to User B's friend list.
      - Add User B to User A's friend list.

### 4. Profile Management

- Displays the user's connected wallet address.
- Renders a dynamic list of confirmed friends.

---

## Database Structure (NoSQL)

The data is stored in a single Firestore collection named `users`.

**Schema Example:**

```json
"0xWalletAddress123": {
  "wallet": "0xWalletAddress123",
  "friends": ["0xWalletAddress456", "0xWalletAddress789"],
  "incomingRequests": ["0xWalletAddress999"]
}
```
