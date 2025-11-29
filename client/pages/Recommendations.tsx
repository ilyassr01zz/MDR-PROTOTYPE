import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMockUser, claimRecommendation } from "@/lib/mockApi";
import {
  Gift,
  Zap,
  Code,
  Shield,
  Smartphone,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  discount: string;
  icon: React.ReactNode;
  category: string;
}

export function RecommendationsPage() {
  const navigate = useNavigate();
  const user = getMockUser();
  const [claimedOffers, setClaimedOffers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    if (user.claimedRecommendations) {
      setClaimedOffers(user.claimedRecommendations);
    }
  }, [user, navigate]);

  const handleClaimOffer = async (offerId: string) => {
    await claimRecommendation(offerId);
    setClaimedOffers((prev) => [...prev, offerId]);
    alert("Offer claimed successfully!");
  };

  const recommendations: Recommendation[] = [
    {
      id: "adobe",
      title: "Adobe Creative Suite",
      description: "40% discount for freelancers and creators",
      fullDescription:
        "Get professional creative tools at a discounted price. Perfect for designers, photographers, and video creators.",
      discount: "40%",
      icon: <Code className="w-6 h-6" />,
      category: "Software",
    },
    {
      id: "hosting",
      title: "Cloud Hosting Pro",
      description: "50% off first year of premium hosting",
      fullDescription:
        "Reliable, fast web hosting with excellent support. Ideal for businesses and personal projects.",
      discount: "50%",
      icon: <Smartphone className="w-6 h-6" />,
      category: "Technology",
    },
    {
      id: "insurance",
      title: "Digital Insurance Package",
      description: "Exclusive insurance deals for our members",
      fullDescription:
        "Comprehensive digital insurance covering cyber threats, data protection, and online security.",
      discount: "30%",
      icon: <Shield className="w-6 h-6" />,
      category: "Insurance",
    },
    {
      id: "vpn",
      title: "Premium VPN Service",
      description: "Secure your online privacy with 35% off",
      fullDescription:
        "Fast, secure VPN with military-grade encryption for complete online privacy and security.",
      discount: "35%",
      icon: <Zap className="w-6 h-6" />,
      category: "Security",
    },
    {
      id: "business",
      title: "Business Tools Bundle",
      description: "45% discount on productivity software",
      fullDescription:
        "All-in-one suite for project management, collaboration, and business automation.",
      discount: "45%",
      icon: <Briefcase className="w-6 h-6" />,
      category: "Business",
    },
    {
      id: "learning",
      title: "Online Learning Platform",
      description: "60% off annual subscription",
      fullDescription:
        "Access thousands of courses in tech, business, creative skills, and more.",
      discount: "60%",
      icon: <Gift className="w-6 h-6" />,
      category: "Education",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Gift className="w-8 h-8 mr-3 text-accent" />
            Personalized Offers For You
          </h1>
          <p className="text-gray-600">
            Exclusive deals and discounts tailored to your profile as a CIH
            Smart Wallet user
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="shadow-lg hover:shadow-xl transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    {rec.icon}
                  </div>
                  <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold">
                    {rec.discount} OFF
                  </div>
                </div>
                <CardTitle>{rec.title}</CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-1">
                  {rec.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-600 text-sm mb-6">
                  {rec.fullDescription}
                </p>

                <Button
                  className="w-full mt-auto"
                  onClick={() => handleClaimOffer(rec.id)}
                  disabled={claimedOffers.includes(rec.id)}
                  variant={
                    claimedOffers.includes(rec.id) ? "secondary" : "default"
                  }
                >
                  {claimedOffers.includes(rec.id) ? (
                    <>✓ Claimed</>
                  ) : (
                    <>
                      Claim Offer <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {claimedOffers.length > 0 && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                Your Claimed Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">
                You have claimed {claimedOffers.length} offer(s). Check your
                email for coupon codes and redemption details.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
