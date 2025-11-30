export interface Transaction {
  referenceId: string;
  amount: string;
  type: string;
  date: string;
  beneficiaryFirstName: string;
  beneficiaryLastName: string;
  status: string;
  totalFrai: string;
}

export interface BalanceResponse {
  result: {
    balance: Array<{ value: string }>;
  };
}

export interface OperationsResponse {
  result: Transaction[];
}

export interface ClientInfo {
  tierId: string;
  tierFirstName: string;
  tierLastName: string;
  phoneNumber: string;
  email: string;
  products: Array<{
    contractId: string;
    name: string;
    solde: string;
  }>;
}

let mockUserData: any = null;
let mockTransactions: Transaction[] = [
  {
    referenceId: "1181798513",
    amount: "250.00",
    type: "Wallet Transfer",
    date: "2024-01-15 10:30:00",
    beneficiaryFirstName: "Ahmed",
    beneficiaryLastName: "Hassan",
    status: "Completed",
    totalFrai: "5.00",
  },
  {
    referenceId: "1792782055",
    amount: "100.00",
    type: "Cash Out",
    date: "2024-01-14 15:45:00",
    beneficiaryFirstName: "ATM",
    beneficiaryLastName: "Withdrawal",
    status: "Completed",
    totalFrai: "3.00",
  },
  {
    referenceId: "0548510077",
    amount: "500.00",
    type: "Cash In",
    date: "2024-01-13 09:20:00",
    beneficiaryFirstName: "Bank",
    beneficiaryLastName: "Deposit",
    status: "Completed",
    totalFrai: "0.00",
  },
];

export async function createWallet(userData: {
  phoneNumber: string;
  email: string;
  clientFirstName: string;
  clientLastName: string;
  legalId: string;
}) {
  mockUserData = {
    ...userData,
    contractId: "LAN" + Math.random().toString().slice(2, 20),
    token: "TR" + Math.random().toString().slice(2, 20),
    tierId: "USER_" + Date.now(),
    balance: 1500.0,
    points: 0,
  };

  localStorage.setItem("cihWalletUser", JSON.stringify(mockUserData));

  return {
    result: {
      token: mockUserData.token,
      otp: "123456",
    },
  };
}

export async function getBalance(contractId: string) {
  const user = getMockUser();
  if (!user) {
    return {
      result: {
        balance: [{ value: "0.00" }],
      },
    };
  }

  return {
    result: {
      balance: [{ value: user.balance.toFixed(2) }],
    },
  };
}

export async function getOperations(contractId: string) {
  return {
    result: mockTransactions,
  };
}

export async function getClientInfo(phoneNumber: string) {
  const user = getMockUser();
  if (!user) {
    return {
      result: {
        tierId: "USER_UNKNOWN",
        tierFirstName: "Guest",
        tierLastName: "User",
        phoneNumber,
        email: "",
        products: [],
      },
    };
  }

  return {
    result: {
      tierId: user.tierId,
      tierFirstName: user.clientFirstName,
      tierLastName: user.clientLastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      products: [
        {
          contractId: user.contractId,
          name: "CDP WALLET",
          solde: user.balance.toFixed(2),
        },
      ],
    },
  };
}

export async function cashinSimulation(data: {
  contractId: string;
  phoneNumber: string;
  amount: string;
}) {
  return {
    result: {
      token: "TOKEN_" + Math.random().toString().slice(2, 20),
      amount: data.amount,
      transactionId: Math.random().toString().slice(2, 20),
    },
  };
}

export async function cashinConfirmation(data: {
  token: string;
  amount: string;
}) {
  const user = getMockUser();
  if (user) {
    user.balance += parseFloat(data.amount);
    localStorage.setItem("cihWalletUser", JSON.stringify(user));

    const newTransaction: Transaction = {
      referenceId: Math.random().toString().slice(2, 20),
      amount: data.amount,
      type: "Cash In",
      date: new Date().toLocaleString(),
      beneficiaryFirstName: "Bank",
      beneficiaryLastName: "Transfer",
      status: "Completed",
      totalFrai: "0.00",
    };

    mockTransactions.unshift(newTransaction);
    if (mockTransactions.length > 10) {
      mockTransactions.pop();
    }
  }

  return {
    result: {
      token: data.token,
      amount: data.amount,
      transactionReference: Math.random().toString().slice(2, 20),
    },
  };
}

export async function createCihAccount(userData: {
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  const user = getMockUser();
  if (user) {
    user.cihAccount = {
      accountNumber: "CIH" + Math.random().toString().slice(2, 15),
      created: new Date().toISOString(),
    };
    localStorage.setItem("cihWalletUser", JSON.stringify(user));
  }

  return {
    result: {
      contractId: "CIH_" + Math.random().toString().slice(2, 15),
      reference: Math.random().toString().slice(2, 15),
      status: "Active",
    },
  };
}

export async function claimRecommendation(recommendationId: string) {
  const user = getMockUser();
  if (user) {
    if (!user.claimedRecommendations) {
      user.claimedRecommendations = [];
    }
    user.claimedRecommendations.push(recommendationId);
    localStorage.setItem("cihWalletUser", JSON.stringify(user));
  }

  return {
    result: {
      status: "Claimed",
      message: "Recommendation claimed successfully",
    },
  };
}

export function getMockUser() {
  if (!mockUserData) {
    const stored = localStorage.getItem("cihWalletUser");
    if (stored) {
      mockUserData = JSON.parse(stored);
    }
  }
  return mockUserData;
}

export function updateUserPoints(points: number) {
  const user = getMockUser();
  if (user) {
    user.points = (user.points || 0) + points;
    localStorage.setItem("cihWalletUser", JSON.stringify(user));
  }
  return user;
}

export function addTransaction(transaction: Transaction) {
  mockTransactions.unshift(transaction);
  if (mockTransactions.length > 10) {
    mockTransactions.pop();
  }
}

export function clearMockUser() {
  mockUserData = null;
  localStorage.removeItem("cihWalletUser");
}

export async function getBoostPoints() {
  const user = getMockUser();
  return {
    result: {
      totalPoints: user?.points || 0,
      weeklyChange: 2,
      redemptionHistory: [
        { date: "2024-01-10", points: 50, action: "Claimed offer" },
        { date: "2024-01-05", points: 100, action: "Completed module" },
      ],
    },
  };
}

export async function getInvoicesList() {
  return {
    result: {
      total: 12,
      paid: 8,
      unpaid: 4,
      invoices: [
        {
          id: "INV-001",
          amount: 1500,
          status: "paid",
          date: "2024-01-15",
        },
        {
          id: "INV-002",
          amount: 2300,
          status: "unpaid",
          date: "2024-01-14",
        },
        {
          id: "INV-003",
          amount: 800,
          status: "paid",
          date: "2024-01-13",
        },
        {
          id: "INV-004",
          amount: 1200,
          status: "unpaid",
          date: "2024-01-12",
        },
      ],
    },
  };
}

export async function getDRSScore() {
  return {
    result: {
      score: 78,
      trend: "up",
      weeklyChange: 2,
      components: {
        transactionHistory: 85,
        accountAge: 75,
        paymentReliability: 72,
      },
    },
  };
}

export async function getInventoryList() {
  return {
    result: {
      totalItems: 156,
      lowStockAlerts: 3,
      totalValue: 45230.5,
      items: [
        {
          id: "ITM-001",
          name: "Haircut Service",
          quantity: 250,
          status: "stock",
        },
        {
          id: "ITM-002",
          name: "Delivery Service",
          quantity: 15,
          status: "lowstock",
        },
        {
          id: "ITM-003",
          name: "Cleaning Service",
          quantity: 8,
          status: "lowstock",
        },
        {
          id: "ITM-004",
          name: "Box of Pastries",
          quantity: 45,
          status: "stock",
        },
        {
          id: "ITM-005",
          name: "Repair Service",
          quantity: 2,
          status: "critical",
        },
      ],
    },
  };
}
