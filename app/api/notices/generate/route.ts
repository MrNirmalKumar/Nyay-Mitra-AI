import { NextRequest, NextResponse } from "next/server";
import { buildLegalNoticeDraft, LegalNoticePayload } from "@/lib/ai/service";
import { prisma, safeDbQuery } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      noticeType,
      senderName,
      senderAddress,
      senderPhone,
      senderEmail,
      recipientName,
      recipientDesignation,
      recipientCompany,
      recipientAddress,
      jurisdiction,
      transactionDate,
      amountInvolved,
      disputeDescription,
      legalBasis,
      reliefRequested,
      deadlineDays = 15,
      conversationId,
    } = body;

    if (!noticeType || !senderName || !recipientName || !disputeDescription || !legalBasis || !reliefRequested) {
      return NextResponse.json(
        { error: "Please fill in all mandatory legal notice details." },
        { status: 400 }
      );
    }

    const payload: LegalNoticePayload = {
      noticeType,
      senderName,
      senderAddress: senderAddress || "Address as provided",
      senderPhone,
      senderEmail,
      recipientName,
      recipientDesignation,
      recipientCompany,
      recipientAddress: recipientAddress || "Address as provided",
      jurisdiction,
      transactionDate,
      amountInvolved,
      disputeDescription,
      legalBasis,
      reliefRequested,
      deadlineDays: Number(deadlineDays) || 15,
    };

    const draftText = buildLegalNoticeDraft(payload);

    // Save in Database safely (with graceful fallback if MySQL is offline)
    const noticeRecord = await safeDbQuery(
      () =>
        prisma.notice.create({
          data: {
            conversationId: conversationId || undefined,
            noticeType,
            senderDetails: JSON.stringify({
              name: senderName,
              address: senderAddress,
              phone: senderPhone,
              email: senderEmail,
            }),
            recipientDetails: JSON.stringify({
              name: recipientName,
              designation: recipientDesignation,
              company: recipientCompany,
              address: recipientAddress,
            }),
            facts: disputeDescription,
            legalBasis,
            demand: reliefRequested,
            deadlineDays: Number(deadlineDays) || 15,
            fullDraft: draftText,
            status: "generated",
          },
        }),
      null
    );

    return NextResponse.json({
      success: true,
      draftText,
      noticeId: noticeRecord.data?.id || "draft-" + Date.now(),
    });
  } catch (error) {
    console.error("Error in /api/notices/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate legal notice draft." },
      { status: 500 }
    );
  }
}
