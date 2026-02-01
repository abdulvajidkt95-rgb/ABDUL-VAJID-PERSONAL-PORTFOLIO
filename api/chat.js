export default async function handler(req, res) {
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Set (Safe check)" : "Undefined");
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are vaji’s AI assistant for a personal portfolio website. Be friendly, clear, and helpful.",
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(response.status).json({
                reply: `❌ OpenAI Error: ${data.error.message}`
            });
        }

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({
                reply: "❌ AI Error: Received an empty or invalid response from OpenAI."
            });
        }

        return res.status(200).json({
            reply: data.choices[0].message.content,
        });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        return res.status(500).json({
            reply: `❌ AI Error: ${error.message}. Please check your API key and connection.`
        });
    }
}
