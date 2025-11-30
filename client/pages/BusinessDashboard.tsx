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
import { Progress } from "@/components/ui/progress";
import {
  getMockUser,
  getBalance,
  getOperations,
  getClientInfo,
  getBoostPoints,
  getInvoicesList,
  getDRSScore,
  getInventoryList,
  Transaction,
} from "@/lib/mockApi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Zap,
  Package,
  FileText,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  Plus,
  Download,
  Eye,
} from "lucide-react";

interface ChartDataPoint {
  date: string;
  revenue: number;
}

interface BestSellingItem {
  item: string;
  sales: number;
}

export function BusinessDashboard() {
  const navigate = useNavigate();
  const user = getMockUser();

  const [balance, setBalance] = useState<string>("0.00");
  const [availableBalance, setAvailableBalance] = useState<string>("0.00");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [revenues, setRevenues] = useState<string>("0.00");
  const [expenses, setExpenses] = useState<string>("0.00");
  const [boostPoints, setBoostPoints] = useState<number>(0);
  const [drsScore, setDrsScore] = useState<number>(0);
  const [drsScoreTrend, setDrsScoreTrend] = useState<number>(0);
  const [invoiceData, setInvoiceData] = useState<{
    total: number;
    paid: number;
    unpaid: number;
  }>({ total: 0, paid: 0, unpaid: 0 });
  const [inventoryData, setInventoryData] = useState<{
    totalItems: number;
    lowStockAlerts: number;
    totalValue: number;
  }>({ totalItems: 0, lowStockAlerts: 0, totalValue: 0 });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const bestSellingItems: BestSellingItem[] = [
    { item: "Haircut", sales: 48 },
    { item: "Delivery Service", sales: 33 },
    { item: "Cleaning Service", sales: 27 },
    { item: "Box of Pastries", sales: 19 },
    { item: "Repair Service", sales: 12 },
  ];

  const assets = {
    cash: parseFloat(balance),
    inventory: inventoryData.totalValue,
    receivables: 0,
  };

  const liabilities = {
    outstandingDues: 2500,
    paymentObligations: 1800,
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    const loadData = async () => {
      try {
        // Fetch balance
        const balanceData = await getBalance(user.contractId);
        const balanceValue = balanceData.result.balance[0].value;
        setBalance(balanceValue);
        setAvailableBalance(balanceValue);

        // Fetch client info
        const clientData = await getClientInfo(user.phoneNumber);
        const firstName = clientData.result.tierFirstName;
        const lastName = clientData.result.tierLastName;
        setClientName(`${firstName} ${lastName}`);
        setClientEmail(clientData.result.email);

        // Fetch operations and calculate revenues/expenses
        const operationsData = await getOperations(user.contractId);
        const transactions: Transaction[] = operationsData.result;

        const now = new Date();
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        );

        const dailyData: { [key: string]: number } = {};
        let totalRevenue = 0;
        let totalExpense = 0;

        transactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= thirtyDaysAgo) {
            const amount = parseFloat(transaction.amount);

            if (
              transaction.type.includes("In") ||
              transaction.type.includes("Transfer") ||
              transaction.type.includes("Deposit")
            ) {
              totalRevenue += amount;
              const dateKey = transactionDate.toISOString().split("T")[0];
              dailyData[dateKey] = (dailyData[dateKey] || 0) + amount;
            } else {
              totalExpense += amount;
            }
          }
        });

        setRevenues(totalRevenue.toFixed(2));
        setExpenses(totalExpense.toFixed(2));

        // Create chart data
        const chartPoints: ChartDataPoint[] = Object.entries(dailyData)
          .map(([date, revenue]) => ({ date, revenue }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .slice(-30);
        setChartData(chartPoints);

        // Fetch boost points
        const boostData = await getBoostPoints();
        setBoostPoints(boostData.result.totalPoints);

        // Fetch DRS score
        const drsData = await getDRSScore();
        setDrsScore(drsData.result.score);
        setDrsScoreTrend(drsData.result.weeklyChange);

        // Fetch invoices
        const invoicesData = await getInvoicesList();
        setInvoiceData({
          total: invoicesData.result.total,
          paid: invoicesData.result.paid,
          unpaid: invoicesData.result.unpaid,
        });

        // Fetch inventory
        const inventoryData = await getInventoryList();
        setInventoryData({
          totalItems: inventoryData.result.totalItems,
          lowStockAlerts: inventoryData.result.lowStockAlerts,
          totalValue: inventoryData.result.totalValue,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const getDRSColor = (score: number) => {
    if (score > 70) return "text-green-600 bg-green-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getDRSBgColor = (score: number) => {
    if (score > 70) return "bg-green-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  const maxSales = Math.max(...bestSellingItems.map((item) => item.sales));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">
            Loading your business dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION 1: Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Business Dashboard
              </h1>
              <p className="text-white/90 mb-4">
                Your business performance at a glance
              </p>
              <div className="space-y-2 text-white/80 text-sm">
                <p className="font-medium">
                  👤 Wallet Holder:{" "}
                  <span className="font-semibold">{clientName}</span>
                </p>
                <p>📧 Email: {clientEmail}</p>
                <p>📅 Today: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-5xl font-bold text-white/20">📊</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Financial Snapshot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Balance Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-2">
                {balance} MAD
              </div>
              <p className="text-xs text-gray-600">
                Available: {availableBalance} MAD
              </p>
            </CardContent>
          </Card>

          {/* Revenues Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Revenues (30d)
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                +{revenues} MAD
              </div>
              <p className="text-xs text-gray-600">Last 30 days</p>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Expenses (30d)
                </CardTitle>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 mb-2">
                -{expenses} MAD
              </div>
              <p className="text-xs text-gray-600">Last 30 days</p>
            </CardContent>
          </Card>

          {/* Boost Points Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Boost Points
                </CardTitle>
                <Zap className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent mb-2">
                {boostPoints}
              </div>
              <p className="text-xs text-gray-600">Redeem for rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 3: Sales Trends Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>
                  Daily revenue for the last 30 days
                </CardDescription>
              </div>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => `${value.toFixed(2)} MAD`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#005293"
                      dot={{ fill: "#005293", r: 4 }}
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  💡 Data auto-generated from the last 30 days of wallet
                  activity
                </p>
              </div>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-600">
                <p>No transaction data available for the last 30 days</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 4: Best-Selling Items */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Best-Selling Items</CardTitle>
                <CardDescription>
                  Top 5 products/services by sales
                </CardDescription>
              </div>
              <BarChart className="w-6 h-6 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestSellingItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {index + 1}. {item.item}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {item.sales} sold
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{ width: `${(item.sales / maxSales) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: Mini Balance Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">💰 Cash</span>
                <span className="font-semibold text-gray-900">
                  {parseFloat(balance).toFixed(2)} MAD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  📦 Inventory Value
                </span>
                <span className="font-semibold text-gray-900">
                  {inventoryData.totalValue.toFixed(2)} MAD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  📋 Receivables (Unpaid Invoices)
                </span>
                <span className="font-semibold text-gray-900">
                  {(invoiceData.unpaid * 250).toFixed(2)} MAD
                </span>
              </div>
              <div className="pt-4 border-t-2 border-green-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Total Assets</span>
                <span className="text-lg font-bold text-green-600">
                  {(
                    parseFloat(balance) +
                    inventoryData.totalValue +
                    invoiceData.unpaid * 250
                  ).toFixed(2)}{" "}
                  MAD
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  💳 Outstanding Dues
                </span>
                <span className="font-semibold text-gray-900">
                  {liabilities.outstandingDues.toFixed(2)} MAD
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  📅 Payment Obligations
                </span>
                <span className="font-semibold text-gray-900">
                  {liabilities.paymentObligations.toFixed(2)} MAD
                </span>
              </div>
              <div className="pt-4 border-t-2 border-red-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  Total Liabilities
                </span>
                <span className="text-lg font-bold text-red-600">
                  {(
                    liabilities.outstandingDues + liabilities.paymentObligations
                  ).toFixed(2)}{" "}
                  MAD
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 6: Invoice Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Invoice Summary
                </CardTitle>
                <CardDescription>Your invoicing overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {invoiceData.total}
                </div>
                <p className="text-sm text-gray-600 mt-2">Total Invoices</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {invoiceData.paid}
                </div>
                <p className="text-sm text-gray-600 mt-2">Paid</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {invoiceData.unpaid}
                </div>
                <p className="text-sm text-gray-600 mt-2">Unpaid</p>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              View All Invoices
            </Button>
          </CardContent>
        </Card>

        {/* SECTION 7: Digital Reliability Score (DRS) */}
        <Card className={`shadow-lg ${getDRSColor(drsScore)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Digital Reliability Score
                </CardTitle>
                <CardDescription>Your DRS rating</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-5xl font-bold ${getDRSColor(drsScore)}`}>
                  {drsScore}
                </div>
                <p className={`text-sm mt-2 ${getDRSColor(drsScore)}`}>
                  {drsScoreTrend > 0 ? "📈" : "📉"} {Math.abs(drsScoreTrend)}{" "}
                  this week
                </p>
              </div>
              <div
                className={`w-32 h-32 rounded-full ${getDRSBgColor(
                  drsScore,
                )} flex items-center justify-center`}
              >
                <div className="text-center">
                  <p className="text-xs text-gray-700">Score Range</p>
                  <p className="font-semibold text-gray-900">
                    {drsScore > 70
                      ? "Excellent"
                      : drsScore >= 40
                        ? "Good"
                        : "Needs Work"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 8: Inventory Overview */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Inventory Overview
                </CardTitle>
                <CardDescription>Stock management summary</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <div className="text-3xl font-bold text-primary">
                  {inventoryData.totalItems}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
                <div className="text-3xl font-bold text-yellow-600">
                  {inventoryData.lowStockAlerts}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Inventory Value</p>
                <div className="text-3xl font-bold text-green-600">
                  {inventoryData.totalValue.toFixed(0)} MAD
                </div>
              </div>
            </div>
            {inventoryData.lowStockAlerts > 0 && (
              <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800">
                  ⚠️ {inventoryData.lowStockAlerts} items are running low on
                  stock
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 9: Quick Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 h-auto py-6 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Invoice</span>
          </Button>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 h-auto py-6 flex flex-col items-center justify-center gap-2"
          >
            <TrendingDown className="w-5 h-5" />
            <span>Record Expense</span>
          </Button>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 h-auto py-6 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Inventory Item</span>
          </Button>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 h-auto py-6 flex flex-col items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Statement</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
