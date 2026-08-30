/**
 * @cogniease/core - Saccadic Bionic Fixation Algorithm
 * 
 * Bolds initial characters of words to create visual fixation anchors
 * that facilitate rapid saccadic eye movements for readers with ADHD,
 * Dyslexia, and visual processing delays.
 */

/**
 * Default configuration options for Bionic Reading transformation
 */
export const DEFAULT_BIONIC_OPTIONS = {
  fixationRatio: 0.45,      // Percentage of word to bold (0.3 to 0.7)
  saccadeWeight: 'bold',    // HTML tag or class to use for fixation
  preserveHtml: true,       // Whether to skip HTML tags during processing
  minWordLength: 1,         // Minimum word length to apply fixation
  boldClass: 'bionic-fixation'
};

/**
 * Calculates the exact number of characters to bold based on word length
 * @param {number} length - Length of the word
 * @param {number} ratio - Fixation ratio (0.3 - 0.7)
 * @returns {number} Number of characters to bold
 */
export function calculateFixationLength(length, ratio = 0.45) {
  if (length <= 0) return 0;
  if (length === 1) return 1;
  if (length === 2) return 1;
  if (length === 3) return 2;
  if (length === 4) return 2;
  if (length === 5) return 3;
  if (length === 6) return 3;
  
  // For longer words, apply calibrated fixation curve
  const calculated = Math.ceil(length * ratio);
  return Math.min(Math.max(calculated, 1), length - 1);
}

/**
 * Applies saccadic fixation bolding to a single word
 * @param {string} word - The word to bionify
 * @param {Object} [options] - Configuration options
 * @returns {string} HTML string with bolded fixation prefix
 */
export function bionifyWord(word, options = {}) {
  const opts = { ...DEFAULT_BIONIC_OPTIONS, ...options };
  
  if (!word || typeof word !== 'string') return '';
  
  // Separate leading punctuation
  const leadingPunctMatch = word.match(/^[^a-zA-Z0-9\u00C0-\u024F]+/);
  const leadingPunct = leadingPunctMatch ? leadingPunctMatch[0] : '';
  const coreWithTrailing = word.slice(leadingPunct.length);
  
  // Separate trailing punctuation
  const trailingPunctMatch = coreWithTrailing.match(/[^a-zA-Z0-9\u00C0-\u024F]+$/);
  const trailingPunct = trailingPunctMatch ? trailingPunctMatch[0] : '';
  const coreWord = coreWithTrailing.slice(0, coreWithTrailing.length - trailingPunct.length);
  
  if (coreWord.length < opts.minWordLength) {
    return word;
  }
  
  const fixLen = calculateFixationLength(coreWord.length, opts.fixationRatio);
  const boldPart = coreWord.slice(0, fixLen);
  const restPart = coreWord.slice(fixLen);
  
  const boldTag = opts.saccadeWeight === 'strong' ? 'strong' : 'b';
  return `${leadingPunct}<${boldTag} class="${opts.boldClass}">${boldPart}</${boldTag}>${restPart}${trailingPunct}`;
}

/**
 * Parses text into an array of structured token objects for interactive rendering
 * and Text-to-Speech synchronization
 * @param {string} text - Raw input text
 * @param {Object} [options] - Configuration options
 * @returns {Array<Object>} Array of token objects
 */
export function parseBionicTokens(text, options = {}) {
  const opts = { ...DEFAULT_BIONIC_OPTIONS, ...options };
  if (!text || typeof text !== 'string') return [];

  const tokens = [];
  // Tokenize words, spaces, punctuation, and newlines
  const regex = /(\r\n|\n|\r)|(\s+)|([^\s\r\n]+)/g;
  let match;
  let wordIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, newline, whitespace, word] = match;

    if (newline) {
      tokens.push({
        id: `token-${tokens.length}`,
        type: 'newline',
        raw: newline
      });
    } else if (whitespace) {
      tokens.push({
        id: `token-${tokens.length}`,
        type: 'space',
        raw: whitespace
      });
    } else if (word) {
      // Check if it is an HTML tag and preserveHtml is enabled
      if (opts.preserveHtml && /^<[^>]+>$/.test(word)) {
        tokens.push({
          id: `token-${tokens.length}`,
          type: 'html',
          raw: word
        });
      } else {
        // Word token with fixation computation
        const leadingPunctMatch = word.match(/^[^a-zA-Z0-9\u00C0-\u024F]+/);
        const leadingPunct = leadingPunctMatch ? leadingPunctMatch[0] : '';
        const coreWithTrailing = word.slice(leadingPunct.length);
        
        const trailingPunctMatch = coreWithTrailing.match(/[^a-zA-Z0-9\u00C0-\u024F]+$/);
        const trailingPunct = trailingPunctMatch ? trailingPunctMatch[0] : '';
        const coreWord = coreWithTrailing.slice(0, coreWithTrailing.length - trailingPunct.length);
        
        const fixLen = coreWord.length > 0 ? calculateFixationLength(coreWord.length, opts.fixationRatio) : 0;
        const boldPart = coreWord.slice(0, fixLen);
        const restPart = coreWord.slice(fixLen);
        
        tokens.push({
          id: `token-${tokens.length}`,
          type: 'word',
          raw: word,
          cleanWord: coreWord.toLowerCase(),
          leadingPunct,
          boldPart,
          restPart,
          trailingPunct,
          wordIndex: wordIndex++
        });
      }
    }
  }

  return tokens;
}

/**
 * Transforms an entire plain text or HTML string into Bionic Reading HTML
 * @param {string} text - The input text
 * @param {Object} [options] - Configuration options
 * @returns {string} Fully formatted HTML string
 */
export function bionifyText(text, options = {}) {
  const opts = { ...DEFAULT_BIONIC_OPTIONS, ...options };
  if (!text || typeof text !== 'string') return '';

  const tokens = parseBionicTokens(text, opts);
  return tokens.map(t => {
    if (t.type === 'newline') return '<br />';
    if (t.type === 'space') return t.raw;
    if (t.type === 'html') return t.raw;
    if (t.type === 'word') {
      const boldTag = opts.saccadeWeight === 'strong' ? 'strong' : 'b';
      return `${t.leadingPunct}<${boldTag} class="${opts.boldClass}">${t.boldPart}</${boldTag}>${t.restPart}${t.trailingPunct}`;
    }
    return t.raw;
  }).join('');
}
