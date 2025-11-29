import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getMockUser,
  getBalance,
  getOperations,
  cashinSimulation,
  cashinConfirmation,
  Transaction,
} from "@/lib/mockApi";
import {
  RefreshCw,
  Plus,
  TrendingUp,
  Calendar,
  MoreVertical,
} from "lucide-react";

export function WalletPage() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [balance, setBalance] = useState<string>("0.00");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const balanceData = await getBalance(user.contractId);
      const operationsData = await getOperations(user.contractId);

      setBalance(balanceData.result.balance[0].value);
      setTransactions(operationsData.result);
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      setRefreshing(true);
      const balanceData = await getBalance(user.contractId);
      setBalance(balanceData.result.balance[0].value);
    } catch (error) {
      console.error("Error refreshing balance:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const simulation = await cashinSimulation({
        contractId: user.contractId,
        phoneNumber: user.phoneNumber,
        amount: depositAmount,
      });

      const confirmation = await cashinConfirmation({
        token: simulation.result.token,
        amount: depositAmount,
      });

      setDepositAmount("");
      setDepositModal(false);
      alert("Deposit successful!");
      await loadData();
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert("Error processing deposit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">
            Manage your funds and view transaction history
          </p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Current Balance</CardTitle>
                <CardDescription className="text-white/80">
                  Your wallet balance
                </CardDescription>
              </div>
              <TrendingUp className="w-8 h-8 text-white/30" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-6">{balance} MAD</div>
            <div className="flex gap-4">
              <Button
                onClick={handleRefreshBalance}
                disabled={refreshing}
                className="bg-white text-primary hover:bg-gray-100 flex-1"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh Balance
              </Button>
              <Button
                onClick={() => setDepositModal(true)}
                className="bg-white text-primary hover:bg-gray-100 flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Modal */}
        {depositModal && (
          <Card className="shadow-lg bg-white border-2 border-primary">
            <CardHeader>
              <CardTitle>Add Funds to Your Wallet</CardTitle>
              <CardDescription>
                Enter the amount you want to deposit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (MAD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setDepositModal(false);
                    setDepositAmount("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Confirm Deposit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    All your wallet transactions
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">
                      Recipient
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Fees
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction.referenceId}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {transaction.beneficiaryFirstName}{" "}
                          {transaction.beneficiaryLastName}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                          {transaction.amount} MAD
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {transaction.totalFrai} MAD
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.status === "Completed"
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-gray-600"
                      >
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {transactions.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/5"
                >
                  Load More Transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>
                Transfer funds to another wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Send Transfer
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Request Money</CardTitle>
              <CardDescription>Request funds from someone else</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-accent hover:bg-accent/90">
                Create Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
