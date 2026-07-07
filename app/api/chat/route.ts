import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(
    "API Key:",
    process.env.OPENROUTER_API_KEY ? "Loaded" : "Missing"
  );

  const { prompt } = await req.json();

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert React, Next.js and Tailwind developer. Return only code.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log("HTTP Status:", response.status);
  console.log("OpenRouter Response:", JSON.stringify(data, null, 2));

  if (!response.ok) {
  return NextResponse.json(
    {
      error: data.error?.message,
    },
    { status: response.status }
  );
}

 return NextResponse.json({
  code: data.choices[0].message.content,
 });

}