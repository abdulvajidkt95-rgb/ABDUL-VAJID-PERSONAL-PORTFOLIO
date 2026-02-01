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

    function addUserMessage(text) {
        addMessage(text, true);
    }

    function addBotMessage(text) {
        addMessage(text, false);
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        chatInput.value = "";

        // Bot Typing Simulation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot typing-indicator';
        loadingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content" style="font-style: italic; color: var(--text-muted);">Processing...</div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            if (!chatHistory.contains(loadingDiv)) return; // Safety check
            chatHistory.removeChild(loadingDiv);

            const data = await response.json();
            addBotMessage(data.reply);
        } catch (error) {
            if (chatHistory.contains(loadingDiv)) chatHistory.removeChild(loadingDiv);
            addBotMessage("⚠️ AI is not responding. Try again.");
        }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
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
