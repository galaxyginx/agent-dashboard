// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Message } from "../../../lib/agent/types"; // submodule 側の型パスに合わせて調整
import { createAgent } from "../../../lib/agent";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "invalid messages" }, { status: 400 });
    }

    const agent = createAgent();
    const result = await agent.run(messages); // { role, content }
    return NextResponse.json({ result });
  } catch (err: any) {
    console.error("agent api error", err);
    return NextResponse.json({ error: err?.message ?? "unknown" }, { status: 500 });
  }
}
