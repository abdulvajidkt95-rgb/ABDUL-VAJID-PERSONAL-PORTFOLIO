export default async function handler(req, res) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Hello AI, are you working?" }],
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return res.status(200).send(data.choices[0].message.content);
    } catch (error) {
        console.error("AI connection failed:", error);
        return res.status(500).send("AI connection failed: " + error.message);
    }
}
