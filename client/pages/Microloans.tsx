import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getMockUser } from "@/lib/mockApi";
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface LoanApplication {
  id: string;
  amount: number;
  duration: number;
  status: "approved" | "pending" | "rejected";
  appliedDate: string;
  monthlyPayment: number;
  interestRate: number;
}

export function Microloans() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("12");
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [eligibilityScore, setEligibilityScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    // Calculate eligibility score based on user data
    calculateEligibility();
    // Load mock applications
    loadApplications();
  }, [user, navigate]);

  const calculateEligibility = () => {
    if (!user) return;
    let score = 50;
    if (user.balance > 500) score += 15;
    if (user.points > 50) score += 20;
    if (user.email && user.phoneNumber) score += 15;
    setEligibilityScore(Math.min(score, 100));
  };

  const loadApplications = () => {
    const stored = localStorage.getItem("microloanApplications");
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  };

  const handleApplyForLoan = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert("Please enter a valid loan amount");
      return;
    }

    if (eligibilityScore < 40) {
      alert("Your eligibility score is too low. Please improve your account activity first.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const interestRate = 8.5;
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = parseInt(loanDuration);
      const monthlyPayment =
        (parseFloat(loanAmount) * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

      const newApplication: LoanApplication = {
        id: "LOAN_" + Date.now(),
        amount: parseFloat(loanAmount),
        duration: numPayments,
        status: eligibilityScore >= 70 ? "approved" : "pending",
        appliedDate: new Date().toLocaleDateString(),
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        interestRate,
      };

      const updatedApplications = [newApplication, ...applications];
      setApplications(updatedApplications);
      localStorage.setItem("microloanApplications", JSON.stringify(updatedApplications));

      setLoanAmount("");
      setLoanDuration("12");
      setShowApplicationForm(false);
      setLoading(false);

      alert(
        `Loan application submitted! Status: ${newApplication.status === "approved" ? "✓ APPROVED" : "⏳ PENDING REVIEW"}`
      );
    }, 1500);
  };

  if (!user) {
    return null;
  }

  const maxLoanAmount = Math.min(user.balance * 5, 50000);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-primary" />
            CIH Microloans
          </h1>
          <p className="text-gray-600">
            Access quick loans tailored to your financial profile
          </p>
        </div>

        {/* Eligibility Score */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Your Eligibility Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">{eligibilityScore}/100</span>
                <span className="text-sm text-gray-600">
                  {eligibilityScore >= 70
                    ? "Excellent"
                    : eligibilityScore >= 50
                      ? "Good"
                      : "Fair"}
                </span>
              </div>
              <Progress value={eligibilityScore} className="h-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs font-medium text-gray-600">Current Balance</p>
                <p className="font-bold text-gray-900">{user.balance?.toFixed(2) || "0.00"} MAD</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs font-medium text-gray-600">Loyalty Points</p>
                <p className="font-bold text-gray-900">{user.points || 0}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs font-medium text-gray-600">Max Loan Available</p>
                <p className="font-bold text-primary">{maxLoanAmount.toFixed(2)} MAD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Application Form */}
        {!showApplicationForm ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Apply for a Microloan</CardTitle>
              <CardDescription>
                Fast, flexible microloans designed for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="font-semibold text-blue-900">Fast Approval</p>
                  <p className="text-sm text-blue-700">Within 2-4 hours</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                  <p className="font-semibold text-green-900">Flexible Terms</p>
                  <p className="text-sm text-green-700">6-36 month plans</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="font-semibold text-purple-900">Low Rates</p>
                  <p className="text-sm text-purple-700">Starting at 8.5% APR</p>
                </div>
              </div>

              <Button
                onClick={() => setShowApplicationForm(true)}
                className="w-full bg-primary hover:bg-primary/90 py-6"
                size="lg"
              >
                Start Loan Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Loan Application Form</CardTitle>
              <CardDescription>
                Fill in your loan requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loanAmount">Loan Amount (MAD)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="500"
                  max={maxLoanAmount}
                  className="mt-2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Maximum available: {maxLoanAmount.toFixed(2)} MAD
                </p>
              </div>

              <div>
                <Label htmlFor="duration">Loan Duration (months)</Label>
                <select
                  id="duration"
                  value={loanDuration}
                  onChange={(e) => setLoanDuration(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>

              {loanAmount && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                  <h4 className="font-semibold text-gray-900">Loan Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{parseFloat(loanAmount).toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">8.5% per annum</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium text-primary">
                      {(
                        (parseFloat(loanAmount) *
                          (0.085 / 12) *
                          Math.pow(1 + 0.085 / 12, parseInt(loanDuration))) /
                        (Math.pow(1 + 0.085 / 12, parseInt(loanDuration)) - 1)
                      ).toFixed(2)) || "0.00"} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Repayment:</span>
                    <span className="font-medium">
                      {(
                        (parseFloat(loanAmount) *
                          (0.085 / 12) *
                          Math.pow(1 + 0.085 / 12, parseInt(loanDuration))) /
                          (Math.pow(1 + 0.085 / 12, parseInt(loanDuration)) - 1) *
                        parseInt(loanDuration)
                      ).toFixed(2)) || "0.00"} MAD
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowApplicationForm(false);
                    setLoanAmount("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyForLoan}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? "Processing..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Applications */}
        {applications.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Your Loan Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {app.amount.toFixed(2)} MAD
                        </p>
                        <p className="text-sm text-gray-600">
                          {app.duration} months • Applied {app.appliedDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {app.status === "approved" && (
                          <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Approved</span>
                          </div>
                        )}
                        {app.status === "pending" && (
                          <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-semibold">Pending</span>
                          </div>
                        )}
                        {app.status === "rejected" && (
                          <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-3 py-1 rounded-full">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-600">Monthly Payment</p>
                        <p className="font-semibold text-gray-900">{app.monthlyPayment.toFixed(2)} MAD</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{app.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Loan ID</p>
                        <p className="font-semibold text-gray-900 text-sm">{app.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="shadow-lg bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How CIH Microloans Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-800">
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold">Apply</p>
                <p className="text-sm">Fill out the simple application form with your desired loan amount</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold">Get Approved</p>
                <p className="text-sm">Receive instant or fast approval based on your eligibility score</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold">Receive Funds</p>
                <p className="text-sm">Funds are transferred directly to your CIH Smart Wallet</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-semibold">Repay Flexibly</p>
                <p className="text-sm">Choose your repayment schedule from 6 to 36 months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}