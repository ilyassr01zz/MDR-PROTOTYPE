import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getMockUser } from "@/lib/mockApi";
import { BookOpen, CreditCard, TrendingUp, Award, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  points: number;
}

export function ModulesList() {
  const navigate = useNavigate();
  const user = getMockUser();

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  const modules: Module[] = [
    {
      id: "budgeting",
      title: "Personal Budgeting 101",
      description: "Learn how to create and manage your monthly budget effectively",
      icon: <CreditCard className="w-6 h-6" />,
      progress: 65,
      points: 100,
    },
    {
      id: "saving",
      title: "Smart Saving Strategies",
      description: "Discover proven methods to save money and build wealth",
      icon: <TrendingUp className="w-6 h-6" />,
      progress: 40,
      points: 150,
    },
    {
      id: "investing",
      title: "Investment Fundamentals",
      description: "Introduction to investing and growing your financial future",
      icon: <Award className="w-6 h-6" />,
      progress: 20,
      points: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-primary" />
            Financial Literacy Modules
          </h1>
          <p className="text-gray-600">
            Learn essential financial skills and earn loyalty points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {module.icon}
                  </div>
                </div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>

                <div className="p-3 bg-accent/10 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>{module.points} points</strong> when completed
                  </p>
                </div>

                <Button
                  onClick={() => navigate(`/module/${module.id}`)}
                  className="w-full bg-primary hover:bg-primary/90 mt-auto"
                >
                  Start Module <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
