import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VoiceAgent } from "@/components/VoiceAgent";
import { updateUserPoints, getMockUser } from "@/lib/mockApi";
import { CheckCircle, BookOpen, Award } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface ModuleContent {
  title: string;
  description: string;
  content: string;
  points: number;
  quiz: Question[];
}

const moduleData: Record<string, ModuleContent> = {
  budgeting: {
    title: "Personal Budgeting 101",
    description:
      "Learn how to create and manage your monthly budget effectively",
    content: `
      <h2>Understanding the 50/30/20 Budget Rule</h2>
      <p>The 50/30/20 rule is a simple budgeting method that divides your income into three categories:</p>
      <ul>
        <li><strong>50% for Needs:</strong> Essential expenses like rent, utilities, groceries, and transportation</li>
        <li><strong>30% for Wants:</strong> Non-essential expenses like entertainment, dining out, and hobbies</li>
        <li><strong>20% for Savings:</strong> Emergency fund, investments, and debt repayment</li>
      </ul>
      <p>This framework helps you maintain a balanced approach to personal finance and ensures you're saving for the future while enjoying the present.</p>
      
      <h2>Steps to Create Your Budget</h2>
      <ol>
        <li>Calculate your monthly income</li>
        <li>List all your expenses</li>
        <li>Categorize expenses into needs, wants, and savings</li>
        <li>Adjust as needed to fit the 50/30/20 ratio</li>
        <li>Track your spending monthly</li>
      </ol>
      
      <h2>Key Benefits of Budgeting</h2>
      <ul>
        <li>Control over your spending</li>
        <li>Reduced financial stress</li>
        <li>Better ability to save for goals</li>
        <li>Less reliance on debt</li>
        <li>Increased financial awareness</li>
      </ul>
    `,
    points: 100,
    quiz: [
      {
        id: "q1",
        text: "According to the 50/30/20 rule, what percentage of income should go to savings?",
        options: ["20%", "30%", "50%", "40%"],
        correctAnswer: 0,
      },
      {
        id: "q2",
        text: "Which category includes essential expenses like rent and groceries?",
        options: ["Wants", "Needs", "Savings", "Investments"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        text: "What is the first step in creating a personal budget?",
        options: [
          "List all expenses",
          "Calculate monthly income",
          "Buy budgeting software",
          "Consult a financial advisor",
        ],
        correctAnswer: 1,
      },
    ],
  },
  saving: {
    title: "Smart Saving Strategies",
    description: "Discover proven methods to save money and build wealth",
    content: `
      <h2>The Power of Compound Interest</h2>
      <p>Compound interest is the interest earned on both your initial investment and the accumulated interest. It's a powerful tool for building wealth over time.</p>
      
      <h2>Automatic Savings Methods</h2>
      <ul>
        <li><strong>Automatic Transfers:</strong> Set up automatic monthly transfers to a savings account</li>
        <li><strong>Pay Yourself First:</strong> Treat savings like a mandatory bill</li>
        <li><strong>High-Yield Savings:</strong> Look for accounts with better interest rates</li>
        <li><strong>Emergency Fund:</strong> Aim for 3-6 months of living expenses</li>
      </ul>
      
      <h2>Saving Goals Framework</h2>
      <p>Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound</p>
      <ul>
        <li>Short-term (1 year): Vacation, new gadget</li>
        <li>Medium-term (2-5 years): Car, wedding</li>
        <li>Long-term (5+ years): House, retirement</li>
      </ul>
      
      <h2>Common Savings Mistakes to Avoid</h2>
      <ul>
        <li>Not having a clear savings goal</li>
        <li>Spending your savings on impulse purchases</li>
        <li>Ignoring high-interest debt</li>
        <li>Not adjusting savings as income changes</li>
      </ul>
    `,
    points: 150,
    quiz: [
      {
        id: "q1",
        text: "What is compound interest?",
        options: [
          "Simple interest on your principal",
          "Interest earned on your principal and accumulated interest",
          "Interest paid by the bank to you",
          "Fee charged by banks",
        ],
        correctAnswer: 1,
      },
      {
        id: "q2",
        text: "How many months of living expenses should an emergency fund cover?",
        options: ["1-2 months", "3-6 months", "6-12 months", "12-24 months"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        text: "What does SMART goal stand for?",
        options: [
          "Simple, Measurable, Achievable, Realistic, Timely",
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Strategic, Monetary, Active, Resource, Training",
          "Savings, Money, Accounts, Returns, Time",
        ],
        correctAnswer: 1,
      },
    ],
  },
  investing: {
    title: "Investment Fundamentals",
    description: "Introduction to investing and growing your financial future",
    content: `
      <h2>Why Invest?</h2>
      <p>Investing helps you grow your wealth beyond saving alone. Through investing, you can:</p>
      <ul>
        <li>Build long-term wealth</li>
        <li>Beat inflation</li>
        <li>Generate passive income</li>
        <li>Achieve financial goals faster</li>
      </ul>
      
      <h2>Types of Investments</h2>
      <ul>
        <li><strong>Stocks:</strong> Ownership shares in companies</li>
        <li><strong>Bonds:</strong> Loans to governments or corporations</li>
        <li><strong>Mutual Funds:</strong> Diversified portfolio managed by professionals</li>
        <li><strong>ETFs:</strong> Exchange-traded funds with lower fees</li>
        <li><strong>Real Estate:</strong> Property investment for long-term growth</li>
      </ul>
      
      <h2>Risk vs. Reward</h2>
      <p>Higher potential returns come with higher risk. Consider your risk tolerance and investment timeline.</p>
      
      <h2>Getting Started</h2>
      <ol>
        <li>Build an emergency fund first</li>
        <li>Start with low-cost index funds</li>
        <li>Diversify your portfolio</li>
        <li>Invest regularly (dollar-cost averaging)</li>
        <li>Think long-term</li>
      </ol>
    `,
    points: 200,
    quiz: [
      {
        id: "q1",
        text: "What is the primary benefit of investing?",
        options: [
          "Quick money",
          "No risk",
          "Growing wealth and beating inflation",
          "Monthly income",
        ],
        correctAnswer: 2,
      },
      {
        id: "q2",
        text: "Which investment type represents ownership in a company?",
        options: ["Bonds", "Stocks", "Mutual Funds", "Savings Account"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        text: "What is dollar-cost averaging?",
        options: [
          "Buying low and selling high",
          "Investing a fixed amount regularly",
          "Converting dollars to another currency",
          "Calculating investment costs",
        ],
        correctAnswer: 1,
      },
    ],
  },
};

export function Module() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"content" | "quiz" | "results">("content");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);

  if (!moduleId || !moduleData[moduleId]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Module Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The module you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const module = moduleData[moduleId];

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;

    module.quiz.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    updateUserPoints(module.points);
    setStage("results");
  };

  const isQuizComplete = Object.keys(answers).length === module.quiz.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
          </div>
          <p className="text-gray-600">{module.description}</p>
        </div>

        {stage === "content" && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Module Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm sm:prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: module.content
                    .replace(
                      /<h2>/g,
                      '<h2 className="text-xl font-bold mt-6 mb-3 text-gray-900">',
                    )
                    .replace(
                      /<h2 className="[^"]*">/g,
                      '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900">',
                    )
                    .replace(/<p>/g, '<p class="mb-3 text-gray-700">')
                    .replace(
                      /<ul>/g,
                      '<ul class="list-disc list-inside mb-4 text-gray-700">',
                    )
                    .replace(
                      /<ol>/g,
                      '<ol class="list-decimal list-inside mb-4 text-gray-700">',
                    )
                    .replace(/<li>/g, '<li class="mb-2">'),
                }}
              />

              {/* Voice Agent */}
              <div className="mt-8">
                <VoiceAgent
                  content={module.title}
                  moduleTitle={module.title}
                />
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 font-medium">
                  📚 Complete the quiz to earn {module.points} points!
                </p>
              </div>

              <Button
                onClick={() => setStage("quiz")}
                className="w-full mt-6 bg-primary hover:bg-primary/90"
              >
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {stage === "quiz" && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Module Quiz</CardTitle>
              <CardDescription>
                Answer all questions correctly to earn your points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {module.quiz.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-6 border-b last:border-b-0"
                >
                  <p className="font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.text}
                  </p>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={answers[question.id] === optionIndex}
                          onChange={() =>
                            handleQuizAnswer(question.id, optionIndex)
                          }
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <Button
                  onClick={() => setStage("content")}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Content
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={!isQuizComplete}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Submit Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {stage === "results" && (
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="text-5xl font-bold text-primary mb-4">
                  {score}/{module.quiz.length}
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  Questions Answered Correctly
                </p>
                {score === module.quiz.length && (
                  <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Perfect Score!</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-2">
                  🎉 +{module.points} Points Earned!
                </p>
                <p className="text-blue-800 text-sm">
                  You've earned {module.points} loyalty points that can be
                  redeemed in your CIH account.
                </p>
              </div>

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
