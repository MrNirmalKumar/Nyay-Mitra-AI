export interface LegalRight {
  id: string;
  category: string;
  title: string;
  simpleExplanation: string;
  jurisdictionNote?: string;
  possibleRights: string[];
  practicalNextSteps: string[];
  applicableLaws: string[];
  sourceReference: {
    title: string;
    authority: string;
    url?: string;
  };
  keyPrecautions: string[];
}

export const LEGAL_RIGHTS_DATA: LegalRight[] = [
  {
    id: "tenant-security-deposit",
    category: "Tenant Rights",
    title: "Return of Security Deposit upon Vacating Premises",
    simpleExplanation: "Landlords cannot arbitrarily withhold security deposits without valid justification. Tenants are entitled to the return of their deposit after peaceful handover, minus only verifiable deductions for actual damage beyond normal wear and tear.",
    jurisdictionNote: "Tenancy law is state-specific in India. The Model Tenancy Act, 2021 is a central model framework that applies only in States/UTs that have adopted it. For most tenants, the applicable law is their State or UT Rent Control or Tenancy Act (e.g., Maharashtra Rent Control Act, 1999; Delhi Rent Control Act, 1958; Karnataka Rent Act, 2001) together with the Transfer of Property Act, 1882. Please verify your state's applicable legislation.",
    possibleRights: [
      "Right to return of security deposit after peaceful handover, subject only to verified, itemised deductions for actual damage (not normal wear and tear).",
      "Right to receive a written, itemised account of any proposed deductions with supporting evidence.",
      "Normal wear and tear (e.g., routine paint fading, minor age-related marks) generally cannot be deducted — verify under your state's tenancy law.",
      "Where the Model Tenancy Act, 2021 has been adopted by your state: Section 13 caps deposit at two months' rent and requires refund at the time of handing over possession."
    ],
    practicalNextSteps: [
      "Identify the applicable state or UT tenancy / rent control law — this is your primary legal reference.",
      "Document the vacated property condition with timestamped photographs and video on handover day.",
      "Obtain written acknowledgement of key handover (email, WhatsApp, or signed document).",
      "Send a formal written demand by email and registered post to the landlord.",
      "If not resolved, approach the Rent Authority or a civil court of competent jurisdiction in your area, or consult DLSA (Helpline: 15100)."
    ],
    applicableLaws: [
      "Transfer of Property Act, 1882 (Section 108) — India Code: indiacode.nic.in",
      "Applicable State/UT Rent Control or Tenancy Act — verify on your State Government portal or indiacode.nic.in",
      "Model Tenancy Act, 2021 (Section 13) — applicable only in States/UTs that have adopted this framework — MoHUA, Govt of India"
    ],
    sourceReference: {
      title: "Model Tenancy Act, 2021 & State Rent Control Legislation",
      authority: "Ministry of Housing and Urban Affairs (MoHUA), Government of India & India Code",
      url: "https://mohua.gov.in"
    },
    keyPrecautions: [
      "Do not vacate without a written handover acknowledgement.",
      "Always preserve the original rental agreement and rent payment records.",
      "The Model Tenancy Act, 2021 applies only in states that have adopted it — verify before citing it."
    ]
  },
  {
    id: "tenant-unlawful-eviction",
    category: "Tenant Rights",
    title: "Protection Against Arbitrary or Forcible Eviction",
    simpleExplanation: "A landlord cannot forcefully evict a tenant, cut off electricity or water, or lock the premises without due process of law and a valid court order.",
    jurisdictionNote: "Protection against forcible eviction is generally available under applicable state tenancy/rent control law and the Transfer of Property Act, 1882. The Model Tenancy Act, 2021 provisions (e.g., Section 21 on non-restriction of essential services) apply only in states that have adopted this framework. Verify your state's specific legislation.",
    possibleRights: [
      "Protection against disconnection of essential utilities (water, electricity) during a tenancy dispute without a court order — verify under your state's rent control or tenancy law.",
      "Right to reasonable notice before eviction as specified in the tenancy agreement and applicable state law.",
      "Protection against physical harassment, threats, or illegal lockouts.",
      "Right to peaceful enjoyment of the rented premises during the active lease term."
    ],
    practicalNextSteps: [
      "Do not sign any document under pressure or duress.",
      "If utilities are cut off, immediately approach the local Rent Authority, SDM, or Magistrate for urgent relief.",
      "If facing physical threats or illegal entry, call 112 (Police Emergency) immediately.",
      "File a police complaint for criminal trespass if unauthorised entry is attempted."
    ],
    applicableLaws: [
      "Applicable State/UT Rent Control or Tenancy Act — verify on indiacode.nic.in or State Government portal",
      "Transfer of Property Act, 1882 (Section 108) — India Code: indiacode.nic.in",
      "Specific Relief Act, 1963 (Section 6) — India Code: indiacode.nic.in",
      "Bharatiya Nyaya Sanhita, 2023 — criminal trespass and harassment provisions",
      "Model Tenancy Act, 2021 (Section 21) — only in adopting States/UTs"
    ],
    sourceReference: {
      title: "Tenancy Protections & State Rent Control Legislation",
      authority: "India Code (National Legislation Repository)",
      url: "https://www.indiacode.nic.in"
    },
    keyPrecautions: [
      "Keep digital backups of your rent agreement and payment records.",
      "Note that the Model Tenancy Act, 2021 applies only in states that have formally adopted it."
    ]
  },
  {
    id: "employee-unpaid-salary",
    category: "Employee Rights",
    title: "Right to Timely Payment of Wages and Full & Final Settlement",
    simpleExplanation: "Employers are legally required to pay earned wages on time. Arbitrary delays or withholding of earned salary is unlawful under Indian labour legislation.",
    jurisdictionNote: "The Code on Wages, 2019 is the primary central legislation on wages, consolidating earlier laws including the Payment of Wages Act, 1936. However, its enforcement depends on whether your state has notified the Code and its Rules. In states where the Code is not yet in force, the Payment of Wages Act, 1936 continues to apply. State Shops and Commercial Establishments Acts are also independently applicable for most office/commercial employees.",
    possibleRights: [
      "Right to timely payment of wages — typically by the 7th or 10th of the following month under the Code on Wages, 2019 / Payment of Wages Act, 1936 (verify current enforcement in your state).",
      "Right to a prompt Full & Final (F&F) settlement of all earned wages and applicable entitlements on separation.",
      "Right to statutory gratuity after 5 years of continuous service, under the Payment of Gratuity Act, 1972 / Code on Social Security, 2020 (verify which is in force in your state).",
      "Right to EPF/ESIC benefits as applicable under the Code on Social Security, 2020 or predecessor legislation."
    ],
    practicalNextSteps: [
      "Compile evidence of employment: offer letter, salary slips, bank statements showing salary credits.",
      "Send a formal written request to HR/Finance for itemised F&F settlement.",
      "File a claim before the Authority designated under the Code on Wages, 2019 or the Payment of Wages Act, 1936 (as applicable in your state).",
      "Contact the State Labour Commissioner or approach your applicable State's Labour Department.",
      "Consult DLSA (Helpline: 15100) for free legal assistance."
    ],
    applicableLaws: [
      "Code on Wages, 2019 (Sections 17–26) — India Code: indiacode.nic.in — verify enforcement status in your state",
      "Payment of Wages Act, 1936 (Sections 5 & 15) — applicable where Code on Wages not yet notified — India Code: indiacode.nic.in",
      "Code on Social Security, 2020 — governs Gratuity, EPF, ESIC — verify enforcement status",
      "Applicable State Shops and Commercial Establishments Act"
    ],
    sourceReference: {
      title: "Code on Wages, 2019 & Labour Ministry Resources",
      authority: "Ministry of Labour and Employment, Government of India",
      url: "https://labour.gov.in"
    },
    keyPrecautions: [
      "Do not sign 'No Dues' certificates or settlement releases until all amounts have physically cleared in your bank account.",
      "Verify which legislation is in force in your state before citing specific provisions."
    ]
  },
  {
    id: "employee-wrongful-termination",
    category: "Employee Rights",
    title: "Protection from Unlawful Termination Without Notice or Severance",
    simpleExplanation: "An employee cannot be terminated abruptly without the notice period or notice pay required by their employment contract or applicable law, except in verified cases of grave misconduct following a fair process.",
    jurisdictionNote: "Employment termination law in India depends on: (1) whether your state has notified the Industrial Relations Code, 2020 (which consolidates the Industrial Disputes Act, 1947); (2) your establishment type (factory vs. commercial office); (3) your role (workman or non-workman); and (4) your State's Shops and Commercial Establishments Act. In states where the Industrial Relations Code is not yet in force, the Industrial Disputes Act, 1947 continues to apply. Consult an advocate to identify the applicable framework.",
    possibleRights: [
      "Right to notice period or pay in lieu of notice as specified in your employment contract and the applicable state/central law.",
      "Right to retrenchment compensation for eligible 'workmen' — typically 15 days' average pay per completed year of continuous service (under applicable statute — verify in your state).",
      "Right to a fair hearing or opportunity to respond before any disciplinary termination.",
      "Right to full and final settlement of all earned dues after separation."
    ],
    practicalNextSteps: [
      "Preserve the termination letter, employment contract, offer letter, performance records, and all communications.",
      "Determine your classification (workman / manager / officer) and establishment type — this decides which law applies.",
      "Send a formal written response to the employer objecting to the termination if unlawful.",
      "Approach the Authority under the applicable wage legislation, the Labour Commissioner, or a Labour Court.",
      "Contact DLSA (Helpline: 15100) for free legal assistance."
    ],
    applicableLaws: [
      "Industrial Relations Code, 2020 — where notified in your state — India Code: indiacode.nic.in",
      "Industrial Disputes Act, 1947 — continues to apply in states where Industrial Relations Code not yet notified — India Code: indiacode.nic.in",
      "Applicable State Shops and Commercial Establishments Act",
      "Indian Contract Act, 1872 (Section 73) — India Code: indiacode.nic.in"
    ],
    sourceReference: {
      title: "Industrial Relations Code, 2020 & India Code",
      authority: "Ministry of Labour and Employment, Government of India & India Code",
      url: "https://www.indiacode.nic.in/handle/123456789/15221"
    },
    keyPrecautions: [
      "Preserve all performance records and communications prior to termination.",
      "The Industrial Disputes Act, 1947 applies differently to 'workmen' vs. managerial employees — verify your category.",
      "Verify whether the Industrial Relations Code, 2020 has been notified in your state before citing its provisions."
    ]
  },
  {
    id: "consumer-defective-goods",
    category: "Consumer Rights",
    title: "Rights against Defective Products, Deficiency in Service, and Unfair Trade",
    simpleExplanation: "Under the Consumer Protection Act, 2019, any buyer who purchases goods or services has statutory rights against manufacturing defects, deceptive advertisements, warranty denial, or substandard service delivery.",
    possibleRights: [
      "Right to repair of defect free of charge within warranty or statutory period.",
      "Right to replacement of goods if defect cannot be rectified promptly.",
      "Right to full refund with interest if the seller/manufacturer fails to honor warranty obligations.",
      "Right to claim compensation for mental agony, financial loss, or personal injury caused by defective products (Product Liability)."
    ],
    practicalNextSteps: [
      "Preserve the tax invoice, warranty card, delivery challan, and all written complaints lodged with customer care.",
      "Take photos or videos documenting the defect in operation.",
      "Register a grievance on the National Consumer Helpline (NCH - ConsumerApp / 1915 / consumerhelpline.gov.in).",
      "Issue a formal 15-day Legal Notice for Deficiency in Service.",
      "File an online consumer complaint via e-Daakhil portal (edaakhil.nic.in) before the District Consumer Disputes Redressal Commission."
    ],
    applicableLaws: [
      "Consumer Protection Act, 2019 (Section 2(10) Defect, Section 2(11) Deficiency, Section 82 Product Liability)",
      "Consumer Protection (E-Commerce) Rules, 2020",
      "Bureau of Indian Standards (BIS) Act, 2016"
    ],
    sourceReference: {
      title: "Consumer Protection Act, 2019 & E-Daakhil Portal",
      authority: "Department of Consumer Affairs, Ministry of Consumer Affairs, Food and Public Distribution",
      url: "https://consumeraffairs.nic.in"
    },
    keyPrecautions: [
      "Consumer complaints must be filed within 2 years from the date on which the cause of action arose."
    ]
  },
  {
    id: "women-workplace-posh",
    category: "Women & Workplace Rights",
    title: "Protection from Sexual Harassment at Workplace (POSH Act)",
    simpleExplanation: "Every working woman has the fundamental right to a safe, dignified, and harassment-free working environment. Workplaces with 10+ employees are mandated to constitute an Internal Committee (IC) to address complaints confidentially and impartially.",
    possibleRights: [
      "Right to lodge a confidential complaint with the Internal Committee (IC) or Local Committee (LC) within 3 months of an incident.",
      "Right to interim relief during inquiry (transfer of respondent, grant of up to 3 months paid leave).",
      "Protection from retaliation, victimization, or adverse employment action for reporting harassment.",
      "Right to an inquiry conducted in strict adherence to principles of natural justice within 90 days."
    ],
    practicalNextSteps: [
      "Maintain a private, timestamped log of all incidents, unwelcome advances, texts, emails, or witness statements.",
      "Submit a written complaint to the Presiding Officer of the Internal Committee (or Local Committee if in an unorganized sector/small employer).",
      "Utilize the SHe-Box (Sexual Harassment electronic Box) portal operated by the Ministry of Women & Child Development.",
      "For cognizable criminal acts, an FIR can also be registered at the nearest police station under Bharatiya Nyaya Sanhita (BNS)."
    ],
    applicableLaws: [
      "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act)",
      "Bharatiya Nyaya Sanhita, 2023 (Section 74 - Assault/criminal force to woman with intent to outrage modesty)",
      "Constitution of India (Articles 14, 15, and 21)"
    ],
    sourceReference: {
      title: "POSH Act, 2013 & SHe-Box Guidelines",
      authority: "Ministry of Women and Child Development, Government of India",
      url: "https://wcd.nic.in"
    },
    keyPrecautions: [
      "Confidentiality is legally mandatory under Section 16 of the POSH Act; identities cannot be published in public media."
    ]
  },
  {
    id: "cyber-online-fraud",
    category: "Cyber Crime / Online Fraud",
    title: "Rights and Immediate Remedies in Cyber Fraud, UPI Scams & Identity Theft",
    simpleExplanation: "Victims of unauthorized digital transactions, UPI phishing, identity spoofing, or online financial scams are entitled to immediate regulatory safeguards including the freezing of fraudulent funds and limited liability for unauthorized electronic banking.",
    possibleRights: [
      "Zero Liability: If unauthorized transaction is reported within 3 working days from receiving bank communication, customer has zero liability.",
      "Limited Liability: If reported within 4 to 7 working days, liability is capped at ₹5,000 to ₹25,000 depending on account type (RBI Circular).",
      "Right to immediate police registration of cyber financial fraud via the National Cyber Crime Reporting Portal.",
      "Right to request immediate account/card freeze and reversal through the bank's designated fraud monitoring cell."
    ],
    practicalNextSteps: [
      "IMMEDIATELY dial National Cyber Crime Helpline: 1930 (Golden Hour response to freeze transferred funds).",
      "Call your bank's 24x7 toll-free fraud helpline to freeze compromised accounts, cards, and UPI VPA.",
      "Register a formal cyber complaint on cybercrime.gov.in and obtain an acknowledgement number.",
      "Take screenshots of scam SMS, transaction IDs, WhatsApp chats, and bank debit alerts."
    ],
    applicableLaws: [
      "Information Technology Act, 2000 (Section 43, Section 66C Identity theft, Section 66D Cheating by personation)",
      "RBI Master Direction on Customer Protection – Limiting Liability in Unauthorized Electronic Banking Transactions (2017)",
      "Bharatiya Nyaya Sanhita, 2023 (Cheating & Fraud provisions)"
    ],
    sourceReference: {
      title: "National Cyber Crime Reporting Portal & RBI Customer Protection Circulars",
      authority: "Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs & Reserve Bank of India",
      url: "https://cybercrime.gov.in"
    },
    keyPrecautions: [
      "Never share OTP, PIN, or grant remote access (AnyDesk, TeamViewer) to unsolicited callers claiming to be bank officials."
    ]
  },
  {
    id: "constitutional-arrest-rights",
    category: "Basic Constitutional Rights",
    title: "Rights upon Police Interrogation, Detainment, and Arrest",
    simpleExplanation: "The Constitution of India and procedural criminal laws guarantee inviolable protections against arbitrary detention, custodial brutality, and denial of legal counsel.",
    possibleRights: [
      "Right to know the exact grounds of arrest and whether the alleged offence is bailable or non-bailable.",
      "Right to consult and be defended by a legal practitioner of choice (Article 22(1)).",
      "Right to free legal aid if financially indigent (Article 39A / Legal Services Authorities Act).",
      "Right to have a family member or nominated friend informed immediately upon arrest (D.K. Basu Guidelines).",
      "Mandatory production before the nearest Judicial Magistrate within 24 hours of arrest (Article 22(2)).",
      "Women cannot be arrested after sunset and before sunrise except in extraordinary circumstances with prior judicial magistrate permission."
    ],
    practicalNextSteps: [
      "Ask to see the arrest memo signed by the arresting officer and counter-sign only after verifying time and date.",
      "Request a medical examination upon arrest to document physical condition.",
      "Do not make signed statements or confessions in police custody (inadmissible under Indian evidence laws).",
      "Contact the District Legal Services Authority (DLSA) for instant free legal representation if unrepresented."
    ],
    applicableLaws: [
      "Constitution of India (Articles 20, 21, 22, 39A)",
      "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) / Code of Criminal Procedure (CrPC Section 41, 50, 50A, 57)",
      "Legal Services Authorities Act, 1987"
    ],
    sourceReference: {
      title: "D.K. Basu Guidelines on Arrest & Custody / BNSS Provisions",
      authority: "Supreme Court of India & National Legal Services Authority (NALSA)",
      url: "https://nalsa.gov.in"
    },
    keyPrecautions: [
      "Always memorize or carry an emergency family contact and consult a qualified criminal defense counsel immediately."
    ]
  },
  {
    id: "personal-loan-recovery",
    category: "Personal/Financial disputes",
    title: "Protection Against Harassment by Bank Recovery Agents & Loan Apps",
    simpleExplanation: "Borrowers facing financial distress are protected by RBI Fair Practices Code against abusive calls, threats, public shaming, visits at odd hours, or unauthorized contact of third-party phone contacts.",
    possibleRights: [
      "Recovery agents can only contact borrowers between 8:00 AM and 7:00 PM.",
      "Strict ban on physical intimidation, abusive language, or public humiliation.",
      "Strict prohibition against contacting family, friends, or accessing phone contact lists (illegal loan apps).",
      "Right to receive authentic identity credentials and bank authorization letters from visiting agents."
    ],
    practicalNextSteps: [
      "Record audio/video proof of abusive phone calls or unannounced home visits.",
      "Send a written grievance to the Principal Nodal Officer of the lending bank or NBFC.",
      "Lodge a complaint on the RBI CMS portal (cms.rbi.org.in) under the Integrated Ombudsman Scheme.",
      "For unauthorized predatory loan apps practicing extortion, lodge an immediate FIR under extortion and cyber blackmail."
    ],
    applicableLaws: [
      "RBI Master Circular on Loans and Advances – Fair Practices Code",
      "RBI Circular on Outsourcing of Financial Services & Recovery Agents Guidelines (August 2022)",
      "Bharatiya Nyaya Sanhita, 2023 (Extortion, Criminal Intimidation)"
    ],
    sourceReference: {
      title: "Fair Practices Code & Reserve Bank - Integrated Ombudsman Scheme, 2021",
      authority: "Reserve Bank of India (RBI)",
      url: "https://cms.rbi.org.in"
    },
    keyPrecautions: [
      "Never install unverified APK loan apps from social media links requesting gallery and contacts permissions."
    ]
  },
  {
    id: "education-fee-refund",
    category: "Education/Student-related issues",
    title: "Student Rights: Fee Refund on College Withdrawal & Certificate Retention",
    simpleExplanation: "Educational institutions are prohibited by UGC and AICTE regulations from retaining original educational certificates or withholding lawful fee refunds when a student withdraws admission within regulatory cut-off windows.",
    possibleRights: [
      "Right to 100% or proportioned refund of fees as per the statutory UGC Fee Refund Policy when withdrawal is initiated within deadline.",
      "Strict prohibition against colleges retaining original school/degree certificates as hostage for fees.",
      "Right to non-discriminatory treatment, fair grading review, and transparent grievance redressal mechanism on campus."
    ],
    practicalNextSteps: [
      "Submit formal withdrawal notice via registered email and speed post before the university's specified cut-off date.",
      "Quote the relevant UGC/AICTE Public Notice on Fee Refund in all correspondence.",
      "If the institute refuses, submit an online complaint on the UGC e-Samadhan portal (samadhan.ugc.ac.in).",
      "Approach the State Higher Education Council or file a consumer complaint for unfair trade practice."
    ],
    applicableLaws: [
      "University Grants Commission (UGC) Guidelines on Fee Refund and Retention of Original Certificates",
      "AICTE Approval Process Handbook – Student Redressal Regulations",
      "Consumer Protection Act, 2019"
    ],
    sourceReference: {
      title: "UGC Fee Refund Policy & Redressal Regulations",
      authority: "University Grants Commission (UGC), Ministry of Education",
      url: "https://www.ugc.gov.in"
    },
    keyPrecautions: [
      "Always preserve postal receipts, speed post tracking acknowledgements, and email delivery timestamps."
    ]
  }
];

export const CATEGORIES = [
  "All Categories",
  "Tenant Rights",
  "Employee Rights",
  "Consumer Rights",
  "Women & Workplace Rights",
  "Cyber Crime / Online Fraud",
  "Basic Constitutional Rights",
  "Personal/Financial disputes",
  "Education/Student-related issues"
];
