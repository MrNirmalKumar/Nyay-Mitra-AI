import OpenAI from "openai";
import { DEMO_SCENARIOS, findMatchingScenario, StructuredLegalGuidance, NoticePrefill } from "./demo-scenarios";
import { LEGAL_RIGHTS_DATA } from "../data/rights-data";

export type LegalIntent = "legal" | "non-legal" | "ambiguous";

export interface AIAnalysisResult {
  isDemoMode: boolean;
  intent: LegalIntent;
  isLegalIssue: boolean;
  nonLegalResponse?: string;
  clarificationQuestion?: string;
  scenarioId?: string;
  structuredGuidance?: StructuredLegalGuidance;
  suggestedNoticePrefill?: NoticePrefill;
  rawTextResponse?: string;
}

export interface LegalNoticePayload {
  noticeType: string;
  senderName: string;
  senderAddress: string;
  senderPhone?: string;
  senderEmail?: string;
  recipientName: string;
  recipientDesignation?: string;
  recipientCompany?: string;
  recipientAddress: string;
  jurisdiction?: string;
  transactionDate?: string;
  amountInvolved?: string;
  disputeDescription: string;
  legalBasis: string;
  reliefRequested: string;
  deadlineDays?: number;
}

// ─── General-Purpose Intent Classifier ───────────────────────────────────────

/**
 * Robust, general-purpose intent classifier for Nyay Mitra AI.
 * Categorizes user inputs into:
 * - "legal": Clear legal issue / dispute / right violation requiring legal guidance.
 * - "ambiguous": Contains grievance or dispute signals but lacks context (counterparty / action).
 * - "non-legal": Normal conversation, factual statements without disputes, casual chat, sports, food, jokes.
 */
export function classifyLegalIntent(text: string): LegalIntent {
  const t = text.trim().toLowerCase();

  // Very short non-informative inputs
  if (t.length < 4) return "non-legal";

  // ── 1. Clear Legal Dispute Indicators ─────────────────────────────────────
  // A message must contain a SPECIFIC legal problem, dispute, violation, harm,
  // or actionable grievance. Merely mentioning entities like "landlord", "employer",
  // "salary", "rent", or "product" in a factual/normal context is NOT legal.

  const clearLegalPatterns = [
    // Tenancy: Security deposit withholding or deduction disputes
    /\b(deposit|security deposit|rental deposit)\b.*\b(not return|not refund|refus|withheld|withholding|deduct|delay|forfeit|repay|back|deduction|stolen)/i,
    /\b(landlord|lessor|property owner|house owner|flat owner|pg owner)\b.*\b(not return|not refund|refus|withheld|withholding|deduct|forfeit|stolen).*\b(deposit|money)/i,

    // Tenancy: Eviction, lockouts, utility disconnections, threats
    /\b(evict|evicted|eviction)\b.*\b(illegal|forcib|without notice|threat|court|order|unlawful|without reason)/i,
    /\b(landlord|lessor|property owner|house owner|flat owner|pg owner)\b.*\b(evict|evicted|throw.*out|kick.*out|lock.*out|lock.*door|cut.*(electric|water|power|amenit)|shut.*off|disconnect)/i,
    /\b(threaten|threatening).*\b(evict|vacat|throw.*out|leave|premises)/i,

    // Tenancy: Unlawful rent hikes or harassment
    /\b(landlord|lessor|property owner|house owner|flat owner|pg owner)\b.*\b(illegal|illegally|arbitrar|unlawful|unreasonable|sudden|force|forcib).*\b(increase|hike|raise|rent|charge)/i,
    /\b(illegal|illegally|arbitrarily|unlawfully)\b.*\b(increase|increasing|hike|raise|raising).*\b(rent)/i,
    /\b(landlord|lessor|property owner|house owner|flat owner|pg owner)\b.*\b(harass|harassing|abusing|abusive|trespass|trespassing|threatening|threat)/i,

    // Employment: Unpaid or delayed salary/wages, withheld dues
    /\b(salary|wage|wages|stipend|dues|earned pay|severance|gratuity|pf|provident fund)\b.*\b(not paid|unpaid|delay|delaying|withheld|withholding|pending|clear|refusing to pay|arrear|deduct|not cleared|denied)/i,
    /\b(company|employer|boss|firm|workplace|management|hr|organization)\b.*\b(not paid|not pay|unpaid|delay|delaying|withheld|withholding|refus.*pay|cut.*salary|deduct.*salary|not clearing).*\b(salary|wage|dues|pay|money)/i,
    /\b(pf|provident fund|gratuity|esic|bonus)\b.*\b(not deposited|withheld|denied|refused|not paid)/i,

    // Employment: Wrongful termination, illegal dismissal, forced resignation
    /\b(terminate|terminated|termination|fired|dismissed|retrenched|relieved|forced to resign|layoff|laid off)\b.*\b(without|unlawful|illegal|wrongful|arbitrary|severance|compensation|whatsapp|abruptly|overnight|process|notice|procedure)/i,
    /\b(employer|company|boss|firm|hr)\b.*\b(terminate|terminated|fired|dismissed|sack|sacked|laid.*off|forced.*resign)\b.*\b(me|without|illegally|unlawfully)/i,
    /\b(can my (employer|company|boss) fire me|is it legal to (fire|terminate) me)\b/i,

    // Consumer: Defective products, damaged goods
    /\b(defective|faulty|damaged|broken|counterfeit|fake|expired|substandard|used)\b.*\b(product|item|laptop|phone|mobile|goods|order|device|appliance|delivery|package|screen|gadget|car|bike)/i,
    /\b(product|item|laptop|phone|mobile|goods|order|device|package)\b.*\b(is defective|is damaged|is broken|not working|stopped working|faulty|damaged on arrival)/i,

    // Consumer: Refusal to refund, replace, or honor warranty
    /\b(seller|merchant|dealer|flipkart|amazon|vendor|store|shopkeeper|retailer|company)\b.*\b(refus|denied|denying|reject|rejected|no refund|no replacement|won't refund|won't replace|cheated)/i,
    /\b(refus|refuses|refused|denied|reject|rejected|won't).*\b(refund|replacement|warranty|replace|repair|return)/i,
    /\b(warranty|guarantee)\b.*\b(denied|refused|void|rejected|claim|honour|honor|not honouring|not honoring)/i,
    /\b(consumer court|consumer forum|consumer dispute|national consumer helpline|nch|deficiency of service)/i,

    // Criminal intimidation, harassment, threats & personal safety
    /\b(threatening me|threatened me|threat to (my )?life|death threat|threat of violence|kill me|physical harm|beat me|assault|threatening to post|threat to expose)/i,
    /\b(sexual harassment|posh|workplace harassment|stalking me|stalked me|blackmail|blackmailing|extortion|extorting)/i,
    /\b(domestic violence|dowry harassment|cruelty by husband|in-laws harassment)/i,

    // Cybercrime & financial fraud
    /\b(upi (scam|fraud|link)|cyber (fraud|crime)|phishing|unauthorized (transaction|debit|withdrawal)|account hacked|cheated online|scammed me|fraudulent loan app)/i,
    /\bcheque\b.*\b(bounce|bounced|dishonour|dishonoured|dishonored)\b/i,
    /\b(bounced|dishonoured|dishonored) cheque\b/i,
    /\bsection 138\b/i,

    // Explicit legal proceedings, statutes, rights
    /\b(legal notice|fir against|police complaint|court case|file a lawsuit|injunction|stay order)\b/i,
    /\b(section \d+|bharatiya nyaya sanhita|bns|indian penal code|ipc|code on wages|model tenancy act|industrial relations code|consumer protection act|transfer of property act)\b/i,
    /\b(district legal services authority|dlsa|nalva|free legal aid|right to information|rti act)\b/i,
  ];

  for (const pattern of clearLegalPatterns) {
    if (pattern.test(t)) return "legal";
  }

  // ── 2. Genuine Ambiguity ──────────────────────────────────────────────────
  // Input indicates a dispute, conflict, monetary harm, eviction, or legal action desire,
  // but lacks specific counterparty or factual predicate.
  const ambiguousPatterns = [
    /\b(they|someone|he|she|people) (took|stole|deducted|scammed|cheated|swindled|snatched) (my )?(money|cash|funds|amount|savings)\b/i,
    /\b(lost|lost my) (money|amount|rupees|cash|savings)\b/i,
    /\b(broke|breached|violated|dishonoured) (the|our|a) (agreement|contract|deal|promise|terms)\b/i,
    /\b(kicked|thrown|forced) (me )?out\b/i,
    /\b(received|got|served with) (a |an |the )?(official |legal )?(notice|letter|summons|warning)\b/i,
    /\b(want to|how (can|do) i|can i) (file a (case|complaint|lawsuit|fir)|sue|take legal action|go to court|complain against)\b/i,
    /\b(can they (legally )?do (this|that)|is (this|it) (legal|allowed|lawful)|are they allowed to)\b/i,
    /\b(someone is (harassing|bothering|disturbing|abusing) me)\b/i,
    /\b(they are refusing to (sign|give|comply|agree|cooperate))\b/i,
    /\b(i (was|got) cheated|someone cheated me)\b/i,
    /\b(i need (legal )?help|help with a (legal )?dispute|need advice on a problem)\b/i,
  ];

  for (const pattern of ambiguousPatterns) {
    if (pattern.test(t)) return "ambiguous";
  }

  // ── 3. Clear Non-Legal ───────────────────────────────────────────────────
  // General conversation, factual statements without disputes, hobbies, sports, food, jokes, weather, etc.
  return "non-legal";
}

/**
 * Generates a natural, conversational response for non-legal inputs,
 * politely reminding the user of Nyay Mitra AI's legal assistance purpose.
 */
export function generateNonLegalResponse(prompt: string): string {
  const t = prompt.toLowerCase();

  // Factual mentions of legal entities without disputes (e.g. paying rent, getting salary, bought a product)
  if (/\b(landlord|tenant|employer|company|seller|rent|salary|office)\b/i.test(t)) {
    return "That sounds like a standard everyday or contractual arrangement. As a reminder, I am Nyay Mitra AI, an assistant dedicated to helping Indian citizens when there is an actual legal dispute, right violation, or grievance (such as withheld security deposits, unpaid wages, wrongful termination, or defective products). If you ever encounter a legal issue or dispute, feel free to ask!";
  }

  if (/\b(cricket|match|football|sports|game|score|wicket|goal|india won)\b/i.test(t)) {
    return "That sounds like an exciting sports update! 🇮🇳 Just a reminder: I am Nyay Mitra AI, an assistant dedicated to helping Indian citizens understand their legal rights and dispute resolution under Indian law. If you ever face an issue with a landlord, employer, seller, or bank, feel free to ask!";
  }

  if (/\b(eat|dinner|lunch|breakfast|food|snack|recipe|cook|restaurant|pizza|biryani|burger)\b/i.test(t)) {
    return "A wholesome meal like dal, roti, rice, and fresh vegetables is always a comforting choice! 🍲 Keep in mind that I am Nyay Mitra AI, an assistant specialized in legal rights and dispute resolution. Feel free to reach out if you ever need legal clarity on tenancy, employment, or consumer matters!";
  }

  if (/\b(weather|rain|temperature|sunny|cloudy|forecast|cold outside|hot outside)\b/i.test(t)) {
    return "Enjoy the wonderful weather today! ☀️ As a reminder, I am Nyay Mitra AI, an assistant focused on Indian legal rights, consumer grievances, tenancy disputes, and employment issues. Let me know if you ever need guidance on a legal matter.";
  }

  if (/\b(badminton|tennis|exercise|gym|workout|running|played)\b/i.test(t)) {
    return "Playing sports is a fantastic way to stay active and healthy! 🏸 Keep in mind that I am Nyay Mitra AI, built to guide citizens on Indian law, tenancy matters, employment issues, and consumer rights. Feel free to ask if you ever encounter a legal dispute.";
  }

  if (/\b(joke|funny|laugh|riddle|humor)\b/i.test(t)) {
    return "Why did the judge bring a ruler to court? To measure the justice! 😄 On a serious note, I am Nyay Mitra AI, designed to assist Indian citizens with legal questions, consumer disputes, tenancy rights, and statutory demand notices. If you have any legal questions, feel free to ask!";
  }

  if (/\b(haircut|salon|barber|shave|grooming|clothes|shopping)\b/i.test(t)) {
    return "Hope you get a great haircut! ✂️ Just as a reminder, I am Nyay Mitra AI, an assistant built to guide citizens through Indian legal issues such as landlord disputes, unpaid salaries, or consumer complaints. Let me know if you ever need legal clarity!";
  }

  if (/\b(hello|hi|hey|good morning|good evening|good afternoon|namaste)\b/i.test(t)) {
    return "Namaste! I am Nyay Mitra AI, your civic legal guidance companion. I help explain rights under Indian law (tenancy, employment, consumer protection, cyber fraud, and contracts) in plain language and assist in drafting formal demand notices. How can I help you with a legal question today?";
  }

  return "I understand, but this doesn't appear to be a legal issue. I am Nyay Mitra AI, an assistant created specifically to help Indian citizens understand their legal rights regarding tenancy, employment, consumer protection, contracts, cyber fraud, and dispute resolution. If you are dealing with a legal issue or dispute, please describe it and I will be glad to assist!";
}

/**
 * Generates exactly ONE short, focused clarification question for ambiguous queries.
 */
export function generateClarificationQuestion(prompt: string): string {
  const t = prompt.toLowerCase();

  if (/\b(money|funds|cash|amount|deducted|stole|took|lost)\b/i.test(t)) {
    return "To help identify your legal remedies under Indian law, could you please clarify who took or deducted the money (e.g., an unauthorized digital scam, a bank charge, an employer, or an acquaintance) and how it happened?";
  }

  if (/\b(agreement|contract|deal|terms|promise|breach)\b/i.test(t)) {
    return "To determine the applicable contract or dispute legislation, could you briefly clarify what kind of agreement this was (e.g., tenancy, employment, commercial business, or informal) and what specific term was breached?";
  }

  if (/\b(notice|letter|summons|warning)\b/i.test(t)) {
    return "Could you share who issued this notice (e.g., a landlord, an employer, a civil court, tax authorities, or police) and what demand or action it requires?";
  }

  if (/\b(kicked|thrown|forced out|evict)\b/i.test(t)) {
    return "Could you clarify whether you were evicted from a rented residence, terminated from a workplace, or asked to leave another premises?";
  }

  if (/\b(harass|bother|disturb|threat)\b/i.test(t)) {
    return "For your safety and legal guidance, could you clarify whether this harassment is occurring online, at your workplace, or in person, and whether there is an immediate threat to your safety?";
  }

  if (/\b(file a case|complaint|sue|court)\b/i.test(t)) {
    return "To direct you to the correct forum or legal authority, what is the core grievance and who is the complaint against (e.g., seller, landlord, employer, or financial institution)?";
  }

  return "To help determine your legal options under Indian law, could you briefly clarify who is involved in this dispute (e.g., a landlord, employer, seller, or bank) and what specific action occurred?";
}

// ─── System Prompt for Live OpenAI Integration ───────────────────────────────

const SYSTEM_PROMPT = `
You are "Nyay Mitra AI", an ethical and professional AI legal information assistant designed to help common citizens in India understand their legal rights in plain language.

CRITICAL RULES — READ CAREFULLY:

STEP 1 — INTENT CLASSIFICATION FIRST:
Before anything else, determine if the user's message is:

A. "non-legal": Casual conversation, sports, dinner/cooking, weather, jokes, daily life routines, greetings, general knowledge, etc.
   CRITICAL: Mentioning words like "landlord", "employer", "company", "seller", "rent", or "salary" in ordinary, factual, or consensual statements (e.g. "My landlord takes rent from me because I live there", "My employer gives me salary every month", "I bought a product from a seller", "I pay rent to my landlord", "My company has an office", "My landlord lives nearby") is NON-LEGAL. A message is ONLY a legal issue when it contains a specific dispute, violation, harm, denial of rights, or request for legal relief.
   Return ONLY:
   {
     "intent": "non-legal",
     "isLegalIssue": false,
     "nonLegalResponse": "Natural, friendly conversational response addressing what they said, politely clarifying that Nyay Mitra AI is specialized for Indian legal issues and citizen rights."
   }
   Do NOT generate legal analysis, legal sections, legal rights, legal notice buttons, compensation claims, or complaint language.

B. "ambiguous": The user refers to a conflict, money loss, agreement breach, or wanting to complain/file a case, BUT lacks context on who is involved or what occurred (e.g. "They took my money", "He broke our agreement", "I was kicked out").
   Return ONLY:
   {
     "intent": "ambiguous",
     "isLegalIssue": false,
     "clarificationQuestion": "One short, focused question asking for the essential missing facts (e.g. who is involved and what action occurred) before legal analysis can be made."
   }
   Do NOT generate legal sections, rights, or notice drafts for ambiguous messages.

C. "legal": The user describes a clear legal problem (tenancy, unpaid salary, wrongful termination, defective product/refund denial, threats, cyber fraud, contract dispute, etc.).
   Return:
   {
     "intent": "legal",
     "isLegalIssue": true,
     "understanding": "Empathic, plain-English summary of only the facts the user actually stated. Do not add assumed facts.",
     "legalArea": "Specific area of Indian law e.g. Tenancy Law, Consumer Protection, Labour & Employment",
     "jurisdictionNote": "Note if the applicable law varies by state/UT and what the user should verify locally",
     "possibleRights": ["Only rights that are clearly applicable based on stated facts"],
     "relevantLaws": [
       {
         "provision": "Section or Rule number (only if verifiable)",
         "act": "Full name of Act and year",
         "details": "Plain explanation of what this provision means for the user",
         "sourceUrl": "Official India Code or Ministry URL if available, else empty string"
       }
     ],
     "nextSteps": ["Practical numbered steps based only on stated facts"],
     "documentsEvidence": ["Specific documents relevant to this case"],
     "professionalHelp": "When professional legal advice is warranted",
     "followupQuestions": ["2-3 focused questions if important facts are missing"]
   }

LEGAL ACCURACY RULES:
1. Use current, enacted Indian law. For labour/employment matters, cite the Labour Codes in force: Code on Wages, 2019; Industrial Relations Code, 2020; Code on Social Security, 2020; Occupational Safety, Health and Working Conditions Code, 2020. Also cite State Shops and Commercial Establishments Acts. The Industrial Disputes Act, 1947 continues to apply in states that have not notified the new codes — mention this clearly.
2. For tenancy, treat the Model Tenancy Act, 2021 as a central model framework that applies only in States/UTs that have adopted it. For most tenants, the relevant law is their State/UT Rent Control or Tenancy Act and the Transfer of Property Act, 1882. Always note jurisdiction.
3. NEVER fabricate section numbers, case citations, compensation amounts, interest rates, deadlines, or procedural steps.
4. If you cannot verify a specific provision, say "verification required — please check India Code (indiacode.nic.in) or consult a qualified advocate."
5. NEVER claim guaranteed outcomes or present uncertain information as fact.
6. For emergencies: advise contacting 112 (Police), 1930 (Cyber Crime), 1915 (Consumer), 15100 (Legal Aid), or DLSA.
7. You are NOT a lawyer. Never create an attorney-client relationship. Always recommend professional legal advice for significant or complex matters.
`;

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Server-side AI consultation service with automatic Demo Mode fallback.
 */
export async function analyzeLegalProblem(
  prompt: string,
  _history: { role: string; content: string }[] = []
): Promise<AIAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const isDemo = !apiKey || apiKey.trim() === "" || apiKey === "demo_key";

  // ── Step 1: Intent Classification ─────────────────────────────────────────
  const intent = classifyLegalIntent(prompt);

  // 1A. Clear Non-Legal
  if (intent === "non-legal") {
    return {
      isDemoMode: isDemo,
      intent: "non-legal",
      isLegalIssue: false,
      nonLegalResponse: generateNonLegalResponse(prompt),
    };
  }

  // 1B. Genuine Ambiguity
  if (intent === "ambiguous") {
    return {
      isDemoMode: isDemo,
      intent: "ambiguous",
      isLegalIssue: false,
      clarificationQuestion: generateClarificationQuestion(prompt),
    };
  }

  // ── Step 2: Clear Legal Issue ─────────────────────────────────────────────
  // If in Demo Mode (or fallback)
  const matchedScenario = findMatchingScenario(prompt);

  if (isDemo) {
    if (matchedScenario) {
      return {
        isDemoMode: true,
        intent: "legal",
        isLegalIssue: true,
        scenarioId: matchedScenario.id,
        structuredGuidance: matchedScenario.structuredGuidance,
        suggestedNoticePrefill: matchedScenario.noticePrefill,
      };
    }

    const fallbackGuidance = generateDemoFallbackGuidance(prompt);
    return {
      isDemoMode: true,
      intent: "legal",
      isLegalIssue: true,
      structuredGuidance: fallbackGuidance,
      suggestedNoticePrefill: buildBlankNoticePrefill(fallbackGuidance),
    };
  }

  // ── Step 3: Live OpenAI Path (when API key is present) ─────────────────────
  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ..._history.map((h) => ({
          role: h.role as "user" | "assistant" | "system",
          content: h.content,
        })),
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.15,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI engine");

    const parsed = JSON.parse(content);

    // AI determined non-legal
    if (parsed.intent === "non-legal" || parsed.isLegalIssue === false) {
      return {
        isDemoMode: false,
        intent: "non-legal",
        isLegalIssue: false,
        nonLegalResponse:
          parsed.nonLegalResponse || generateNonLegalResponse(prompt),
      };
    }

    // AI determined ambiguous
    if (parsed.intent === "ambiguous") {
      return {
        isDemoMode: false,
        intent: "ambiguous",
        isLegalIssue: false,
        clarificationQuestion:
          parsed.clarificationQuestion || generateClarificationQuestion(prompt),
      };
    }

    const guidance: StructuredLegalGuidance = parsed;
    return {
      isDemoMode: false,
      intent: "legal",
      isLegalIssue: true,
      structuredGuidance: guidance,
      suggestedNoticePrefill: buildBlankNoticePrefill(guidance),
    };
  } catch (error) {
    console.warn("OpenAI API call failed, falling back to Demo Mode engine:", error);
    if (matchedScenario) {
      return {
        isDemoMode: true,
        intent: "legal",
        isLegalIssue: true,
        scenarioId: matchedScenario.id,
        structuredGuidance: matchedScenario.structuredGuidance,
        suggestedNoticePrefill: matchedScenario.noticePrefill,
      };
    }
    const fallback = generateDemoFallbackGuidance(prompt);
    return {
      isDemoMode: true,
      intent: "legal",
      isLegalIssue: true,
      structuredGuidance: fallback,
      suggestedNoticePrefill: buildBlankNoticePrefill(fallback),
    };
  }
}

// ─── Legal Notice Draft Builder ───────────────────────────────────────────────

/**
 * Generate a professional legal demand notice strictly from user-confirmed facts.
 * Does NOT add fabricated fees, interest rates, accusations, or deadlines.
 */
export function buildLegalNoticeDraft(payload: LegalNoticePayload): string {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jurisdictionLine = payload.jurisdiction
    ? `\nApplicable Jurisdiction / State: ${payload.jurisdiction}`
    : "";

  const deadlineClause =
    payload.deadlineDays && payload.deadlineDays > 0
      ? `\n4. COMPLIANCE TIMELINE:\n   You are requested to address the above demands within ${payload.deadlineDays} days of receipt of this notice.`
      : "";

  return `LEGAL DEMAND NOTICE
(To be sent via Speed Post with Acknowledgement Due and/or Registered Email)

Date: ${today}${jurisdictionLine}

TO:
${payload.recipientName}${payload.recipientDesignation ? `, ${payload.recipientDesignation}` : ""}
${payload.recipientCompany ? `${payload.recipientCompany}\n` : ""}${payload.recipientAddress}

FROM:
${payload.senderName}
${payload.senderAddress}
${payload.senderPhone ? `Phone: ${payload.senderPhone}` : ""}${payload.senderEmail ? ` | Email: ${payload.senderEmail}` : ""}

SUBJECT: NOTICE IN THE MATTER OF ${payload.noticeType.toUpperCase()}${payload.amountInvolved ? ` — ${payload.amountInvolved}` : ""}

Sir / Madam,

I hereby bring the following matter to your attention and request your prompt response:

1. BACKGROUND AND FACTS:
${payload.transactionDate ? `   a) The relevant events took place on / around: ${payload.transactionDate}.\n` : ""}   ${payload.disputeDescription}

2. LEGAL BASIS:
   ${payload.legalBasis}

3. RELIEF / ACTION REQUESTED:
   ${payload.reliefRequested}
${deadlineClause}

Please treat this notice as a formal communication and respond accordingly. A copy of this notice is retained for record purposes.

Yours faithfully,

___________________________
${payload.senderName}
(Sender)

---
Note: This notice reflects only the facts as provided by the sender. If you believe any information is incorrect, please communicate in writing at the earliest.
Nyay Mitra AI — General legal drafting assistance. Not a substitute for qualified legal counsel.`;
}

// ─── Fallback Guidance Helper ─────────────────────────────────────────────────

/**
 * Builds a structured fallback guidance for genuine but unmatched legal queries.
 * Does NOT fabricate specific statutes — states what can be verified.
 */
function generateDemoFallbackGuidance(prompt: string): StructuredLegalGuidance {
  const lower = prompt.toLowerCase();

  const rightMatch = LEGAL_RIGHTS_DATA.find(
    (r) =>
      lower.includes(r.category.toLowerCase()) ||
      lower.includes(r.title.toLowerCase()) ||
      r.applicableLaws.some((l) => lower.includes(l.toLowerCase()))
  );

  if (rightMatch) {
    return {
      understanding: `You have raised a matter regarding ${rightMatch.title.toLowerCase()}. The following is general guidance based on your situation as described.`,
      legalArea: `${rightMatch.category}`,
      possibleRights: rightMatch.possibleRights,
      relevantLaws: rightMatch.applicableLaws.map((law) => ({
        provision: "Refer to official text",
        act: law,
        details: `Please verify the current provisions under ${law} on indiacode.nic.in or with a qualified advocate, as provisions may vary by state.`,
        sourceUrl: "https://www.indiacode.nic.in",
      })),
      nextSteps: rightMatch.practicalNextSteps,
      documentsEvidence: [
        "All written communications related to the dispute (emails, SMS, letters).",
        "Relevant financial records (bank statements, receipts, invoices).",
        "Any signed contracts, agreements, or acknowledgements.",
        "Identity documents (Aadhaar, PAN) for formal proceedings.",
      ],
      professionalHelp:
        "For any dispute involving significant money, employment consequences, or legal proceedings, consult a qualified advocate or contact your District Legal Services Authority (DLSA) for free assistance. Helpline: 15100.",
      followupQuestions: [
        "In which state or Union Territory did this situation arise? (The applicable law may differ by location.)",
        "Do you have a written agreement or contract for this arrangement?",
        "Have you already communicated your concern in writing to the other party?",
      ],
    };
  }

  return {
    understanding: `You have described a situation that may involve a legal dispute. I need a few more details to provide accurate guidance.`,
    legalArea: "General Civil or Consumer Law — to be confirmed after clarification",
    possibleRights: [
      "Right to seek redress for breach of a lawful agreement under the Indian Contract Act, 1872.",
      "Right to approach appropriate consumer or civil forums if applicable.",
      "Right to free legal aid from the District Legal Services Authority (DLSA) — Helpline: 15100.",
    ],
    relevantLaws: [
      {
        provision: "Section 73",
        act: "Indian Contract Act, 1872",
        details:
          "Provides that compensation may be claimed for loss caused by breach of a contract. Verify applicability on indiacode.nic.in.",
        sourceUrl: "https://www.indiacode.nic.in/handle/123456789/2187",
      },
    ],
    nextSteps: [
      "Collect all written evidence — contracts, communications, payment records.",
      "Send a formal written communication to the other party stating your concern.",
      "Seek clarification on the applicable law from a qualified advocate or DLSA.",
    ],
    documentsEvidence: [
      "Written agreements or contracts.",
      "Bank statements or payment receipts.",
      "Email or message threads related to the dispute.",
    ],
    professionalHelp:
      "For situations involving significant financial or legal consequences, consult a qualified legal professional. Free services available through DLSA (Helpline: 15100).",
    followupQuestions: [
      "Who is the other party — a landlord, employer, seller, bank, or someone else?",
      "What specifically has happened — what action or refusal prompted your concern?",
      "In which state or city did this occur?",
    ],
  };
}

/**
 * Builds an empty notice prefill that clearly signals fields need user input.
 * Does NOT populate with realistic-looking fake personal details.
 */
export function buildBlankNoticePrefill(guidance: StructuredLegalGuidance): NoticePrefill {
  return {
    noticeType: guidance.legalArea || "Legal Dispute Notice",
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientDesignation: "",
    recipientCompany: "",
    recipientAddress: "",
    transactionDate: "",
    amountInvolved: "",
    disputeDescription: "",
    legalBasis: guidance.relevantLaws
      ? guidance.relevantLaws.map((l) => `${l.act}${l.provision ? ` (${l.provision})` : ""}`).join("; ")
      : "",
    reliefRequested: "",
    deadlineDays: 15,
  };
}
