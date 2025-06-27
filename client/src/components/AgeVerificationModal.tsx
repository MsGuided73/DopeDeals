import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown } from "lucide-react";
import { isValidAge } from "@/lib/utils";

interface AgeVerificationModalProps {
  onVerification: (verified: boolean) => void;
}

export default function AgeVerificationModal({ onVerification }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState("");

  const handleVerifyAge = () => {
    if (!birthDate) {
      alert("Please enter your date of birth.");
      return;
    }

    const dob = new Date(birthDate);
    const isValid = isValidAge(dob, 21);
    
    if (isValid) {
      onVerification(true);
    } else {
      alert("You must be 21 or older to access VIP Smoke.");
    }
  };

  const handleExit = () => {
    onVerification(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-steel-800 p-8 rounded-lg max-w-md mx-4 text-center border border-steel-700">
        {/* Crown Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto gold-gradient rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-steel-900" />
          </div>
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-yellow-400 mb-4">
          Age Verification Required
        </h2>
        
        <p className="text-steel-300 mb-6">
          You must be 21 or older to access VIP Smoke. Please verify your age to continue.
        </p>
        
        <div className="mb-6">
          <label className="block text-steel-300 mb-2">Date of Birth</label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-steel-700 border-steel-600 text-white"
          />
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={handleVerifyAge}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Verify Age
          </Button>
          <Button
            onClick={handleExit}
            variant="outline"
            className="flex-1 bg-steel-700 hover:bg-steel-600 text-white border-steel-600 font-semibold"
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
