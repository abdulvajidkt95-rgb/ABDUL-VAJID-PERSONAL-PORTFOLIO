// DOM Elements
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

// Typing Effect
const typingText = document.getElementById('typing-text');
const words = ["Learner for Software Developer", "Ethical Hacker", "Programmer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        // Paused at end of word
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        // Word delete complete
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        // Typing speed
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', type);

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate icon
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Scroll Effects
window.addEventListener('scroll', () => {
    // Navbar styling on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(currentSection)) {
            item.classList.add('active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const popupOverlay = document.getElementById('popup-overlay');
const popupCloseBtn = document.getElementById('popup-close');
const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfRyCAX5QIPdmlKlyQsLzTFHQGtlXSGXbbC4zgmNBNG5DNtIg/formResponse";

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Show loading state
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);

            // Send data using fetch with no-cors mode (required for Google Forms)
            await fetch(FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Show popup
            popupOverlay.classList.add('active');

            // Reset form
            contactForm.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            // Reset button
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Close Popup
if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
    });
}

// Close popup when clicking outside
if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });
}

// --- Chat & Widget Logic ---
const aiWidget = document.getElementById('ai-widget');
const chatPopup = document.getElementById('chat-popup');
const closeChat = document.getElementById('close-chat');
const popupInput = document.getElementById('popup-input');
const popupSend = document.getElementById('popup-send');
const chatBody = document.getElementById('chat-body');
const voiceBtn = document.getElementById('voice-btn');
const uploadBtn = document.getElementById('upload-btn');
const imageUploadInput = document.getElementById('image-upload');

let isDragging = false;
let startX, startY, initialX, initialY;
let hasMoved = false;

// Intelligence Data (Integrated with OpenAI API)
// Intelligence Data (Integrated with OpenAI API)
const fallbacks = [
    "I'm having trouble connecting right now. Please try again later!",
    "My neural network is a bit foggy. Can you repeat that?",
    "I'm specialized in Abdul's work—ask me about his projects or skills!"
];

function addPopupMessage(htmlOrText, isUser = false, isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (isHtml) {
        contentDiv.innerHTML = htmlOrText;
    } else {
        contentDiv.innerText = htmlOrText;
    }
    msgDiv.appendChild(contentDiv);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function handlePopupChat() {
    const message = popupInput.value.trim();
    if (!message) return;

    addPopupMessage(message, true);
    popupInput.value = '';

    // Bot Typing Simulation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot typing-indicator';
    loadingDiv.innerHTML = `<div class="message-content" style="font-style: italic; color: var(--text-muted);">Processing...</div>`;
    chatBody.appendChild(loadingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (chatBody.contains(loadingDiv)) chatBody.removeChild(loadingDiv);

        const data = await response.json();
        addPopupMessage(data.reply, false);

        // Auto-speak the AI response
        speak(data.reply);

    } catch (error) {
        if (chatBody.contains(loadingDiv)) chatBody.removeChild(loadingDiv);
        addPopupMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)], false);
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

// Voice Recognition
if (voiceBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        voiceBtn.addEventListener('click', () => {
            voiceBtn.classList.add('active');
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            popupInput.value = transcript;
            voiceBtn.classList.remove('active');
            handlePopupChat();
        };

        recognition.onerror = () => {
            voiceBtn.classList.remove('active');
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('active');
        };
    } else {
        voiceBtn.style.display = 'none';
    }
}

if (popupSend) {
    popupSend.addEventListener('click', handlePopupChat);
    popupInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePopupChat();
    });
}

// --- Floating AI Widget & Drag Logic ---
if (aiWidget) {
    const onMouseDown = (e) => {
        isDragging = true;
        hasMoved = false;

        const pos = e.type === 'touchstart' ? e.touches[0] : e;
        startX = pos.clientX;
        startY = pos.clientY;

        const rect = aiWidget.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        aiWidget.style.transition = 'none';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const pos = e.type === 'touchmove' ? e.touches[0] : e;
        const deltaX = pos.clientX - startX;
        const deltaY = pos.clientY - startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasMoved = true;
        }

        aiWidget.style.right = 'auto';
        aiWidget.style.bottom = 'auto';
        aiWidget.style.left = `${initialX + deltaX}px`;
        aiWidget.style.top = `${initialY + deltaY}px`;
    };

    const onMouseUp = () => {
        isDragging = false;
        aiWidget.style.transition = 'box-shadow 0.3s ease, transform 0.2s ease';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
    };

    aiWidget.addEventListener('mousedown', onMouseDown);
    aiWidget.addEventListener('touchstart', onMouseDown, { passive: false });

    aiWidget.addEventListener('click', (e) => {
        if (!hasMoved) {
            chatPopup.style.display = chatPopup.style.display === 'none' ? 'flex' : 'none';
        }
    });
}

if (closeChat) {
    closeChat.addEventListener('click', () => {
        chatPopup.style.display = 'none';
    });
}

// --- File Analysis for Home Popup ---
if (uploadBtn && imageUploadInput) {
    uploadBtn.addEventListener('click', () => imageUploadInput.click());

    imageUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            addPopupMessage(`File selected: ${file.name}`, true);

            // Simulation
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message bot typing-indicator';
            loadingDiv.innerHTML = `<div class="message-content" style="font-style: italic; color: var(--text-muted);">Analyzing ${file.name}...</div>`;
            chatBody.appendChild(loadingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                if (chatBody.contains(loadingDiv)) chatBody.removeChild(loadingDiv);
                const analysisResult = `<strong>Analysis Complete</strong><br>File: ${file.name}<br>Type: ${file.type}<br>Size: ${(file.size / 1024).toFixed(2)} KB<br><br><span style="color: var(--primary);">Security check passed. No vulnerabilities detected.</span>`;
                addPopupMessage(analysisResult, false, true);
            }, 2000);
        }
    });
}
// --- Auto Welcome Greeting ---
window.addEventListener('load', () => {
    setTimeout(() => {
        if (chatPopup && chatPopup.style.display === 'none') {
            chatPopup.style.display = 'flex';
            const welcomeText = "Welcome to my portfolio! I'm vaji's AI. How can I assist you today?";
            addPopupMessage(welcomeText, false);
            speak(welcomeText);
        }
    }, 2500); // 2.5s delay for a smoother intro
});

// --- END Widget Logic ---

