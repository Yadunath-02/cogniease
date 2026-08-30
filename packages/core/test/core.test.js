import test from 'node:test';
import assert from 'node:assert/strict';
import { bionifyWord, bionifyText, parseBionicTokens } from '../src/bionic.js';
import { analyzeReadability, countSyllables } from '../src/readability.js';

test('bionifyWord correctly bolds initial characters', () => {
  const result = bionifyWord('reading');
  assert.ok(result.includes('<b') || result.includes('strong'));
  assert.ok(result.includes('</b>') || result.includes('</strong>'));
});

test('parseBionicTokens returns structured tokens with fixation data', () => {
  const text = 'Hello world! Accessible reading.';
  const tokens = parseBionicTokens(text);
  assert.ok(Array.isArray(tokens));
  assert.ok(tokens.length > 0);
  const wordTokens = tokens.filter(t => t.type === 'word');
  assert.equal(wordTokens.length, 4);
  assert.equal(wordTokens[0].cleanWord, 'hello');
});

test('countSyllables accurately counts syllables', () => {
  assert.equal(countSyllables('cat'), 1);
  assert.equal(countSyllables('reading'), 2);
  assert.equal(countSyllables('accessibility'), 6);
});

test('analyzeReadability returns complete linguistic scorecard', () => {
  const text = 'The quick brown fox jumps over the lazy dog. Reading makes life better.';
  const metrics = analyzeReadability(text);
  assert.ok(metrics.wordCount > 0);
  assert.ok(metrics.fleschReadingEase >= 0 && metrics.fleschReadingEase <= 100);
  assert.ok(typeof metrics.fleschKincaidGrade === 'number');
  assert.ok(typeof metrics.difficultyRating === 'string');
});
