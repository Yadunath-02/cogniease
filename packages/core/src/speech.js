/**
 * @cogniease/core - Web Speech API Speech Synthesis Engine
 * 
 * Provides robust Text-to-Speech playback with word-by-word karaoke boundary
 * tracking, sentence chunking (preventing Chromium 15-second speech dropouts),
 * and pitch/rate/voice controls.
 */

export class SpeechEngine {
  constructor(options = {}) {
    this.options = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voiceURI: null,
      lang: 'en-US',
      ...options
    };

    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.synth = this.isSupported ? window.speechSynthesis : null;
    this.utterance = null;
    this.voices = [];
    this.state = 'stopped'; // 'playing' | 'paused' | 'stopped'
    this.currentText = '';
    this.sentences = [];
    this.currentSentenceIndex = 0;
    this.globalWordIndex = 0;
    this.sentenceWordOffsets = [];
    
    // Callbacks
    this.onWordBoundary = null;
    this.onSentenceChange = null;
    this.onStateChange = null;
    this.onEnd = null;
    this.onError = null;

    if (this.isSupported) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.isSupported) return [];
    this.voices = this.synth.getVoices();
    return this.voices;
  }

  getVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  /**
   * Chunks text into sentence segments to bypass Chromium audio dropouts
   * @param {string} text 
   * @returns {Array<{text: string, startWordIndex: number, wordCount: number}>}
   */
  prepareSentences(text) {
    if (!text) return [];
    
    // Split into sentences while keeping punctuation
    const rawSentences = text.match(/[^.!?\n\r]+[.!?\n\r]*/g) || [text];
    let runningWordCount = 0;
    const prepared = [];

    for (let i = 0; i < rawSentences.length; i++) {
      const sentenceText = rawSentences[i].trim();
      if (!sentenceText) continue;

      const wordsInSentence = (sentenceText.match(/[^\s]+/g) || []).length;
      prepared.push({
        text: sentenceText,
        startWordIndex: runningWordCount,
        wordCount: wordsInSentence
      });
      runningWordCount += wordsInSentence;
    }

    return prepared;
  }

  /**
   * Starts speaking text from the beginning or specified sentence
   * @param {string} text 
   * @param {Object} [overrideOpts] 
   */
  speak(text, overrideOpts = {}) {
    if (!this.isSupported) {
      if (this.onError) this.onError(new Error('Web Speech API is not supported in this browser.'));
      return;
    }

    this.stop();
    this.currentText = text;
    this.sentences = this.prepareSentences(text);
    this.currentSentenceIndex = 0;
    this.globalWordIndex = 0;

    if (this.sentences.length === 0) return;

    const opts = { ...this.options, ...overrideOpts };
    this._speakSentence(0, opts);
  }

  _speakSentence(index, opts) {
    if (index >= this.sentences.length) {
      this.state = 'stopped';
      if (this.onStateChange) this.onStateChange(this.state);
      if (this.onEnd) this.onEnd();
      return;
    }

    this.currentSentenceIndex = index;
    const currentSegment = this.sentences[index];

    if (this.onSentenceChange) {
      this.onSentenceChange({
        sentenceIndex: index,
        totalSentences: this.sentences.length,
        segment: currentSegment
      });
    }

    this.utterance = new SpeechSynthesisUtterance(currentSegment.text);
    this.utterance.rate = opts.rate || this.options.rate;
    this.utterance.pitch = opts.pitch || this.options.pitch;
    this.utterance.volume = opts.volume || this.options.volume;

    const targetVoice = this.voices.find(v => v.voiceURI === (opts.voiceURI || this.options.voiceURI)) ||
      this.voices.find(v => v.lang === (opts.lang || this.options.lang)) ||
      null;

    if (targetVoice) {
      this.utterance.voice = targetVoice;
    }

    // Word boundary event for karaoke highlight
    this.utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const textBeforeChar = currentSegment.text.slice(0, charIndex);
        const relativeWordIndex = (textBeforeChar.match(/[^\s]+/g) || []).length;
        const activeGlobalWord = currentSegment.startWordIndex + relativeWordIndex;

        this.globalWordIndex = activeGlobalWord;

        if (this.onWordBoundary) {
          this.onWordBoundary({
            globalWordIndex: activeGlobalWord,
            sentenceIndex: index,
            charIndex: event.charIndex,
            charLength: event.charLength || 0
          });
        }
      }
    };

    this.utterance.onend = () => {
      if (this.state === 'playing') {
        this._speakSentence(index + 1, opts);
      }
    };

    this.utterance.onerror = (err) => {
      if (err.error !== 'canceled' && err.error !== 'interrupted') {
        if (this.onError) this.onError(err);
      }
    };

    this.state = 'playing';
    if (this.onStateChange) this.onStateChange(this.state);

    this.synth.speak(this.utterance);
  }

  pause() {
    if (!this.isSupported || this.state !== 'playing') return;
    this.synth.pause();
    this.state = 'paused';
    if (this.onStateChange) this.onStateChange(this.state);
  }

  resume() {
    if (!this.isSupported || this.state !== 'paused') return;
    this.synth.resume();
    this.state = 'playing';
    if (this.onStateChange) this.onStateChange(this.state);
  }

  stop() {
    if (!this.isSupported) return;
    this.state = 'stopped';
    this.synth.cancel();
    if (this.onStateChange) this.onStateChange(this.state);
  }

  setRate(rate) {
    this.options.rate = Math.max(0.5, Math.min(2.5, rate));
  }

  setPitch(pitch) {
    this.options.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  setVoice(voiceURI) {
    this.options.voiceURI = voiceURI;
  }
}
