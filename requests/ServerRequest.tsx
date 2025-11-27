import { supabaseServer } from "@/agent-core/lib/supabase/server";
import { ENDPOINT } from "./Config";

export const authHeaders = async () => ({ 'Content-Type': 'application/json', 'Cookie': `access_token=${await getToken()}` })

export async function sendDefaultRequest({ path, options }: { path: string, options: RequestInit }) {
    try {
        const res = await fetch(ENDPOINT + path, options)
        const data = await res.json()
        if (res.status === 200)
            return data.data
        else
            return []
    } catch (error: any) {
        return null
    }
}

export async function getToken() {
    const supabase = supabaseServer()
    return (await supabase.auth.getSession()).data.session?.access_token
}

export async function getMasterData() {
    const options: RequestInit = {
        method: 'GET',
        credentials: 'include',
        headers: await authHeaders(),
        cache: 'force-cache'
    };
    return sendDefaultRequest({ path: 'masterdata', options })
}