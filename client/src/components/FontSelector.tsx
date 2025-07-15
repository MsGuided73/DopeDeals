import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fontOptions = [
  { name: "Default (Serif)", class: "font-serif", description: "Classic serif font" },
  { name: "Orbitron", class: "font-orbitron", description: "Futuristic, sci-fi style" },
  { name: "Rajdhani", class: "font-rajdhani", description: "Modern, clean geometric" },
  { name: "Audiowide", class: "font-audiowide", description: "Bold, retro-futuristic" },
  { name: "Electrolize", class: "font-electrolize", description: "Digital, tech-inspired" },
  { name: "Russo One", class: "font-russo", description: "Strong, impactful" },
  { name: "Exo 2", class: "font-exo", description: "Contemporary, versatile" }
];

interface FontSelectorProps {
  onFontSelect: (fontClass: string) => void;
  onClose: () => void;
}

export default function FontSelector({ onFontSelect, onClose }: FontSelectorProps) {
  const [selectedFont, setSelectedFont] = useState("font-serif");

  const handleFontSelect = (fontClass: string) => {
    setSelectedFont(fontClass);
    onFontSelect(fontClass);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 bg-steel-800 border-steel-600">
        <CardHeader>
          <CardTitle className="text-yellow-400 font-bold text-xl">Choose Your Font Style</CardTitle>
          <p className="text-steel-300">Select a font for the VIP Smoke branding and yellow text elements</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {fontOptions.map((font) => (
              <div
                key={font.name}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFont === font.class
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-steel-600 hover:border-steel-500"
                }`}
                onClick={() => handleFontSelect(font.class)}
              >
                <div className="space-y-2">
                  <h3 className="text-steel-200 font-medium">{font.name}</h3>
                  <p className="text-steel-400 text-sm">{font.description}</p>
                  <div className="space-y-1">
                    <div className={`text-yellow-400 text-2xl font-bold ${font.class}`}>
                      VIP Smoke
                    </div>
                    <div className={`text-yellow-400 text-lg font-bold ${font.class}`}>
                      Premium Smoking Experience
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-steel-600 text-steel-300 hover:bg-steel-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onFontSelect(selectedFont);
                onClose();
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-steel-900 font-bold"
            >
              Apply Font
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}