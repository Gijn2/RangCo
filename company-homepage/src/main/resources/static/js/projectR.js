/**
 * Project R & Mandao Unified Engine
 */

const App = {
    init() {
        this.setupCanvas();
        this.handleScroll();
        this.setupVerification();
        this.observeElements();
        window.addEventListener('scroll', () => this.handleScroll());
    },

    // 1. Interactive Particle Canvas
    setupCanvas() {
        const canvas = document.getElementById('connection-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
            ctx.lineWidth = 0.5;

            particles.forEach((p, i) => {
                p.update();
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    },

    // 2. Scroll Progress & Abyss Trigger
    handleScroll() {
        const scroll = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scroll / docHeight) * 100;

        // Update Progress Ring
        const circle = document.getElementById('fragment-progress');
        if (circle) {
            const radius = 40;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
            document.getElementById('fragment-percent').innerText = Math.floor(progress);
        }

        // Abyss Auto-Lock
        const abyss = document.getElementById('sector-abyss');
        if (abyss && scroll > abyss.offsetTop - 300 && !localStorage.getItem('verified')) {
            this.showOverlay();
        }
    },

    // 3. Age Verification
    showOverlay() {
        const overlay = document.getElementById('verification-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    verifyAge() {
        const input = document.getElementById('age-input').value;
        if (!input) return alert("Please select your birthdate.");

        const age = new Date().getFullYear() - new Date(input).getFullYear();
        if (age >= 19) {
            localStorage.setItem('verified', 'true');
            document.getElementById('verification-overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        } else {
            alert("This sector is restricted to adults only.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    // 4. Reveal Animations
    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.booth-card, .facility-gallery > div').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "1s cubic-bezier(0.2, 0.8, 0.2, 1)";
            observer.observe(el);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());