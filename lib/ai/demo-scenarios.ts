// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface StructuredLegalGuidance {
  understanding: string;
  legalArea: string;
  jurisdictionNote?: string;
  possibleRights?: string[];
  relevantLaws?: {
    provision: string;
    act: string;
    details: string;
    sourceUrl?: string;
  }[];
  nextSteps?: string[];
  documentsEvidence?: string[];
  professionalHelp?: string;
  followupQuestions?: string[];
}

export interface NoticePrefill {
  noticeType: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientDesignation: string;
  recipientAddress: string;
  recipientCompany?: string;
  jurisdiction?: string;
  transactionDate: string;
  amountInvolved: string;
  disputeDescription: string;
  legalBasis: string;
  reliefRequested: string;
  deadlineDays: number;
}

export interface DemoScenario {
  id: string;
  title: string;
  shortDescription: string;
  prompt: string;
  category: string;
  structuredGuidance: StructuredLegalGuidance;
  noticePrefill: NoticePrefill;
}

// ─── Demo Scenarios ───────────────────────────────────────────────────────────
// These are labelled DEMO DATA / SAMPLE TEMPLATES throughout the UI.
// All facts below are illustrative; they do not represent real people or events.

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "landlord-deposit",
    title: "Security Deposit Withheld by Landlord",
    shortDescription: "Landlord refusing to refund deposit after move-out with no major damages.",
    prompt: "My landlord is refusing to return my security deposit even though I moved out and there is no major damage to the property.",
    category: "Tenant & Property Rights",
    structuredGuidance: {
      understanding:
        "Based on what you have shared, you vacated your rented premises and completed the handover, yet your landlord is withholding or delaying the refund of your security deposit without citing specific, itemised damage beyond normal wear and tear.",
      legalArea: "Tenancy Law & Property Law",
      jurisdictionNote:
        "⚠️ Important: Tenancy law in India is state-specific. The Model Tenancy Act, 2021 is a central model framework — it applies only in States/UTs that have adopted or enacted their own legislation based on it. For most tenants, the relevant laws are: (1) your State or UT Rent Control / Tenancy Act (e.g., the Maharashtra Rent Control Act, 1999; Delhi Rent Control Act, 1958; Karnataka Rent Act, 2001; Tamil Nadu Regulation of Rights and Responsibilities of Landlords and Tenants Act, 2017, etc.), and (2) the Transfer of Property Act, 1882. Please confirm your state/UT for jurisdiction-specific guidance.",
      possibleRights: [
        "Right to the return of your security deposit after peaceful handover of the premises, subject only to verified, itemised deductions for actual damage beyond normal wear and tear.",
        "Right to demand a written, itemised account of any deductions proposed by the landlord, with supporting evidence (photographs, repair bills).",
        "Normal wear and tear (routine paint fading, minor marks) generally cannot be deducted — however, the exact standard varies by applicable state legislation.",
        "If your state has adopted the Model Tenancy Act, 2021 framework: Section 13 caps the security deposit at two months' rent for residential premises and mandates refund at the time of handing over possession (subject to lawful deductions).",
      ],
      relevantLaws: [
        {
          provision: "Section 108",
          act: "Transfer of Property Act, 1882",
          details:
            "Sets out the rights and liabilities of lessors and lessees, including the lessee's right to quiet enjoyment and the lessor's duty not to make deductions not covered by the agreement.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/2328",
        },
        {
          provision: "Section 13",
          act: "Model Tenancy Act, 2021 (applicable only in adopting States/UTs)",
          details:
            "Caps security deposit at two months' rent for residential premises and requires refund at the time of handing over possession after accounting for lawful deductions. Verify whether your state/UT has adopted this framework.",
          sourceUrl: "https://mohua.gov.in/upload/uploadfiles/files/Model_Tenancy_Act_2021.pdf",
        },
        {
          provision: "Applicable State Rent Control / Tenancy Act",
          act: "State/UT-specific Rent Control or Tenancy legislation",
          details:
            "Each state or UT has its own rent control or tenancy law. Please verify your applicable state legislation on your State Government portal or India Code (indiacode.nic.in).",
          sourceUrl: "https://www.indiacode.nic.in",
        },
      ],
      nextSteps: [
        "Identify which state/UT you rented in — this determines your primary applicable law.",
        "Document the condition of the vacated property with timestamped photographs and video taken on the handover date.",
        "Obtain a written or digital acknowledgement of key handover (WhatsApp message or email confirming you returned the keys).",
        "Send a formal written demand to your landlord by email or registered letter, stating the deposit amount and requesting return within a reasonable period.",
        "If the landlord does not respond or refuses, seek guidance from a qualified advocate or the DLSA, or approach the Rent Authority / civil court of competent jurisdiction in your area.",
      ],
      documentsEvidence: [
        "Original signed lease / rental agreement.",
        "Bank transfer record, receipt, or other proof of deposit payment.",
        "Photographs and video of the property condition at move-out.",
        "Written handover acknowledgement (email, WhatsApp, or signed document).",
        "Rent receipts or UPI payment records.",
      ],
      professionalHelp:
        "If the landlord makes large or unjustified deductions, disputes the handover, or refuses to engage, consult a qualified advocate practising in your state, or contact your District Legal Services Authority (DLSA) for free legal assistance (Helpline: 15100).",
      followupQuestions: [
        "In which state or UT is the rented property located? (This determines the applicable tenancy law.)",
        "Do you have a written rental agreement? Does it specify the refund timeline?",
        "Did you conduct a joint move-out inspection with the landlord, or obtain any acknowledgement of handover?",
      ],
    },
    noticePrefill: {
      noticeType: "Notice for Return of Security Deposit [DEMO SAMPLE — replace with your details]",
      senderName: "[Your Full Name] — Demo Sample",
      senderAddress: "[Your Address] — Demo Sample",
      senderPhone: "[Your Phone]",
      senderEmail: "[Your Email]",
      recipientName: "[Landlord's Name] — Demo Sample",
      recipientDesignation: "Landlord / Property Owner",
      recipientAddress: "[Landlord's Address] — Demo Sample",
      jurisdiction: "[State/UT — e.g., Karnataka]",
      transactionDate: "[Date of move-out / key handover]",
      amountInvolved: "[Security deposit amount]",
      disputeDescription:
        "[Describe your situation: when you moved out, that no major damage was caused, that the landlord has not returned the deposit, and any communications you have had.] — Demo Sample — replace with your actual facts.",
      legalBasis:
        "Transfer of Property Act, 1882 (Section 108); applicable State/UT Rent Control or Tenancy Act; and if applicable, the Model Tenancy Act, 2021 (Section 13) as adopted by the relevant State/UT.",
      reliefRequested:
        "[State the exact deposit amount you are claiming, e.g.: Return of security deposit of ₹[amount] as per the rental agreement and applicable law.]",
      deadlineDays: 15,
    },
  },
  {
    id: "employee-termination",
    title: "Wrongful Termination Without Notice & Severance",
    shortDescription: "Company terminated employment abruptly without notice period or full settlement.",
    prompt: "My company terminated me without giving me proper notice and has not paid my final salary.",
    category: "Labour & Employment Law",
    structuredGuidance: {
      understanding:
        "Based on what you have described, your employment was ended without the notice period or notice pay that you are entitled to under your contract or applicable law, and your full and final (F&F) settlement including earned wages remains unpaid.",
      legalArea: "Labour & Employment Law",
      jurisdictionNote:
        "⚠️ Important: Indian labour law is currently in transition. Four central Labour Codes have been enacted — Code on Wages, 2019; Industrial Relations Code, 2020; Code on Social Security, 2020; and Occupational Safety, Health and Working Conditions Code, 2020. These Codes consolidate earlier laws including the Industrial Disputes Act, 1947. However, as of the time of writing, these Codes have not been uniformly notified and brought into force in all states. In states where the Labour Codes are not yet in force, the earlier laws (including the Industrial Disputes Act, 1947; Payment of Wages Act, 1936; and Shops and Commercial Establishments Acts) continue to apply. Your applicable State's Shops and Commercial Establishments Act is also independently relevant for non-factory establishments. Please verify the current position with an advocate in your state.",
      possibleRights: [
        "Right to notice or notice pay in lieu: Under most employment contracts and applicable state/central labour law, an employee is entitled to a defined notice period or payment of salary in lieu of that notice before termination without cause.",
        "Right to prompt payment of all earned wages and full and final settlement including accrued leave encashment, if applicable.",
        "Right to retrenchment compensation (where the Code on Wages / Industrial Relations Code / Industrial Disputes Act applies and you are classified as a 'workman'): typically 15 days' average pay per completed year of continuous service.",
        "Right to a hearing or reasonable opportunity to respond if the termination is on disciplinary grounds.",
      ],
      relevantLaws: [
        {
          provision: "Sections 17 & 18",
          act: "Code on Wages, 2019",
          details:
            "Mandates timely payment of wages. The Code consolidates the Payment of Wages Act, 1936; the Minimum Wages Act, 1948; the Payment of Bonus Act, 1965; and the Equal Remuneration Act, 1976. Verify current enforcement status in your state.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15222",
        },
        {
          provision: "Applicable provisions on notice and retrenchment",
          act: "Industrial Relations Code, 2020 (where notified in your state) / Industrial Disputes Act, 1947 (where still applicable)",
          details:
            "Governs conditions for termination of 'workmen'. Requires prior notice or notice pay and retrenchment compensation for eligible employees. Applicability depends on your role, establishment size, and whether the Code has been notified in your state.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15221",
        },
        {
          provision: "Applicable State Shops and Commercial Establishments Act",
          act: "State-specific Shops and Commercial Establishments legislation",
          details:
            "Each state has its own Shops and Commercial Establishments Act governing employees of commercial establishments (including IT, retail, and office establishments). These Acts typically require notice or notice pay before termination. Check your state's applicable Act.",
          sourceUrl: "https://labour.gov.in",
        },
      ],
      nextSteps: [
        "Gather your employment documents: offer letter, appointment letter, employment contract, and any written termination communication.",
        "Note the classification of your role (workman or non-workman) and the type of establishment, as this affects which law applies to you.",
        "Send a formal written communication (email and registered letter) to your employer's HR/Management demanding itemised F&F settlement within a reasonable time.",
        "If wages are withheld, you can approach the Authority under the Code on Wages, 2019 (or Payment of Wages Act, 1936 if applicable in your state) or your State Labour Commissioner.",
        "Consult a qualified labour advocate or the DLSA to understand the specific law applicable to your state and designation.",
      ],
      documentsEvidence: [
        "Offer / appointment letter showing designation and notice period terms.",
        "Employment agreement or HR policy document.",
        "Recent salary slips (last 3–6 months) and bank statements showing salary credits.",
        "Written or email evidence of termination.",
        "Any performance records, appraisal letters, or communications that confirm the employment relationship.",
      ],
      professionalHelp:
        "Labour law in India is complex and jurisdiction-specific. Consult a qualified labour / employment advocate or contact the District Legal Services Authority (DLSA, Helpline: 15100) for free assistance to understand your specific rights and the applicable framework in your state.",
      followupQuestions: [
        "In which state and what type of establishment (e.g., IT company, factory, retail shop) did you work?",
        "What is your designation — were you a manager, officer, or front-line worker? (This affects which labour laws apply.)",
        "What does your employment contract say about the notice period?",
      ],
    },
    noticePrefill: {
      noticeType: "Notice for Wrongful Termination and Unpaid Wages [DEMO SAMPLE — replace with your details]",
      senderName: "[Your Full Name] — Demo Sample",
      senderAddress: "[Your Address] — Demo Sample",
      senderPhone: "[Your Phone]",
      senderEmail: "[Your Email]",
      recipientName: "[Employer / HR Head Name] — Demo Sample",
      recipientDesignation: "Authorised Signatory",
      recipientCompany: "[Company Name] — Demo Sample",
      recipientAddress: "[Company Registered Address] — Demo Sample",
      jurisdiction: "[State/UT — e.g., Haryana]",
      transactionDate: "[Date of termination]",
      amountInvolved: "[Unpaid wages and notice pay amount, if known]",
      disputeDescription:
        "[Describe your situation: your role, date of joining, date of termination, whether you received a notice or any reason, and what dues remain unpaid.] — Demo Sample — replace with your actual facts.",
      legalBasis:
        "Code on Wages, 2019 (Sections 17 & 18); applicable State Shops and Commercial Establishments Act; employment contract terms; and if applicable, the Industrial Relations Code, 2020 or Industrial Disputes Act, 1947.",
      reliefRequested:
        "[State what you are asking for, e.g.: Payment of notice pay for [X] days / months, unpaid wages for [period], and leave encashment as applicable, totalling approximately ₹[amount if known].]",
      deadlineDays: 15,
    },
  },
  {
    id: "consumer-defective-product",
    title: "Defective Product & Warranty Refusal",
    shortDescription: "Online seller refusing refund or replacement for a defective product.",
    prompt: "I purchased an expensive laptop online which was defective on arrival, and the seller/company is refusing to refund or replace it.",
    category: "Consumer Protection Law",
    structuredGuidance: {
      understanding:
        "Based on what you have shared, you purchased a product online that had a defect at or shortly after delivery, and the seller or manufacturer is refusing to honour their warranty or provide a refund or replacement.",
      legalArea: "Consumer Protection Law",
      jurisdictionNote:
        "The Consumer Protection Act, 2019 is a central legislation applicable across India. Consumer complaints can be filed at the District Consumer Disputes Redressal Commission in the district where the complainant resides or where the cause of action arose.",
      possibleRights: [
        "Right to replacement, repair, or refund for goods that have a 'defect' as defined under Section 2(10) of the Consumer Protection Act, 2019.",
        "Right to compensation for any financial loss or injury caused by the defective product under the product liability provisions (Chapter VI) of the Consumer Protection Act, 2019.",
        "Right to pursue a complaint for 'deficiency in service' if the seller or after-sales service provider fails to address the defect properly.",
        "Under the Consumer Protection (E-Commerce) Rules, 2020, e-commerce sellers are required to have a grievance redressal mechanism and must not adopt unfair trade practices.",
      ],
      relevantLaws: [
        {
          provision: "Sections 2(10), 2(11), 35–45",
          act: "Consumer Protection Act, 2019",
          details:
            "Defines 'defect' in goods and 'deficiency' in service, and establishes the consumer disputes redressal commissions at District, State, and National levels. The Act also includes product liability provisions (Chapter VI).",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/14643",
        },
        {
          provision: "Rules 5 & 6",
          act: "Consumer Protection (E-Commerce) Rules, 2020",
          details:
            "Requires e-commerce entities to ensure sellers accept returns and provide refunds for defective or damaged goods.",
          sourceUrl: "https://consumeraffairs.nic.in",
        },
      ],
      nextSteps: [
        "Preserve all purchase evidence: tax invoice, order confirmation, delivery receipt, and warranty card.",
        "Record the defect clearly with photographs or video.",
        "File a complaint through the seller's official grievance channel and retain the complaint/ticket number.",
        "Register a grievance on the National Consumer Helpline portal (consumerhelpline.gov.in) or call 1915.",
        "If not resolved within a reasonable time, you may file a consumer complaint via the e-Daakhil portal (edaakhil.nic.in) with the District Consumer Disputes Redressal Commission in your district.",
      ],
      documentsEvidence: [
        "Tax invoice and payment confirmation.",
        "Delivery receipt or courier tracking information.",
        "Photographs or video demonstrating the defect.",
        "Warranty card or warranty terms.",
        "Written complaints and responses from the seller or manufacturer's customer support.",
      ],
      professionalHelp:
        "Consumer commissions in India permit self-representation. However, for high-value claims or complex product liability issues, consulting a qualified advocate is advisable. For free assistance, contact the DLSA (Helpline: 15100).",
      followupQuestions: [
        "What is the specific defect you observed, and when did it appear — at unboxing or shortly after use?",
        "Did you record the defect with a video or photograph?",
        "Have you already raised a formal complaint with the seller or manufacturer's customer support?",
      ],
    },
    noticePrefill: {
      noticeType: "Notice for Deficiency in Service & Defective Product [DEMO SAMPLE — replace with your details]",
      senderName: "[Your Full Name] — Demo Sample",
      senderAddress: "[Your Address] — Demo Sample",
      senderPhone: "[Your Phone]",
      senderEmail: "[Your Email]",
      recipientName: "[Seller / Manufacturer Name] — Demo Sample",
      recipientDesignation: "Grievance Redressal Officer / Customer Support Head",
      recipientCompany: "[Company Name] — Demo Sample",
      recipientAddress: "[Company Registered / Correspondence Address] — Demo Sample",
      jurisdiction: "[State/UT where complaint is filed — e.g., Kerala]",
      transactionDate: "[Date of purchase / delivery]",
      amountInvolved: "[Purchase price of the product]",
      disputeDescription:
        "[Describe your situation: what you purchased, when, the defect you observed, when you reported it, and what the seller/manufacturer has said or done.] — Demo Sample — replace with your actual facts.",
      legalBasis:
        "Consumer Protection Act, 2019 (Sections 2(10), 2(11), and Chapter VI on Product Liability); Consumer Protection (E-Commerce) Rules, 2020.",
      reliefRequested:
        "[State clearly what you want: e.g., Full refund of ₹[amount], or replacement with a defect-free unit, as per the warranty terms and applicable consumer protection law.]",
      deadlineDays: 15,
    },
  },
  {
    id: "unpaid-salary-freelancer",
    title: "Unpaid Salary — Wages Withheld by Employer",
    shortDescription: "Employer has delayed salary for multiple months and is refusing to clear dues.",
    prompt: "My employer has delayed my salary for the past 3 months and is refusing to clear my dues.",
    category: "Payment of Wages & Contract Dispute",
    structuredGuidance: {
      understanding:
        "Based on what you have shared, your employer has withheld your earned wages for three months despite you continuing to perform your duties.",
      legalArea: "Labour & Employment Law — Wages",
      jurisdictionNote:
        "⚠️ The Code on Wages, 2019 consolidates earlier wage legislation and has been enacted centrally. However, enforcement depends on whether the Code has been notified and its Rules finalised in your state. In states where it is not yet in force, the Payment of Wages Act, 1936 continues to apply. Your applicable State Shops and Commercial Establishments Act may also be relevant. Please verify with a local advocate.",
      possibleRights: [
        "Right to timely payment of wages: Under the Code on Wages, 2019 (and the Payment of Wages Act, 1936 where still applicable), wages must be paid within the prescribed time — typically by the 7th or 10th of the following month.",
        "Right to claim withheld wages by approaching the Authority designated under the Code on Wages, 2019 or the Payment of Wages Act, 1936.",
        "Right to payment of all amounts owed under the employment contract, including earned salary, as a contractual and statutory entitlement.",
      ],
      relevantLaws: [
        {
          provision: "Sections 17–26",
          act: "Code on Wages, 2019",
          details:
            "Governs timely payment of wages and provides for a claims mechanism before an Authority. Consolidates the Payment of Wages Act, 1936, among others. Verify enforcement status in your state.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15222",
        },
        {
          provision: "Section 5",
          act: "Payment of Wages Act, 1936 (applicable where Code on Wages not yet notified)",
          details:
            "Requires wages to be paid on time (by 7th/10th of the following month for most establishments). Section 15 allows claims before an Authority for delayed or withheld wages.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1657",
        },
        {
          provision: "Section 73",
          act: "Indian Contract Act, 1872",
          details:
            "Allows claims for compensation for loss caused by breach of a contract — including an employer's breach of the employment agreement by not paying agreed wages.",
          sourceUrl: "https://www.indiacode.nic.in/handle/123456789/2187",
        },
      ],
      nextSteps: [
        "Gather evidence of your employment and wage entitlement: offer letter, salary slips, and bank statement showing salary credits (and the absence of credits for the unpaid months).",
        "Send a formal written communication to your employer's HR and/or management requesting payment by a specific date.",
        "If unresolved, file a claim before the Authority designated under the Code on Wages, 2019 or the Payment of Wages Act, 1936 (as applicable in your state), or approach the State Labour Commissioner.",
        "Consult a qualified advocate or the DLSA for assistance with the claim process.",
      ],
      documentsEvidence: [
        "Offer / appointment letter.",
        "Salary slips for paid months.",
        "Bank account statement showing salary credits and the gap for unpaid months.",
        "Written or email communication with HR about the salary delay.",
        "Attendance records or timesheets if available.",
      ],
      professionalHelp:
        "For salary disputes, contact the State Labour Department or approach the Authority under the applicable wage legislation. For free legal assistance, contact the District Legal Services Authority (DLSA) — Helpline: 15100.",
      followupQuestions: [
        "What type of establishment do you work in (e.g., IT company, factory, retail), and in which state?",
        "What does your employment contract say about the payment date for wages?",
        "Have you raised this with your employer's HR or management in writing?",
      ],
    },
    noticePrefill: {
      noticeType: "Notice for Non-Payment of Salary / Withheld Wages [DEMO SAMPLE — replace with your details]",
      senderName: "[Your Full Name] — Demo Sample",
      senderAddress: "[Your Address] — Demo Sample",
      senderPhone: "[Your Phone]",
      senderEmail: "[Your Email]",
      recipientName: "[Employer / HR Head Name] — Demo Sample",
      recipientDesignation: "Authorised Signatory",
      recipientCompany: "[Company Name] — Demo Sample",
      recipientAddress: "[Company Address] — Demo Sample",
      jurisdiction: "[State/UT — e.g., Punjab]",
      transactionDate: "[Period for which wages are unpaid, e.g., June–August 2024]",
      amountInvolved: "[Total unpaid salary, if known]",
      disputeDescription:
        "[Describe your situation: your role, the months for which salary has not been paid, any communications with HR, and any reason given by the employer.] — Demo Sample — replace with your actual facts.",
      legalBasis:
        "Code on Wages, 2019 (Sections 17–26) / Payment of Wages Act, 1936 (Section 5 and 15, as applicable in your state); Indian Contract Act, 1872 (Section 73); applicable State Shops and Commercial Establishments Act.",
      reliefRequested:
        "[State clearly what you want: e.g., Payment of all outstanding wages for [months] totalling approximately ₹[amount if known], within [X] days of receipt of this notice.]",
      deadlineDays: 15,
    },
  },
];

// ─── Scenario Matcher ─────────────────────────────────────────────────────────

export function findMatchingScenario(input: string): DemoScenario | undefined {
  const text = input.toLowerCase();

  if (
    (text.includes("deposit") || text.includes("security")) &&
    (text.includes("landlord") || text.includes("rent") || text.includes("return") || text.includes("refund") || text.includes("withheld") || text.includes("deduct") || text.includes("vacat"))
  ) {
    return DEMO_SCENARIOS[0];
  }
  if (
    text.includes("terminat") ||
    text.includes("fired") ||
    text.includes("notice period") ||
    text.includes("severance") ||
    text.includes("layoff") ||
    text.includes("retrench") ||
    (text.includes("final") && text.includes("salary"))
  ) {
    return DEMO_SCENARIOS[1];
  }
  if (
    text.includes("defective") ||
    text.includes("defect") ||
    ((text.includes("product") || text.includes("item") || text.includes("online") || text.includes("e-commerce") || text.includes("seller")) &&
      (text.includes("refund") || text.includes("replace") || text.includes("warranty") || text.includes("damaged") || text.includes("broken") || text.includes("faulty") || text.includes("counterfeit")))
  ) {
    return DEMO_SCENARIOS[2];
  }
  if (
    (text.includes("salary") || text.includes("wage") || text.includes("pay")) &&
    (text.includes("not paid") ||
      text.includes("unpaid") ||
      text.includes("pending") ||
      text.includes("delayed") ||
      text.includes("withheld") ||
      text.includes("clear") ||
      text.includes("dues"))
  ) {
    return DEMO_SCENARIOS[3];
  }

  return undefined;
}
