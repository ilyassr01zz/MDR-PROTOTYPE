import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getMockUser, clearMockUser } from "@/lib/mockApi";
import { Wallet, BookOpen, User, LogOut } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getMockUser();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearMockUser();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <span className="font-bold text-lg hidden sm:inline">
                CIH Smart Wallet
              </span>
              <span className="font-bold text-lg sm:hidden">CIH Wallet</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive("/dashboard") ? "bg-white/30" : ""
                    }`}
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden text-xs">Home</span>
                  </Button>
                </Link>

                <Link to="/modules">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive("/modules") ? "bg-white/30" : ""
                    }`}
                  >
                    <BookOpen className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Modules</span>
                  </Button>
                </Link>

                <Link to="/wallet">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive("/wallet") ? "bg-white/30" : ""
                    }`}
                  >
                    <Wallet className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Wallet</span>
                  </Button>
                </Link>

                <Link to="/recommendations">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive("/recommendations") ? "bg-white/30" : ""
                    }`}
                  >
                    <span className="hidden sm:inline">Offers</span>
                    <span className="sm:hidden text-xs">Offers</span>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-white/20 ${
                      isActive("/profile") ? "bg-white/30" : ""
                    }`}
                  >
                    <User className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
