import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMockUser, clearMockUser } from "@/lib/mockApi";
import { User, Mail, Phone, MapPin, Award, LogOut, Edit } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const user = getMockUser();

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    clearMockUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="shadow-lg mb-8 bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user.clientFirstName} {user.clientLastName}
                  </h1>
                  <p className="text-white/80">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-900">
                        {user.clientFirstName} {user.clientLastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{user.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-600">National ID</p>
                      <p className="font-semibold text-gray-900">{user.legalId}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your wallet account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">Contract ID</p>
                  <p className="font-mono text-blue-800">{user.contractId}</p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-900 mb-2">Tier ID</p>
                  <p className="font-mono text-purple-800">{user.tierId}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-2">Account Status</p>
                    <p className="font-semibold text-green-800">✓ Active</p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Account Type</p>
                    <p className="font-semibold text-gray-900">Individual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Active Sessions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Loyalty Points</p>
                  <p className="text-3xl font-bold text-accent">{user.points || 0}</p>
                </div>

                <hr className="my-4" />

                <div>
                  <p className="text-sm text-gray-600 mb-1">Modules Completed</p>
                  <p className="text-3xl font-bold text-primary">0</p>
                </div>

                <hr className="my-4" />

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-3xl font-bold text-primary">3</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View Wallet
                </Button>
                <Button variant="outline" className="w-full">
                  Download Statement
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
