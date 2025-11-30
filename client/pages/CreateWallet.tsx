import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMockUser, createWallet } from "@/lib/mockApi";
import { CheckCircle, Code, Loader, AlertCircle } from "lucide-react";

interface APIResponse {
  endpoint: string;
  method: string;
  status: "pending" | "success" | "error";
  response: any;
  timestamp: string;
}

export function CreateWallet() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [apiResponses, setApiResponses] = useState<APIResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    // Auto-start wallet creation
    initializeWallet();
  }, [user, navigate]);

  const addAPIResponse = (
    endpoint: string,
    method: string,
    status: "pending" | "success" | "error",
    response: any,
  ) => {
    const newResponse: APIResponse = {
      endpoint,
      method,
      status,
      response,
      timestamp: new Date().toLocaleTimeString(),
    };
    setApiResponses((prev) => [...prev, newResponse]);
  };

  const initializeWallet = async () => {
    setLoading(true);

    // Step 1: Create Wallet
    addAPIResponse("/wallet/create", "POST", "pending", {});

    setTimeout(() => {
      const createWalletResponse = {
        result: {
          token: "TR2404781353895901",
          contractId: user.contractId,
          otp: "123456",
        },
      };

      addAPIResponse("/wallet/create", "POST", "success", createWalletResponse);

      // Step 2: Get Client Info
      setTimeout(() => {
        addAPIResponse("/wallet/clientinfo", "POST", "pending", {});

        setTimeout(() => {
          const clientInfoResponse = {
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

          addAPIResponse(
            "/wallet/clientinfo",
            "POST",
            "success",
            clientInfoResponse,
          );

          // Step 3: Get Balance
          setTimeout(() => {
            addAPIResponse("/wallet/balance", "GET", "pending", {});

            setTimeout(() => {
              const balanceResponse = {
                result: {
                  balance: [{ value: user.balance.toFixed(2) }],
                },
              };

              addAPIResponse(
                "/wallet/balance",
                "GET",
                "success",
                balanceResponse,
              );

              setLoading(false);
              setCompleted(true);
            }, 1000);
          }, 500);
        }, 1000);
      }, 500);
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creating Your CIH Smart Wallet
          </h1>
          <p className="text-gray-600">
            Initializing your account with CIH APIs...
          </p>
        </div>

        {/* Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Loader className="w-5 h-5 text-primary animate-spin" />
                  )}
                  <span className="font-semibold text-gray-900">
                    {completed ? "Wallet Ready!" : "Setting up your wallet..."}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {apiResponses.length} / 3 API calls completed
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Responses Log */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-primary" />
              <CardTitle>API Responses Log</CardTitle>
            </div>
            <CardDescription>
              Live mock API responses from CIH backend
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {apiResponses.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  Waiting for API responses...
                </p>
              ) : (
                apiResponses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      response.status === "pending"
                        ? "border-yellow-200 bg-yellow-50"
                        : response.status === "success"
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono text-sm font-bold text-gray-900">
                          {response.method} {response.endpoint}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {response.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {response.status === "pending" && (
                          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                            <Loader className="w-3 h-3 animate-spin" />
                            Pending
                          </div>
                        )}
                        {response.status === "success" && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Success
                          </div>
                        )}
                        {response.status === "error" && (
                          <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Error
                          </div>
                        )}
                      </div>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto font-mono">
                      {JSON.stringify(response.response, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">
                  {user.clientFirstName} {user.clientLastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">
                  {user.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contract ID</p>
                <p className="font-mono text-sm text-gray-900">
                  {user.contractId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Initial Balance</p>
                <p className="font-semibold text-primary">
                  {user.balance.toFixed(2)} MAD
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-green-600">✓ Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          {completed && (
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          )}
          {loading && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Setting up your wallet...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
