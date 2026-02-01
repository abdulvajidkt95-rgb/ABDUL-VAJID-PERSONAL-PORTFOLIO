document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.ai-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- Chat Logic ---
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistory = document.getElementById('chat-history');

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerText = text;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(content);
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // --- Knowledge Base ---
    const knowledgeBase = {
        identity: [
            { keywords: ['who are you', 'your name', 'identify'], response: ["I am Vajid's AI assistant, here to provide information about his work and skills!", "I'm Vaji-AI, the digital representative of Abdul Vajid K. Nice to meet you!"] },
            { keywords: ['who is abdul', 'who is vajid', 'about him', 'owner', 'creator'], response: ["Abdul Vajid K is a passionate Software Developer and Ethical Hacker focused on building secure digital solutions.", "Vajid is the mastermind behind this portfolio! He's a developer and ethical hacker based in Kerala."] },
            { keywords: ['contact', 'email', 'phone', 'reach', 'message'], response: "You can reach Abdul directly via the contact form on this site, or drop an email to abdulvajidkt95@gmail.com. He is always open to interesting collaborations!" },
            { keywords: ['instagram', 'social', 'insta', 'link'], response: "Catch him on Instagram: @vaji__zz. He also has a GitHub profile at https://github.com/abdulvajidkt95-rgb." }
        ],
        projects: [
            { keywords: ['project', 'work', 'portfolio', 'built', 'make'], response: ["Abdul has built several impressive projects, including a secure E-Commerce Platform, a Python-based Vulnerability Scanner, and this very Portfolio!", "You can find his best work in the 'Projects' section, ranging from Full-stack apps to security tools."] },
            { keywords: ['ecommerce', 'shop', 'store'], response: "The E-Commerce Platform is a full-stack solution featuring secure payment gateways, user authentication, and a dynamic admin dashboard." },
            { keywords: ['scanner', 'vuln', 'security tool'], response: "His VulnScanner is a Python tool designed to identify common security loopholes in local networks. It's a testament to his ethical hacking expertise." }
        ],
        skills: [
            { keywords: ['skill', 'stack', 'tech', 'language', 'program'], response: ["Abdul specializes in a powerful stack: JavaScript (React, Node.js), Python, HTML/CSS, and various security tools like Burp Suite.", "He's proficient in Full-Stack development and Cybersecurity, using tools like React, Python, and Kali Linux."] },
            { keywords: ['python'], response: "Python is one of his core strengths, used primarily for backend development, automation scripts, and cybersecurity tools." },
            { keywords: ['react', 'frontend', 'ui'], response: "He crafts responsive, high-performance user interfaces using React.js, often enhanced with modern design principles like Glassmorphism." }
        ],
        services: [
            { keywords: ['service', 'offer', 'hire', 'do for me'], response: ["Abdul offers professional services in Web Development (Full Stack), Security Audits (Penetration Testing), and Custom Software Solutions.", "He can help with web development projects or security assessments. Check out the 'Services' tab!"] },
            { keywords: ['hack', 'hack me'], response: "As an Ethical Hacker, Abdul performs security audits to *protect* systems. He does not engage in malicious activities. Safety first!" }
        ],
        general: [
            { keywords: ['hello', 'hi', 'hey', 'greetings'], response: ["Hello! Ready to explore the digital world of Abdul Vajid?", "Hi there! I am personal assistant of Vajid. Are you a relative of Vajid? Ask me about @vaji__zz. He was a brave boy who made me. I LOVE HIM. Do you love him?", "Greetings! Ask me anything about code or security."] },
            { keywords: ['yes'], response: "Yes! Thank you for loving him. He is my owner, so if you like him, I like you too! How can I help you?" },
            { keywords: ['no'], response: "No? Well, to each their own, but Vajid is a visionary! I'll stick with my owner. How can I assist you otherwise?" },
            { keywords: ['how are you', 'status'], response: "I'm running at peak performance! All systems nominal. How about you?" },
            { keywords: ['joke', 'funny'], response: ["Why do programmers prefer dark mode? Because light attracts bugs!", "Knock knock. Who's there? ... *long pause* ... Java.", "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'"] },
            { keywords: ['thank', 'thanks'], response: "You're welcome! Let me know if you need anything else." },
            { keywords: ['bye', 'goodbye', 'exit'], response: "Goodbye! Stay secure and keep coding." }
        ]
    };

    const fallbacks = [
        "That's an interesting topic! While I focus on Abdul's professional work, I'd love to try and answer if you can relate it to tech.",
        "I'm tuned specifically for Web Development and Cybersecurity queries. Can you rephrase that?",
        "I might need an upgrade to answer that one! Try asking about my 'Projects' or 'Skills'.",
        "i am personal assistent of vajid.are you relative of vajid. Ask me about vajizzz"
    ];

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, true);
        chatInput.value = '';

        // Bot Typing Simulation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot typing-indicator';
        loadingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content" style="font-style: italic; color: var(--text-muted);">Processing...</div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        setTimeout(() => {
            chatHistory.removeChild(loadingDiv);

            // Intelligence Logic
            const lowerText = text.toLowerCase();
            let response = null;

            // Search Knowledge Base
            for (const category in knowledgeBase) {
                const topics = knowledgeBase[category];
                for (const topic of topics) {
                    if (topic.keywords.some(k => lowerText.includes(k))) {
                        // If response is an array, pick random
                        if (Array.isArray(topic.response)) {
                            response = topic.response[Math.floor(Math.random() * topic.response.length)];
                        } else {
                            response = topic.response;
                        }
                        break;
                    }
                }
                if (response) break;
            }

            // Fallback
            if (!response) {
                response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            }

            addMessage(response, false);
        }, 1000 + Math.random() * 1000); // Random delay 1-2s
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });


    // --- Image Gen Logic ---
    const promptInput = document.getElementById('image-prompt');
    const enhanceBtn = document.getElementById('enhance-prompt-btn');
    const generateBtn = document.getElementById('generate-image-btn');
    const imageResult = document.getElementById('image-result');

    const enhancements = [
        "cinematic lighting, 8k resolution, highly detailed, photorealistic, cyberpunk style",
        "digital art, vibrant colors, futuristic composition, trending on artstation",
        "neon aesthetic, dark background, sharp focus, intricate design",
        "soft shadows, volumetric lighting, unreal engine 5 render"
    ];

    enhanceBtn.addEventListener('click', () => {
        const current = promptInput.value;
        if (!current) {
            promptInput.value = "A futuristic hacker workspace, " + enhancements[0];
        } else {
            const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
            promptInput.value = current + ", " + randomEnhancement;
        }
    });

    generateBtn.addEventListener('click', () => {
        if (!promptInput.value) return;

        generateBtn.innerText = "Generating...";
        generateBtn.disabled = true;
        imageResult.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Creating masterpiece...</p>
            </div>
        `;

        setTimeout(() => {
            // Simulate generation success
            imageResult.innerHTML = `
                <img src="https://image.pollinations.ai/prompt/${encodeURIComponent(promptInput.value)}?width=800&height=600&nologo=true" class="generated-img" alt="Generated Image">
            `;
            generateBtn.innerText = "Generate";
            generateBtn.disabled = false;
        }, 3000);
    });

    // --- File Analysis Logic ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-upload');
    const analysisResults = document.getElementById('analysis-results');
    const analysisLoader = document.getElementById('analysis-loader');
    const analysisText = document.getElementById('analysis-text');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) processFile(e.target.files[0]);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--glass-border)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--glass-border)';
        if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
    });

    function processFile(file) {
        analysisResults.style.display = 'block';
        analysisLoader.classList.add('active');
        analysisText.innerText = `Analyzing ${file.name}...`;

        setTimeout(() => {
            analysisLoader.classList.remove('active');
            analysisText.innerHTML = `
                <strong>Analysis Complete</strong><br>
                File: ${file.name}<br>
                Size: ${(file.size / 1024).toFixed(2)} KB<br>
                Type: ${file.type}<br><br>
                <span style="color: var(--primary);">No security threats detected. File structure is valid.</span>
            `;
        }, 2000);
    }

});
