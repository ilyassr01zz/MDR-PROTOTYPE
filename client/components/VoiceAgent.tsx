import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Pause, Play, Globe } from "lucide-react";

interface VoiceAgentProps {
  content: string;
  moduleTitle: string;
}

type Language = "ar" | "fr" | "darija" | "amazigh";

interface LanguageOption {
  code: Language;
  label: string;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: "ar", label: "العربية", name: "Arabic", nativeName: "العربية" },
  { code: "fr", label: "Français", name: "French", nativeName: "Français" },
  {
    code: "darija",
    label: "الدارجة المغربية",
    name: "Darija",
    nativeName: "الدارجة",
  },
  {
    code: "amazigh",
    label: "ⴰⵎⴰⵣⵉⵖ",
    name: "Amazigh",
    nativeName: "Tamazight",
  },
];

// Mock translations for content
const getTranslatedContent = (
  originalContent: string,
  language: Language
): string => {
  const translations: Record<Language, Record<string, string>> = {
    ar: {
      "Personal Budgeting 101": "إدارة الموازنة الشخصية 101",
      "Understanding the 50/30/20 Budget Rule":
        "فهم قاعدة الميزانية 50/30/20",
      "50% for Needs": "50٪ للاحتياجات الأساسية",
      "30% for Wants": "30٪ للرغبات",
      "20% for Savings": "20٪ للادخار",
    },
    fr: {
      "Personal Budgeting 101": "Budget Personnel 101",
      "Understanding the 50/30/20 Budget Rule":
        "Comprendre la règle budgétaire 50/30/20",
      "50% for Needs": "50% pour les besoins essentiels",
      "30% for Wants": "30% pour les envies",
      "20% for Savings": "20% pour l'épargne",
    },
    darija: {
      "Personal Budgeting 101": "صرفية الدارجة 101",
      "Understanding the 50/30/20 Budget Rule":
        "فهم قاعدة 50/30/20 ديال الصرفية",
      "50% for Needs": "50٪ ديال الحاجات",
      "30% for Wants": "30٪ ديال الرغبات",
      "20% for Savings": "20٪ للادخار",
    },
    amazigh: {
      "Personal Budgeting 101": "Tasarumit 101",
      "Understanding the 50/30/20 Budget Rule": "Tigzi n usarumit 50/30/20",
      "50% for Needs": "50٪ i tignatin",
      "30% for Wants": "30٪ i tusirin",
      "20% for Savings": "20٪ i ukayaz",
    },
  };

  return translations[language]?.[originalContent] || originalContent;
};

export function VoiceAgent({ content, moduleTitle }: VoiceAgentProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("ar");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const languageMap: Record<Language, string> = {
    ar: "ar-SA",
    fr: "fr-FR",
    darija: "ar-MA", // Moroccan Arabic for Darija
    amazigh: "ar-MA", // Use Moroccan Arabic as closest match
  };

  const handleSpeak = () => {
    // Cancel any ongoing speech
    if (currentUtterance) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
      return;
    }

    // Check if speech synthesis is available
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis not supported in your browser");
      return;
    }

    const translatedContent = getTranslatedContent(content, selectedLanguage);

    const utterance = new SpeechSynthesisUtterance(translatedContent);
    utterance.lang = languageMap[selectedLanguage];
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-primary" />
          <span>AI Voice Agent - Learn by Listening</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Selection */}
        <div>
          <label className="flex items-center space-x-2 font-semibold text-gray-900 mb-3">
            <Globe className="w-4 h-4 text-primary" />
            Choose Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  if (isPlaying) {
                    speechSynthesis.cancel();
                    setIsPlaying(false);
                    setCurrentUtterance(null);
                  }
                  setSelectedLanguage(lang.code);
                }}
                className={`p-3 rounded-lg font-medium text-sm transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-900 border border-gray-200 hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div className="text-xs opacity-75">{lang.nativeName}</div>
                <div>{lang.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            {languages.find((l) => l.code === selectedLanguage)?.name} Voice
            Learning
          </p>

          <Button
            onClick={handleSpeak}
            className={`w-full py-6 text-lg font-semibold ${
              isPlaying
                ? "bg-accent hover:bg-accent/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Listen to Module
              </>
            )}
          </Button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Click the button to listen to the module
            content in your chosen language. This feature helps learners who
            prefer audio or need accessibility support.
          </p>
        </div>

        {/* Browser Compatibility Note */}
        {!("speechSynthesis" in window) && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              ⚠️ <strong>Note:</strong> Voice features require a modern browser
              that supports Web Speech API (Chrome, Edge, Firefox, Safari).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
