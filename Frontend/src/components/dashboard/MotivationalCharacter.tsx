import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCharacterMessage, type CharacterContext, type Sentiment } from '@/lib/character-messages';

import friendlyPos from '@/assets/Friendly_Pos.png';
import friendlyNeg from '@/assets/Friendly_Neg.png';
import sarcasticPos from '@/assets/Sarcastic_Pos.png';
import sarcasticNeg from '@/assets/Sarcastic_Neg.jpg';
import aggressive from '@/assets/Aggressive.jpg';

const mascotImages: Record<string, string> = {
  'friendly-positive': friendlyPos,
  'friendly-negative': friendlyNeg,
  'sarcastic-positive': sarcasticPos,
  'sarcastic-negative': sarcasticNeg,
  'aggressive-positive': aggressive,
  'aggressive-negative': aggressive,
};

function getMascotImage(mode: string, sentiment: Sentiment): string {
  return mascotImages[`${mode}-${sentiment}`] || friendlyPos;
}

interface MotivationalCharacterProps {
  reactionMode: 'friendly' | 'sarcastic' | 'aggressive';
  stats: CharacterContext;
}

export const MotivationalCharacter = ({ reactionMode, stats }: MotivationalCharacterProps) => {
  const [result, setResult] = useState(() => getCharacterMessage(reactionMode, stats));

  useEffect(() => {
    setResult(getCharacterMessage(reactionMode, stats));
    const interval = setInterval(() => {
      setResult(getCharacterMessage(reactionMode, stats));
    }, 25000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionMode, stats.completionRate, stats.overdueTasks, stats.streak, stats.isOnBreak, stats.totalTasks]);

  const currentImage = getMascotImage(reactionMode, result.sentiment);

  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center gap-4">
      {/* Character avatar */}
      <motion.div
        className="w-20 h-20 rounded-full overflow-hidden glass-subtle ring-2 ring-primary/30"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Productivity Mascot"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result.message}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="glass-subtle rounded-xl p-3 text-sm text-center leading-relaxed relative"
        >
          {/* Speech bubble arrow */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 glass-subtle"
            style={{ borderBottom: 'none', borderRight: 'none' }}
          />
          <span className="relative z-10">{result.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
