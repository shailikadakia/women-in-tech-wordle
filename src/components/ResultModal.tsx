import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import type { WomanInTech } from "../data/women-in-tech";
import { ExternalLink, Sparkles } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  woman: WomanInTech;
  won: boolean;
  guessCount: number;
}

export function ResultModal({ isOpen, onClose, woman, won, guessCount }: ResultModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {won ? `🎉 Congratulations! You won in ${guessCount} guess${guessCount !== 1 ? 'es' : ''}!` : '💪 Nice try!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            Today's woman in tech: <span className="font-semibold">{woman.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Bio Section */}
          <div>
            <h3 className="mb-2 text-gray-700">Biography</h3>
            <p className="text-gray-600">{woman.bio}</p>
          </div>

          {/* Fun Fact Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="mb-1 text-gray-900">Fun Fact</h3>
                <p className="text-gray-700">{woman.funFact}</p>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          {woman.quote && (
            <div className="border-l-4 border-[#6aaa64] pl-4 py-2">
              <p className="italic text-gray-700">"{woman.quote}"</p>
              <p className="text-gray-500 mt-1">— {woman.name}</p>
            </div>
          )}

          {/* Read More Link */}
          <div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(woman.link, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Read More About {woman.name.split(' ')[0]}
            </Button>
          </div>

          {/* Share Section */}
          <div className="text-center pt-4 border-t">
            <p className="text-gray-500">Come back tomorrow to learn about another inspiring woman in tech!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
