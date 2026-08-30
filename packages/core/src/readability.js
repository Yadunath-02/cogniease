/**
 * @cogniease/core - Linguistic Readability Analysis Engine
 * 
 * Computes real-time reading metrics including Flesch Reading Ease,
 * Flesch-Kincaid Grade Level, Gunning Fog Index, Coleman-Liau Index,
 * syllable counts, and neurodivergent cognitive load assessments.
 */

/**
 * Counts syllables in an English word using heuristic phonetic rules
 * @param {string} word 
 * @returns {number} Estimated syllable count
 */
export function countSyllables(word) {
  if (!word || typeof word !== 'string') return 0;
  
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length === 0) return 0;
  if (clean.length <= 3) return 1;

  // Handle special suffixes & prefixes
  let processed = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');

  // Match vowel groups (a, e, i, o, u, y)
  const matches = processed.match(/[aeiouy]{1,2}/g);
  const count = matches ? matches.length : 1;

  return Math.max(1, count);
}

/**
 * Parses sentences from raw text
 * @param {string} text 
 * @returns {string[]} Array of sentences
 */
export function extractSentences(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(/[^.!?\n\r]+[.!?\n\r]*/g);
  if (!matches) return text.trim().length > 0 ? [text.trim()] : [];
  return matches.map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Parses words from raw text
 * @param {string} text 
 * @returns {string[]} Array of words
 */
export function extractWords(text) {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(/[a-zA-Z0-9\u00C0-\u024F]+(?:'[a-zA-Z0-9]+)?/g);
  return matches || [];
}

/**
 * Analyzes text and returns complete linguistic readability metrics
 * @param {string} text 
 * @param {Object} [options]
 * @returns {Object} Comprehensive readability scorecard
 */
export function analyzeReadability(text, options = {}) {
  const { readingSpeedWPM = 180 } = options;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      wordCount: 0,
      sentenceCount: 0,
      characterCount: 0,
      letterCount: 0,
      syllableCount: 0,
      complexWordCount: 0,
      complexWordPercentage: 0,
      averageWordsPerSentence: 0,
      averageSyllablesPerWord: 0,
      fleschReadingEase: 100,
      fleschKincaidGrade: 0,
      gunningFog: 0,
      colemanLiau: 0,
      readingTimeMinutes: 0,
      difficultyRating: 'N/A',
      difficultyLevel: 'none',
      badgeColor: 'neutral'
    };
  }

  const sentences = extractSentences(text);
  const words = extractWords(text);

  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = Math.max(1, words.length);
  const characterCount = text.length;
  const letterCount = words.reduce((acc, w) => acc + w.length, 0);

  let totalSyllables = 0;
  let complexWordCount = 0;

  for (let i = 0; i < words.length; i++) {
    const syl = countSyllables(words[i]);
    totalSyllables += syl;
    if (syl >= 3) {
      complexWordCount++;
    }
  }

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;
  const complexWordPct = (complexWordCount / wordCount) * 100;

  // 1. Flesch Reading Ease Formula (0 - 100, higher is easier)
  // Score = 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const rawFlesch = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  const fleschReadingEase = Math.min(100, Math.max(0, Math.round(rawFlesch * 10) / 10));

  // 2. Flesch-Kincaid Grade Level Formula
  // Grade = (0.39 * ASL) + (11.8 * ASW) - 15.59
  const rawFK = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
  const fleschKincaidGrade = Math.max(0, Math.round(rawFK * 10) / 10);

  // 3. Gunning Fog Index
  // Fog = 0.4 * ( (words / sentences) + 100 * (complexWords / words) )
  const rawFog = 0.4 * (avgWordsPerSentence + complexWordPct);
  const gunningFog = Math.max(0, Math.round(rawFog * 10) / 10);

  // 4. Coleman-Liau Index
  // CLI = 0.0588 * L - 0.296 * S - 15.8 (L = letters per 100 words, S = sentences per 100 words)
  const L = (letterCount / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const rawCLI = (0.0588 * L) - (0.296 * S) - 15.8;
  const colemanLiau = Math.max(0, Math.round(rawCLI * 10) / 10);

  // Difficulty categorization
  let difficultyRating = 'Standard';
  let difficultyLevel = 'moderate';
  let badgeColor = 'amber';

  if (fleschReadingEase >= 80) {
    difficultyRating = 'Very Easy / Elementary (Grade 5-6)';
    difficultyLevel = 'easy';
    badgeColor = 'emerald';
  } else if (fleschReadingEase >= 70) {
    difficultyRating = 'Plain English (Grade 7-8)';
    difficultyLevel = 'accessible';
    badgeColor = 'green';
  } else if (fleschReadingEase >= 60) {
    difficultyRating = 'Standard Reading (Grade 8-9)';
    difficultyLevel = 'moderate';
    badgeColor = 'blue';
  } else if (fleschReadingEase >= 50) {
    difficultyRating = 'Fairly Difficult (High School)';
    difficultyLevel = 'elevated';
    badgeColor = 'amber';
  } else if (fleschReadingEase >= 30) {
    difficultyRating = 'Difficult (College Level)';
    difficultyLevel = 'difficult';
    badgeColor = 'orange';
  } else {
    difficultyRating = 'Very Difficult / Academic Jargon';
    difficultyLevel = 'extreme';
    badgeColor = 'rose';
  }

  const readingTimeMinutes = Math.max(0.1, Math.round((wordCount / readingSpeedWPM) * 10) / 10);

  return {
    wordCount,
    sentenceCount,
    characterCount,
    letterCount,
    syllableCount: totalSyllables,
    complexWordCount,
    complexWordPercentage: Math.round(complexWordPct * 10) / 10,
    averageWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    averageSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    fleschReadingEase,
    fleschKincaidGrade,
    gunningFog,
    colemanLiau,
    readingTimeMinutes,
    difficultyRating,
    difficultyLevel,
    badgeColor
  };
}
