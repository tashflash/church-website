/**
 * FLAMES OF REVIVAL - MASTER SCRIPT 2026
 * Features: Bible API, Scroll Animations, Live Countdown, Interactive Clipboard
 */

// 1. DYNAMIC BIBLE VERSE API
async function fetchDailyVerse() {
    const verseText = document.getElementById('verse-text');
    const verseRef = document.getElementById('verse-ref');

    try {
        const response = await fetch('https://labs.bible.org/api/?passage=votd&type=json');
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        // Smoothly fade in the text
        verseText.style.opacity = 0;
        setTimeout(() => {
            verseText.innerText = `"${data[0].text}"`;
            verseRef.innerText = `- ${data[0].bookname} ${data[0].chapter}:${data[0].verse}`;
            verseText.style.opacity = 1;
        }, 500);
    } catch (error) {
        verseText.innerText = "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.";
        verseRef.innerText = "- Jeremiah 29:11";
    }
}

function updateCountdown() {
    const now = new Date();
    
    // Define your 4 weekly services (0=Sun, 3=Wed, 4=Thu)
    const services = [
        { day: 3, hour: 17, min: 0, label: "Mid-week (Wed)" }, // Wed 5pm
        { day: 4, hour: 15, min: 0, label: "Thursday Service" },     // Thu 3pm
        { day: 0, hour: 8,  min: 0, label: "1st Sunday Service" },   // Sun 8am
        { day: 0, hour: 10, min: 0, label: "2nd Sunday Service" }    // Sun 10am
    ];

    let nextService = null;
    let minDiff = Infinity;

    services.forEach(service => {
        let target = new Date(now);
        // Calculate days until this service day
        let daysUntil = (service.day - now.getDay() + 7) % 7;
        
        target.setDate(now.getDate() + daysUntil);
        target.setHours(service.hour, service.min, 0, 0);

        // If the service already passed today, move to next week
        if (target <= now) {
            target.setDate(target.getDate() + 7);
        }

        let diff = target - now;
        if (diff < minDiff) {
            minDiff = diff;
            nextService = { date: target, label: service.label };
        }
    });

    // Display the logic
    const countdownEl = document.getElementById('countdown-timer');
    if (countdownEl && nextService) {
        const days = Math.floor(minDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((minDiff / (1000 * 60)) % 60);

        countdownEl.innerHTML = `
            <div style="color: var(--accent); font-size: 0.9rem; margin-bottom: 5px;">
                Next: ${nextService.label}
            </div>
            <div style="font-size: 1.4rem;">
                ${days}d ${hours}h ${mins}m 
            </div>
        `;
    }
}

// 3. INTERACTIVE CLIPBOARD (MOBILE MONEY)
function copyCode(id) {
    const codeText = document.getElementById(id).innerText;
    const btn = document.querySelector(`button[onclick="copyCode('${id}')"]`);
    const originalText = btn.innerText;

    navigator.clipboard.writeText(codeText).then(() => {
        btn.innerText = "COPIED! ✅";
        btn.style.background = "#22c55e"; // Success Green
        btn.style.transform = "scale(1.05)";
        
        // Haptic-like feedback for mobile
        if (window.navigator.vibrate) window.navigator.vibrate(50);

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = ""; 
            btn.style.transform = "";
        }, 2000);
    });
}

// 4. SCROLL REVEAL ANIMATION
const revealOnScroll = () => {
    const cards = document.querySelectorAll('.card');
    const windowHeight = window.innerHeight;

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight - 100) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
};

// 5. MOUSE/TOUCH GLOW EFFECT (The "Stunning" Background)
function initGlow() {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        document.body.style.background = `radial-gradient(circle at ${x}px ${y}px, #1e293b 0%, #0f172a 40%)`;
    });
}

// INITIALIZE EVERYTHING
window.addEventListener('DOMContentLoaded', () => {
    fetchDailyVerse();
    initGlow();
    
    // Set initial state for animations
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.8s ease-out";
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once for items already in view

    // Run countdown every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
});
