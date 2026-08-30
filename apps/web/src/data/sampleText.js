/**
 * Curated sample texts representing dense, complex domain text
 * and simplified plain-language accessible versions for demonstration.
 */

export const SAMPLE_TEXTS = [
  {
    id: 'legal-tos',
    title: '📜 Legal Terms & Liability Waiver',
    category: 'Legal / Contract',
    difficulty: 'Flesch-Kincaid Grade 17.8 (Post-Graduate)',
    rawText: `Notwithstanding anything to the contrary herein contained, the Service Provider, its affiliates, directors, employees, and authorized agents shall not be held liable under any circumstances for any consequential, indirect, punitive, special, or incidental damages whatsoever arising out of or in connection with the utilization or inability to utilize the platform, including but not limited to loss of commercial goodwill, data corruption, system downtime, or business interruption, even if previously apprised of the possibility thereof.

The User hereby indemnifies and covenants to hold harmless the indemnified parties against any third-party claims, liabilities, losses, costs, or reasonable attorney fees resulting from the User's breach of any covenant or representation set forth within this Master Services Agreement. Any dispute arising hereunder shall be resolved solely through binding, non-appealable arbitration within the exclusive jurisdiction of the designated arbitration tribunal.`,
    simplifiedText: `What the Company is NOT Responsible For:
• No payout for indirect losses: The company will not pay you for indirect damages if the service stops working.
• Examples of what is not covered:
  - Lost business profits or commercial deals.
  - Damaged, deleted, or corrupted files and data.
  - Paused work, system downtime, or business shutdowns.
• Even if warned: This applies even if you told the company in advance that these problems might happen.

Your Agreement:
• You agree to pay legal costs if you break these rules and someone sues the company because of your actions.
• All legal disputes must be settled through private arbitration instead of a public court trial.`
  },
  {
    id: 'medical-abstract',
    title: '🧬 Medical Oncology Research Abstract',
    category: 'Clinical Medical',
    difficulty: 'Flesch-Kincaid Grade 19.2 (Specialist)',
    rawText: `The randomized, double-blind phase III clinical trial evaluated the therapeutic efficacy of a novel humanized monoclonal antibody targeting oncogenic receptor tyrosine kinase signaling pathways in refractory metastatic adenocarcinomas. Administration of the therapeutic compound demonstrated a statistically significant improvement in overall progression-free survival (hazard ratio 0.58; 95% confidence interval [CI], 0.44 to 0.76; p < 0.001) in comparison to the placebo arm.

Notwithstanding the pronounced anti-tumor efficacy, severe treatment-emergent adverse events were documented in 28.4% of the intervention cohort, primarily manifested as grade 3 neutropenia, transient hepatic transaminase elevation, and peripheral sensory neuropathy requiring scheduled dosage reduction protocols in 14.2% of enrolled subjects.`,
    simplifiedText: `New Cancer Drug Study Results:
• What they tested: Doctors tested a new medicine designed to block chemical signals that help cancer cells grow and spread.
• Key benefit: Patients taking the new medicine lived significantly longer without their cancer getting worse compared to patients given a placebo.
• Main numbers: The risk of the cancer spreading was reduced by 42%.

Side Effects and Safety:
• Serious side effects happened in about 28 out of 100 patients:
  - Low white blood cell count (which lowers immune defense).
  - Temporary liver stress shown on blood tests.
  - Tingling or numbness in hands and feet.
• Doctors lowered the medicine dose for 14 out of 100 patients to keep them safe.`
  },
  {
    id: 'financial-loan',
    title: '💳 Financial Mortgage APR Disclosure',
    category: 'Finance / Banking',
    difficulty: 'Flesch-Kincaid Grade 16.4 (College)',
    rawText: `Borrower acknowledges that upon the expiration of the introductory thirty-six (36) month fixed amortization timeline, the applicable interest index shall convert to an adjustable variable annual percentage rate (APR). This variable rate shall be recalculated semi-annually based on the prevailing 30-day Secured Overnight Financing Rate (SOFR) benchmark index plus an underwriting margin of two hundred seventy-five (275) basis points.

The periodic interest rate adjustment shall be subject to an interim ceiling adjustment cap of two percentage points (2.00%) per bi-annual interval and an overarching lifetime aggregate adjustment cap of six percentage points (6.00%) above the initial fixed promissory note rate.`,
    simplifiedText: `How Your Home Loan Interest Rate Works:
• First 3 Years (Months 1 to 36):
  - Your interest rate is fixed. It will stay exactly the same.
• After 3 Years:
  - Your loan switches to a variable interest rate.
  - Your rate will be recalculated every 6 months based on current market rates (SOFR) plus 2.75%.

Safety Caps to Protect You:
• 6-Month Cap: Your rate can never go up by more than 2.0% in any single 6-month period.
• Lifetime Cap: Over the entire life of your loan, your rate can never rise more than 6.0% higher than where it started.`
  },
  {
    id: 'tech-distributed',
    title: '💻 Distributed Consensus Protocol',
    category: 'Computer Science',
    difficulty: 'Flesch-Kincaid Grade 15.1 (Undergraduate)',
    rawText: `In an asynchronous distributed state machine replication architecture, achieving Byzantine fault tolerance requires a supermajority quorum threshold of at least 2f + 1 non-faulty validator nodes in a network comprising 3f + 1 total participants. When an uncommitted log entry is proposed by the elected primary leader, followers append the cryptographic digest to their local write-ahead log upon verifying epoch validity.

If network partition anomalies prevent quorum convergence before the randomized heartbeat election timeout expires, non-primary nodes initiate leader election view transitions to prevent catastrophic state divergence and ensure deterministic linearizability.`,
    simplifiedText: `How Distributed Computer Networks Agree:
• The Big Goal: Make sure computers in a network agree on the same data, even if some computers crash or send false messages.
• The 2/3 Majority Rule: If up to 'f' computers fail, the network needs at least '3f + 1' total computers to keep working safely.
• Proposing Changes: The leader computer sends a change request. Other computers check that the leader is legitimate before saving it.
• Handling Network Problems: If the leader loses connection or stops responding, the remaining computers quickly vote for a new leader to keep everything running smoothly.`
  }
];
