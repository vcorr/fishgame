import React, { useState, useEffect } from 'react';

// --- Import Fish Images ---
import Ahven from './assets/Ahven.webp';
import Hauki from './assets/Hauki.webp';
import Kiiski from './assets/Kiiski.webp';
import Kolmipiikki from './assets/Kolmipiikki.webp';
import Kuha from './assets/Kuha.webp';
import Kuore from './assets/Kuore.webp';
import Lahna from './assets/lahna.webp'; // Assuming lowercase is okay
import Muikku from './assets/Muikku.webp';
import Pasuri from './assets/pasuri.webp'; // Assuming lowercase is okay
import Ruutana from './assets/Ruutana.webp';
import Salakka from './assets/Salakka1.webp'; // Using Salakka1 for Salakka
import Siika from './assets/siika.webp'; // Assuming lowercase is okay
// Note: Add other fish images if needed

import styles from './FishGuessingGame.module.css';

// --- Constants ---
const POINTS_CORRECT = 10;
const POINTS_INCORRECT = -10;
const FEEDBACK_DURATION_MS = 3000;
const NEXT_FISH_DELAY_MS = 250;

// --- Types ---
interface FishData {
  name: string;
  image: string; // Path to the image
}

// Add type for feedback item
interface FeedbackItem {
  id: number;
  message: string;
  type: 'correct' | 'incorrect';
}

// --- Helper Function ---
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- Fish Data ---
const allFishData: FishData[] = [
  { name: 'Ahven', image: Ahven },
  { name: 'Hauki', image: Hauki },
  { name: 'Kiiski', image: Kiiski },
  { name: 'Kolmipiikki', image: Kolmipiikki },
  { name: 'Kuha', image: Kuha },
  { name: 'Kuore', image: Kuore },
  { name: 'Lahna', image: Lahna },
  { name: 'Muikku', image: Muikku },
  { name: 'Pasuri', image: Pasuri },
  { name: 'Ruutana', image: Ruutana },
  { name: 'Salakka', image: Salakka }, // Assuming Salakka1.webp maps to Salakka
  { name: 'Siika', image: Siika },
];

const FishGuessingGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentFish, setCurrentFish] = useState<FishData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [remainingFish, setRemainingFish] = useState<FishData[]>(() => shuffleArray([...allFishData])); // Initialize with shuffled copy
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]); // New state for feedback items
  const [isGuessingAllowed, setIsGuessingAllowed] = useState<boolean>(true);

  // --- Game Logic Functions ---
  const loadNextFish = (explicitList?: FishData[]) => {
    setIsGuessingAllowed(false);

    let fishToLoad: FishData | undefined;
    let listToUse: FishData[];

    if (explicitList) {
      // Initial load or restart
      if (explicitList.length === 0) {
        console.error("Attempted to load fish from empty explicit list.");
        setIsGameOver(true);
        return;
      }
      listToUse = explicitList;
      fishToLoad = listToUse[0];
      // Set remaining fish state correctly for subsequent rounds
      setRemainingFish(listToUse.slice(1)); 
    } else {
      // Normal game progression
      if (remainingFish.length === 0) {
        setIsGameOver(true);
        return; // Stop if no fish are left
      }
      listToUse = remainingFish;
      fishToLoad = listToUse[0];
      // Update the remaining fish list for the *next* round
      setRemainingFish((prev) => prev.slice(1)); 
    }
    
    setCurrentFish(fishToLoad);

    // Generate options (using allFishData for variety)
    const otherFishNames = allFishData
      .filter((fish) => fish.name !== fishToLoad!.name) // Use non-null assertion as fishToLoad is guaranteed
      .map((fish) => fish.name);
    const shuffledOtherNames = shuffleArray(otherFishNames);
    const incorrectOptions = shuffledOtherNames.slice(0, 2);

    const allOptions = shuffleArray([...incorrectOptions, fishToLoad!.name]);
    setOptions(allOptions);

    setIsGuessingAllowed(true);
  };

  const handleGuess = (selectedOption: string) => {
    if (!isGuessingAllowed || !currentFish) return;

    setIsGuessingAllowed(false);

    const feedbackId = Date.now();
    let newFeedbackItem: FeedbackItem;

    if (selectedOption === currentFish.name) {
      setScore((prevScore) => prevScore + POINTS_CORRECT);
      newFeedbackItem = { id: feedbackId, message: 'Oikein!', type: 'correct' };
    } else {
      setScore((prevScore) => prevScore - POINTS_INCORRECT);
      const correctAnswer = currentFish.name;
      newFeedbackItem = { id: feedbackId, message: `Väärin! Oikea vastaus: ${correctAnswer}`, type: 'incorrect' };
    }
    
    setFeedbackItems(prev => [...prev, newFeedbackItem]);

    setTimeout(() => {
      setFeedbackItems(prev => prev.filter(item => item.id !== feedbackId));
    }, FEEDBACK_DURATION_MS); // Use constant

    setTimeout(() => {
       loadNextFish(); 
    }, NEXT_FISH_DELAY_MS); // Use constant
  };

  const restartGame = () => {
    setScore(0);
    const newShuffledList = shuffleArray([...allFishData]);
    setRemainingFish(newShuffledList);
    setIsGameOver(false);
    setFeedbackItems([]); // Clear all feedback on restart
    setIsGuessingAllowed(true);
    loadNextFish(newShuffledList);
  };

  // --- Effect for Initial Load ---
  useEffect(() => {
    const initialList = shuffleArray([...allFishData]);
    setRemainingFish(initialList); // Set initial state for remaining fish
    loadNextFish(initialList); // Load the very first fish using the list
  }, []); 

  // --- Render ---
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Arvaa kala!</h2> 
      </header>

      {isGameOver ? (
        <main className={`${styles.content} ${styles.gameOverContent}`}>
          <h3>Valmista!</h3>
          <p className={styles.finalScore}>Lopulliset pisteet: {score}</p>
          <button 
            className={`${styles.optionButton} ${styles.restartButton}`}
            onClick={restartGame} 
          >
            Pelaa uudelleen
          </button>
        </main>
      ) : currentFish ? (
        <>
          <main className={styles.content}>
            <img 
              src={currentFish.image} 
              alt={`Arvaa kala`} 
              className={styles.fishImage} 
            />
            <div className={styles.optionsContainer}>
              {options.map((option) => (
                <button 
                  key={option} 
                  className={styles.optionButton} 
                  onClick={() => handleGuess(option)}
                  disabled={!isGuessingAllowed} 
                >
                  {option}
                </button>
              ))}
            </div>
            
            {/* Render list of feedback items */}
            <div className={styles.feedbackContainer}> {/* Optional container for spacing */}
              {feedbackItems.map((item) => {
                const itemStyle = `${styles.feedback} ${item.type === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect}`;
                return (
                  <div key={item.id} className={itemStyle}>
                    {item.message}
                  </div>
                );
              })}
            </div>
          </main>
          <footer className={styles.footer}>
            <p className={styles.scoreText}>Pisteet: {score}</p>
          </footer>
        </>
      ) : (
        <main className={styles.content}>
           <div>Ladataan peliä...</div>
        </main>
      )}
    </div>
  );
};

export default FishGuessingGame; 