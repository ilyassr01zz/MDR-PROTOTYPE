import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  updateUserPoints,
  createCihAccount,
  claimRecommendation,
  Transaction,
} from "@/lib/mockApi";
import {
  Wallet,
  TrendingUp,
  BookOpen,
  Gift,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Award,
  AlertCircle,
  Zap,
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  points: number;
  completed: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  discount: string;
  icon: React.ReactNode;
  claimed: boolean;
}

export function Dashboard() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [balance, setBalance] = useState<string>("0.00");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedOffers, setClaimedOffers] = useState<string[]>([]);

  const modules: Module[] = [
    {
      id: "budgeting",
      title: "Personal Budgeting 101",
      description:
        "Learn how to create and manage your monthly budget effectively",
      icon: <CreditCard className="w-6 h-6" />,
      progress: 65,
      points: 100,
      completed: false,
    },
    {
      id: "saving",
      title: "Smart Saving Strategies",
      description: "Discover proven methods to save money and build wealth",
      icon: <TrendingUp className="w-6 h-6" />,
      progress: 40,
      points: 150,
      completed: false,
    },
    {
      id: "investing",
      title: "Investment Fundamentals",
      description:
        "Introduction to investing and growing your financial future",
      icon: <Award className="w-6 h-6" />,
      progress: 20,
      points: 200,
      completed: false,
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: "adobe",
      title: "Adobe Creative Suite",
      description: "40% discount for freelancers and creators",
      discount: "40%",
      icon: <Zap className="w-6 h-6" />,
      claimed: claimedOffers.includes("adobe"),
    },
    {
      id: "hosting",
      title: "Cloud Hosting Pro",
      description: "50% off first year of premium hosting",
      discount: "50%",
      icon: <Zap className="w-6 h-6" />,
      claimed: claimedOffers.includes("hosting"),
    },
    {
      id: "insurance",
      title: "Digital Insurance Package",
      description: "Exclusive insurance deals for our members",
      discount: "30%",
      icon: <Zap className="w-6 h-6" />,
      claimed: claimedOffers.includes("insurance"),
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    const loadData = async () => {
      try {
        const balanceData = await getBalance(user.contractId);
        const operationsData = await getOperations(user.contractId);

        setBalance(balanceData.result.balance[0].value);
        setTransactions(operationsData.result.slice(0, 3));

        if (user.claimedRecommendations) {
          setClaimedOffers(user.claimedRecommendations);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleClaimOffer = async (offerId: string) => {
    await claimRecommendation(offerId);
    setClaimedOffers((prev) => [...prev, offerId]);
  };

  const handleCreateCihAccount = async () => {
    if (user) {
      try {
        await createCihAccount({
          phoneNumber: user.phoneNumber,
          email: user.email,
          firstName: user.clientFirstName,
          lastName: user.clientLastName,
        });
        alert("CIH Account created successfully!");
      } catch (error) {
        console.error("Error creating CIH account:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.clientFirstName}!
              </h1>
              <p className="text-white/90">
                Complete your financial literacy modules to earn points
                redeemable in your CIH account.
              </p>
            </div>
            <Users className="w-12 h-12 text-white/20 hidden sm:block" />
          </div>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Wallet Balance</CardTitle>
                  <CardDescription>Your current balance</CardDescription>
                </div>
                <Wallet className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">
                {balance} MAD
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Refresh Balance
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Loyalty Points</CardTitle>
                  <CardDescription>Points earned from modules</CardDescription>
                </div>
                <Award className="w-8 h-8 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent mb-4">
                {user?.points || 0}
              </div>
              <p className="text-sm text-gray-600">
                Redeem points in your CIH account for rewards
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your last 3 transactions</CardDescription>
              </div>
              <Link to="/wallet">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.referenceId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {transaction.type.includes("In") ||
                        transaction.type.includes("Transfer") ? (
                          <ArrowDownLeft className="w-5 h-5 text-primary" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">
                      +{transaction.amount} MAD
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No transactions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Literacy Modules */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-primary" />
            Financial Literacy Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {module.icon}
                    </div>
                    {module.completed && (
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Completed
                      </div>
                    )}
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {module.progress}%
                      </span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>{module.points} points</strong> when completed
                    </p>
                  </div>

                  <Link to={`/module/${module.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Start Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Gift className="w-6 h-6 mr-3 text-accent" />
            Personalized Offers For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      {rec.icon}
                    </div>
                    <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold">
                      {rec.discount} OFF
                    </div>
                  </div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleClaimOffer(rec.id)}
                    disabled={rec.claimed}
                    variant={rec.claimed ? "secondary" : "default"}
                  >
                    {rec.claimed ? "Claimed ✓" : "Claim Offer"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CIH Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-primary" />
            CIH Services & Loans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Check Eligibility</CardTitle>
                <CardDescription>Microloan eligibility check</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Check Microloan
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Open CIH Account</CardTitle>
                <CardDescription>Create a CIH bank account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCreateCihAccount}
                >
                  Open Account
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Make Deposit</CardTitle>
                <CardDescription>Add funds to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/wallet">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Make Deposit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
