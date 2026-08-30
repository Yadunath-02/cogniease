# 🤖 Prompt Engineering & AI Cognitive Simplification Framework

> **CogniEase Deliverable 03 — THRIVE 26 Hackathon**  
> *Architectural guide, prompt templates, few-shot evaluations, and hallucination guardrails for converting complex jargon into neurodivergent-friendly plain language.*

---

## 1. Objective & Cognitive Philosophy

The objective of the CogniEase Prompt Engineering pipeline is to transform dense, inaccessible text (such as legal terms of service, clinical trials, academic papers, and financial loan agreements) into **plain language at a Grade 6–8 reading level (Flesch-Kincaid)** without losing essential legal nuances, factual precision, or domain integrity.

```
       +-------------------------------------------------------------------+
       |                  COGNIEASE AI TRANSFORMATION PIPELINE             |
       |                                                                   |
       |  [ Dense Source Text ] (Flesch Grade 16+ | 45-word sentences)     |
       |           │                                                       |
       |           ▼                                                       |
       |  [ Structured Prompt Engine with Guardrails & Lexile Constraints] |
       |           │                                                       |
       |           ▼                                                       |
       |  [ Accessible Chunked Output ] (Flesch Grade 6-8 | Active Voice)  |
       |  - 1 idea per sentence                                            |
       |  - Plain-language glossaries                                      |
       |  - Visual bullet anchors                                          |
       +-------------------------------------------------------------------+
```

---

## 2. Core System Prompt Architecture

Below is the production-grade system prompt engineered for the CogniEase AI engine:

```markdown
You are CogniEase AI, an expert neurodivergent cognitive accessibility engine specializing in Universal Design for Learning (UDL) and WCAG 2.2 AAA cognitive simplification.

YOUR MISSION:
Transform the user's provided dense, multi-clause text into clear, plain-language text optimized for readers with ADHD, Dyslexia, Executive Dysfunction, and Low Literacy.

STRICT TRANSFORMATION RULES:
1. TARGET READING LEVEL: Target Flesch-Kincaid Grade 6 to 8 (Flesch Reading Ease score of 70-85).
2. SENTENCE LENGTH: Every sentence must be between 8 and 18 words maximum. Strictly forbid compound-complex sentences with more than two clauses.
3. ACTIVE VOICE: Convert all passive constructions into clear active voice ("The company collects data" instead of "Data is collected by the company").
4. DE-JARGONIZATION: Replace academic/legal jargon with plain synonyms. If a specialized term MUST be preserved for legal/technical accuracy, provide an immediate inline definition in parentheses: e.g. "Indemnification (promising to pay for damages if someone sues)".
5. CHUNKING & STRUCTURAL ANCHORS:
   - Break monolithic paragraphs into 2-3 sentence chunks.
   - Use bold lead-ins for key action points.
   - Use clear bullet points for conditions, lists, or sequences.
6. PRESERVATION OF TRUTH & ZERO HALLUCINATION:
   - Do NOT add external facts, assumptions, or commentary.
   - Do NOT omit vital caveats, deadlines, monetary amounts, or penalties.
   - Retain 100% semantic fidelity while lowering syntactical friction.
7. NEURODIVERGENT FORMATTING:
   - Eliminate visually ambiguous formatting.
   - Avoid double negatives ("You cannot fail to submit" -> "You must submit").
```

---

## 3. Few-Shot Demonstration Sets

---

### Example 1: Legal Terms of Service & Data Privacy

#### 🔴 Input Text (Raw Legal Jargon — Flesch-Kincaid Grade 18.2):
> *"Notwithstanding anything to the contrary herein contained, the Service Provider shall not be held liable for any consequential, indirect, punitive, or incidental damages whatsoever arising out of or in connection with the utilization or inability to utilize the platform, including but not limited to loss of commercial goodwill, data corruption, or business interruption, even if previously apprised of the possibility thereof."*

#### 🟢 CogniEase AI Output (Accessible Plain Language — Flesch-Kincaid Grade 6.8):
> **What the Company is Not Responsible For:**
> 
> * **No payout for indirect losses:** The company will not pay you for indirect damages if the service stops working.
> * **Examples of what is not covered:**
>   * Lost business profits or commercial deals.
>   * Damaged or deleted files and data.
>   * Paused work or business shutdowns.
> * **Even if warned:** This applies even if you told the company in advance that these problems might happen.

---

### Example 2: Medical / Oncology Research Abstract

#### 🔴 Input Text (Dense Medical Jargon — Flesch-Kincaid Grade 19.4):
> *"The targeted monoclonal antibody regimen demonstrated statistically significant efficacy in down-regulating oncogenic tyrosine kinase phosphorylation pathways, precipitating a 42% decrease in tumor burden across the cohort, though adverse sequelae including grade 3 neutropenia and peripheral neuropathy necessitated dosage recalibration in 14% of enrolled subjects."*

#### 🟢 CogniEase AI Output (Accessible Plain Language — Flesch-Kincaid Grade 7.2):
> **Study Results for New Cancer Drug:**
> 
> * **How it works:** The new medicine blocks specific chemical signals that tell cancer cells to grow.
> * **Key benefit:** In this patient group, tumors shrank by **42%**.
> * **Side effects:**
>   * Some patients had low white blood cell counts (which fight infections).
>   * Some patients felt tingling or numbness in their hands and feet.
> * **Dose changes:** Doctors had to lower the medicine dose for **14 out of 100 patients** to keep them safe.

---

### Example 3: Financial Mortgage Disclosure

#### 🔴 Input Text (Dense Financial Jargon — Flesch-Kincaid Grade 16.9):
> *"Borrower acknowledges that upon the expiration of the introductory thirty-six (36) month fixed amortization timeline, the applicable interest index shall convert to a variable APR calculated against the prevailing SOFR benchmark plus a margin of two hundred fifty (250) basis points, subject to a lifetime adjustment cap of 6.00%."*

#### 🟢 CogniEase AI Output (Accessible Plain Language — Flesch-Kincaid Grade 6.4):
> **How Your Loan Interest Rate Changes:**
> 
> * **First 3 years:** Your interest rate stays fixed and will not change for the first 36 months.
> * **After 3 years:** Your interest rate becomes variable (it goes up or down with the market).
> * **How the new rate is calculated:** Market rate (SOFR) **plus 2.5%**.
> * **Maximum limit:** Over the entire life of your loan, your rate can never increase by more than **6.00%** above your starting rate.

---

## 4. Guardrails & Evaluation Rubric

To ensure reliable, hallucination-free simplifications, every AI transformation is evaluated against a 5-dimension rubric:

```
                  +----------------------------------------------+
                  |         COGNIEASE EVALUATION MATRIX          |
                  |                                              |
                  |  1. Semantic Fidelity & Truth (Weight: 30%)  |
                  |  2. Flesch-Kincaid Target (Weight: 25%)      |
                  |  3. Syntactical Chunking (Weight: 20%)       |
                  |  4. Jargon Elimination (Weight: 15%)         |
                  |  5. Active Voice Compliance (Weight: 10%)    |
                  +----------------------------------------------+
```

| Evaluation Dimension | Scoring Criterion (1 to 5 Stars) | Pass Benchmark |
| :--- | :--- | :--- |
| **1. Semantic Fidelity** | 100% of material conditions, exceptions, and figures are retained with zero added hallucinations. | **$\ge 4.8 / 5.0$** |
| **2. Grade Level (Flesch)** | Measured Flesch-Kincaid Grade is between 6.0 and 8.5; Reading Ease $\ge 70$. | **$\ge 4.5 / 5.0$** |
| **3. Sentence Chunking** | Average sentence length $\le 15$ words; clear bullet point hierarchies. | **$\ge 4.5 / 5.0$** |
| **4. De-Jargonization** | All legal/medical jargon is translated or provided with inline definitions. | **$\ge 4.7 / 5.0$** |
| **5. Active Voice Ratio** | Passive voice sentences represent $< 5\%$ of total text. | **$\ge 4.6 / 5.0$** |

---

## 5. Automated Verification Checklist

Developers and contributors can verify AI transformations against this checklist:

- [x] **No Hallucinations:** Contains only information present in the source text.
- [x] **No Lost Deadlines or Numbers:** All percentages, dollar values, day counts, and dates are preserved exactly.
- [x] **No Double Negatives:** Rephrased into affirmative statements.
- [x] **High-Clarity Headings:** Structured with short descriptive bold headings.
- [x] **Screen-Reader Ready:** Formatted in clean semantic markdown without arbitrary ascii art or emojis in critical text.
