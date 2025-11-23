// app/api/llm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "agent-core/llm";

export async function POST(req: NextRequest) {
  const { model, messages } = await req.json();
  const result = await callLLM(model, messages);
  return NextResponse.json(result);
}
