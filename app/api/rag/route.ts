// app/api/rag/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchVectorDB } from "agent-core/rag";
import { callLLM } from "agent-core/llm";

export async function POST(req: NextRequest) {
  const { model, query } = await req.json();

  const context = await searchVectorDB(query);

  const messages = [
    { role: "system", content: "Use the following context:\n" + context },
    { role: "user", content: query }
  ];

  const res = await callLLM(model, messages);
  return NextResponse.json(res);
}
