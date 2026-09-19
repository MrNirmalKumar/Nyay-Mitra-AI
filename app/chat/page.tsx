"use client";

import React, { Suspense } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Scale } from "lucide-react";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
          <Scale className="w-6 h-6 animate-spin text-gold-400 mr-2" />
          <span>Loading Legal Consultation Room...</span>
        </div>
      }
    >
      <ChatInterface />
    </Suspense>
  );
}
