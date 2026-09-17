import { NextRequest, NextResponse } from "next/server";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], conversationId } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "A valid legal problem description is required." },
        { status: 400 }
      );
    }

    // Call Python FastAPI AI Engine
    const pyRes = await fetch("http://127.0.0.1:8000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.trim(), history }),
    });

    if (!pyRes.ok) {
      const errorText = await pyRes.text();
      throw new Error(`Python AI Engine error: ${errorText}`);
    }

    const aiResult = await pyRes.json();

    // Non-legal or ambiguous intent: return early without creating a legal case in DB
    if (!aiResult.isLegalIssue) {
      return NextResponse.json({
        success: true,
        intent: aiResult.intent || "non-legal",
        isLegalIssue: false,
        nonLegalResponse: aiResult.nonLegalResponse || "I can only assist with legal matters.",
        clarificationQuestion: aiResult.intent === "ambiguous" ? aiResult.nonLegalResponse : null,
        isDemoMode: false,
        conversationId: null,
        guidance: null,
        suggestedNoticePrefill: null,
      });
    }

    // Save to Database safely (with graceful fallback if Postgres is offline)
    let savedConvId = conversationId;
    if (!savedConvId) {
      const convRes = await safeDbQuery(
        () =>
          prisma.conversation.create({
            data: {
              title: message.slice(0, 50),
              category: aiResult.legalArea || "General",
            },
          }),
        null
      );
      if (convRes.data) {
        savedConvId = convRes.data.id;
      }
    }

    if (savedConvId) {
      await safeDbQuery(
        () =>
          prisma.message.createMany({
            data: [
              {
                conversationId: savedConvId,
                role: "user",
                content: message,
              },
              {
                conversationId: savedConvId,
                role: "assistant",
                content: JSON.stringify(aiResult),
                structuredData: JSON.stringify(aiResult),
              },
            ],
          }),
        null
      );
    }

    // Prepare Notice Prefill
    const suggestedNoticePrefill = {
      noticeType: aiResult.legalArea || "Legal Dispute Notice",
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
      legalBasis: aiResult.relevantLaws
        ? aiResult.relevantLaws.map((l: any) => `${l.act}${l.provision ? ` (${l.provision})` : ""}`).join("; ")
        : "",
      reliefRequested: "",
      deadlineDays: 15,
    };

    return NextResponse.json({
      success: true,
      intent: "legal",
      isLegalIssue: true,
      conversationId: savedConvId || "demo-session-" + Date.now(),
      guidance: aiResult,
      isDemoMode: false,
      scenarioId: null,
      suggestedNoticePrefill,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze legal problem",
        message: error.message,
        code: "AI_TIMEOUT",
      },
      { status: 500 }
    );
  }
}
