"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ShortMemory } from "agent-core/types";
import { ViewProps } from "@/types";
import { Indicator } from "@/components/Indicator";
import { supabaseBrowser } from '@/lib/supabase/client'
import { Card } from "../ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "../ui/input-group";
import { ArrowUpIcon } from "lucide-react";
import { ENDPOINT } from "@/requests/Config";

export default function ChatView({ masterData, t, isMobile }: ViewProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState("llama");
    const supabase = supabaseBrowser()
    const shortTermMemory = useRef<ShortMemory[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (isMobile) setIsClient(true);
    }, [isMobile]);
    
    async function send() {
        if (loading) return;
        if (!input.trim()) return;
        setLoading(true);
        const newMessage = { role: "You", content: input.trim(), id: '' } as Message
        setMessages(prev => [...prev, newMessage]);
        setInput("");

        try {
            const res = await fetch(ENDPOINT + "agent", {
                method: "POST",
                body: JSON.stringify({ model, message: newMessage, recentConversations: shortTermMemory.current })
            })
            const data = await res.json();
            if (data?.result) {
                shortTermMemory.current.push({user_id: (await supabase.auth.getUser()).data.user?.id ?? 'guest', content: newMessage.content})
                setMessages(prev => [...prev, { role: "Agent", content: data.result.content, id: '' } as Message]);
                shortTermMemory.current.push({user_id: 'Agent', content: data.result.content})
                if (shortTermMemory.current.length > 10) shortTermMemory.current.shift()
            } else {
                setMessages(prev => [...prev, { role: "Agent", content: t.error.something_went_wrong, id: '' } as Message]);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: "Agent", content: "Network error", id: '' } as Message]);
        } finally {
            setLoading(false);
        }
    }

    // isClientがtrue（クライアント側でのマウント後）になるまで、inputを含む部分をレンダリングしない
    if (isMobile && !isClient) {
        return <div className="w-full tablet:px-16">
            <div className="flex-1 flex items-center justify-center">
                Loading form...
            </div>
        </div>;
    }

    return (
        <div className="flex flex-col w-full px-4">
            {messages.length > 0 ? <div className="flex flex-col h-[77vh] py-2 tablet:mx-96 overflow-y-scroll">
                {messages.map((m, i) => {
                    if (m.role === "Agent") {
                        return <div key={i} className="p-2 self-start">
                                {m.content}
                            </div>
                    } else {
                        return <Card key={i} className="p-2 px-4 bg-gray-700 rounded-2xl max-w-[50%] self-end text-white border-none">
                                {m.content}
                            </Card>
                    }
                })}
                {loading && <div className="flex mb-2">
                    <Indicator />
                </div>}
            </div>: <div className="flex w-full h-[200px] items-center justify-center p-4">
                <h1 className="text-4xl">{t.greeting}</h1>
            </div>}

            {/* <div className="flex-1 flex items-center justify-center">
                <div className="w-[90%] self-center flex flex-col bg-gray-800 rounded-2xl px-4 py-2 tablet:w-[50%] laptop:w-[50%]">
                    <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 text-white focus:outline-none w-full" onKeyDown={e => e.key === "Enter" && (e.nativeEvent as KeyboardEvent).isComposing === false && send()} placeholder={t.input_placeholder}/>
                    <div className="flex-1 flex justify-between">
                        <div className="flex-1"></div>
                        <Button onClick={send} className="bg-blue-500 text-white rounded-full" disabled={loading}>
                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/>
                            </svg>
                        </Button>
                    </div>
                </div>
            </div> */}
            <div className="flex-1 flex items-center justify-center">
                <div className="flex-1 self-center flex flex-col bg-gray-800 rounded-2xl py-2 border-none focus:outline-none tablet:mx-96">
                    <InputGroupTextarea value={input} onChange={e => setInput(e.target.value)} className="focus:outline-none px-4" onKeyDown={e => { if (e.key === "Enter" && (e.nativeEvent as KeyboardEvent).isComposing === false) { e.preventDefault(); send() } }} placeholder={t.input_placeholder} />
                    <InputGroupAddon align="block-end">
                        <InputGroupButton className="rounded-full focus:bg-transparent">
                            <svg className=" text-white focus:outline-none focus:bg-transparent" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
                            </svg>
                        </InputGroupButton>
                        <InputGroupText className="ml-auto">52% used</InputGroupText>
                        <InputGroupButton variant="default" className="rounded-full bg-blue-500" onClick={send}>
                            <ArrowUpIcon />
                            <span className="sr-only">Send</span>
                        </InputGroupButton>
                    </InputGroupAddon>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                {!masterData.authUser && <p className="text-gray-500">{t.chat_note}</p>}
            </div>
        </div>
    );
}
