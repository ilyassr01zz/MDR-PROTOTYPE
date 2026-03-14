## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Architecture](#api-architecture)
- [Wallet APIs Implemented](#wallet-apis-implemented)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)][(https://your-new-name.netlify.app)](https://mdr-bank-prototype.netlify.app/)

The *MDR Prototype* allows users to:

- Create a digital wallet  
- Log in and manage their profile  
- View balance and transaction history  
- Perform Cash IN / Cash OUT operations  
- Send Wallet-to-Wallet transfers  
- Simulate wire transfers  
- Simulate ATM withdrawals  
- Access financial literacy modules and quizzes  
- Receive personalized offers  

Everything uses mocked endpoints designed to mimic a real banking API.

---

## Features

### User & Wallet
- User Registration (Name, Phone, CIN)
- Mock wallet creation
- Client information page

### Wallet Operations
- Cash IN (simulated deposit)  
- Cash OUT (init + confirm flow)  
- Wallet → Wallet transfers  
- Wire transfers (IBAN or account number)  
- ATM withdrawals (OTP-style flow)  
- Balance consultation  
- Full transaction history  

### Financial Literacy
- Modules  
- Quizzes  
- Rewards (mocked)  

### Offers & Recommendations
Personalized suggestions based on:
- Profession  
- Spending habits  
- Wallet activity  

---

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | Builder.io (React-based) |
| Backend | Node.js + JSON Server (Mock API) |
| Data Format | JSON |
| Version Control | Git + GitHub |
| Deployment | Builder.io Preview / GitHub Pages |

---

## API Architecture

The platform respects modern wallet management kit standards:

- RESTful JSON APIs  
- Mock Bearer token authentication  
- /wallet/ prefix for customer operations  
- /transfer/ prefix for bank transfers  
- /atm/ prefix for withdrawals  
- Proper HTTP status codes  

---

## Wallet APIs Implemented

### 1. Create Wallet
POST /wallet/create


### 2. Customer Information


GET /wallet/clientinfo/:walletId


### 3. Transaction History


GET /wallet/transactions/:walletId


### 4. Balance Consultation


GET /wallet/balance/:walletId


### 5. Cash IN


POST /wallet/cash-in


### 6. Cash OUT
Init:


POST /wallet/cash-out/init

Confirm:


POST /wallet/cash-out/confirm


### 7. Wallet to Wallet Transfer


POST /wallet/transfer/w2w


### 8. Wire Transfer (Virement)
Init:


POST /transfer/virement/init

Confirm:


POST /transfer/virement/confirm


### 9. ATM Withdrawal
Init:


POST /atm/withdraw/init

Confirm:


POST /atm/withdraw/confirm


---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/MDR-Prototype.git
cd MDR-Prototype

2. Install Dependencies
npm install

3. Start Mock API Server
npm run api

4. Run Frontend
npm run dev

Usage

Register / Log in

Create a wallet

Perform wallet operations

View balances and transactions
