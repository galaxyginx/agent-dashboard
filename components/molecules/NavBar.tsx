'use client'

import { ViewProps } from "@/types";
import { useState } from "react";
import { Button } from "../ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

export function NavBar({ masterData, t }: ViewProps) {
    const [model, setModel] = useState("llama");
    return <div className="flex justify-between items-center p-2 px-4">
        <div className="flex items-center gap-2">
          <select value={model} onChange={e => setModel(e.target.value)} className="border p-2">
            <option value="chatgpt">ChatGPT</option>
            <option value="claude">Claude</option>
            <option value="llama">Local Llama</option>
          </select>
        </div>
        {masterData.authUser ? (
          <Button onClick={() => supabaseBrowser().auth.signOut()} className="border p-2">
            Sign out
          </Button>
        ) : (
          <Button onClick={() => supabaseBrowser().auth.signInWithOAuth({ provider: "google" })} className="border p-2">
            Sign in
          </Button>
        )}
      </div>
}