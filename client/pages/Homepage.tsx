import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, BookOpen, Gift, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

export function Homepage() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Smart Financial Companion by CIH
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Learn, Save, and Grow Your Money Smarter with our innovative wallet platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-16">
              <div>
                <div className="text-3xl sm:text-4xl font-bold">10K+</div>
                <p className="text-white/80 mt-2">Active Users</p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold">$50M+</div>
                <p className="text-white/80 mt-2">Transactions</p>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold">98%</div>
                <p className="text-white/80 mt-2">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CIH Smart Wallet?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of financial management with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Wallet & CIH Banking Integration */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Wallet & CIH Banking Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Seamlessly manage your funds with integrated CIH banking services. Fast, secure, and reliable transactions at your fingertips.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2: Personalized Recommendations */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Personalized Product Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get tailored offers and discounts based on your profile. From Adobe subscriptions for freelancers to exclusive deals just for you.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: Gamified Learning */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Gamified Financial Literacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learn personal finance through engaging modules. Earn points, complete challenges, and redeem rewards in your CIH account.
                </p>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Secure & Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bank-level security with encryption and fraud protection. Your financial data is always protected.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get detailed analytics and insights about your spending patterns and financial health.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join thousands of users learning and growing together. Share tips and get expert advice anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of users who are already managing their money smarter
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start Your Journey Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">CIH Smart Wallet</h3>
              <p className="text-sm">Your trusted financial companion for smart money management.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2024 CIH Smart Wallet. All rights reserved. Powered by CIH Bank.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
