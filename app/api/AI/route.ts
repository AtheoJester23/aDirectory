import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const {pitchText}: {pitchText: string}  = await req.json();
    
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "system", content: "You are a helpful assistand that suggests or imroves startup pitch descriptions."},
                    {role: "user", content: `this is the pitch: "${pitchText}"`}
                ],
            }),
        });
    
        if(!response.ok){
            const errorText = await response.text();
            console.error("OpenAI API error: ", errorText);
            return NextResponse.json({ error: "Failed to get response from OpenAI" }, { status: 500 });
        }
    
        const data = await response.json()
    
        return NextResponse.json({ improvedPitch: data.choices[0].message.content });
    } catch (error) {
        console.error("Server error: ", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}