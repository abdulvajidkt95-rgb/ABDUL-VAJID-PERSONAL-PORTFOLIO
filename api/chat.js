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

        return res.status(200).json({
            reply: data.choices[0].message.content,
        });
    } catch (error) {
        return res.status(500).json({
            reply: "❌ AI error. Please try again later.",
        });
    }
}
