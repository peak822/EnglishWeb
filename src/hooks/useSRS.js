import { useState, useEffect, useCallback } from 'react';

export const useSRS = () => {
  const [srsData, setSrsData] = useState(() => {
    const saved = localStorage.getItem('english_study_srs');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('english_study_srs', JSON.stringify(srsData));
  }, [srsData]);

  // quality: 0 (blackout), 1 (wrong), 2 (wrong, easy), 3 (hard), 4 (good), 5 (easy)
  const reviewWord = useCallback((wordId, quality) => {
    setSrsData(prev => {
      const current = prev[wordId] || { interval: 0, ease: 2.5, repetitions: 0 };
      
      let { interval, ease, repetitions } = current;

      if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * ease);
        }
        repetitions += 1;
      } else {
        // Incorrect response
        repetitions = 0;
        interval = 1;
      }

      // Update ease factor (EF)
      ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (ease < 1.3) ease = 1.3;

      // Calculate next review date (midnight of the target day)
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      nextReview.setHours(0, 0, 0, 0);

      return {
        ...prev,
        [wordId]: {
          interval,
          ease,
          repetitions,
          nextReview: nextReview.getTime()
        }
      };
    });
  }, []);

  const getDueWords = useCallback((allWords, limit = 20) => {
    const now = new Date().getTime();
    
    // First, get words that are explicitly due for review
    const dueList = [];
    const newWordsList = [];

    allWords.forEach(word => {
      const data = srsData[word.id];
      if (data) {
        if (data.nextReview <= now) {
          dueList.push(word);
        }
      } else {
        newWordsList.push(word);
      }
    });

    // If we have fewer due words than limit, fill with new words
    let reviewSession = [...dueList];
    if (reviewSession.length < limit) {
      const needed = limit - reviewSession.length;
      reviewSession = [
        ...reviewSession, 
        ...newWordsList.slice(0, needed) // Just take the first N new words (A1 first usually)
      ];
    }

    return reviewSession.slice(0, limit);
  }, [srsData]);

  const getStats = useCallback(() => {
    const totalReviewed = Object.keys(srsData).length;
    let matureCards = 0; // interval > 21 days
    let learningCards = 0;

    Object.values(srsData).forEach(item => {
      if (item.interval > 21) matureCards++;
      else learningCards++;
    });

    return { totalReviewed, matureCards, learningCards };
  }, [srsData]);

  return {
    srsData,
    reviewWord,
    getDueWords,
    getStats
  };
};
