/**
 * Rang Universal City: 통합 제어 시스템
 */

// --- [State & DOM Elements] ---
const DOM = {
    canvas: document.getElementById('connection-canvas'),
    circle: document.getElementById('fragment-progress'),
    percent: document.getElementById('fragment-percent'),
    rangMsg: document.getElementById('rang-message'),
    overlay: document.getElementById('verification-overlay'),
    sectorAbyss: document.getElementById('sector-abyss'),
    mapItems: document.querySelectorAll('.map-item'),
    mandaoBtn: document.getElementById('mandaoReserveBtn')
};

const State = {
    particles: [],
    activeParticleColor: '212, 175, 55', // Gold
    isVerified: false,
    overlayShown: false,
    isLocked: false,
    circumference: 0
};

// --- [1. Canvas Background Hook] ---
const useCanvas = () => {
    if (!DOM.canvas) return;
    const ctx = DOM.canvas.getContext('2d');

    const resize = () => {
        DOM.canvas.width = window.innerWidth;
        DOM.canvas.height = window.innerHeight;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * DOM.canvas.width;
            this.y = Math.random() * DOM.canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > DOM.canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > DOM.canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(${State.activeParticleColor}, 0.4)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const init = () => {
        resize();
        window.addEventListener('resize', resize);
        State.particles = Array.from({ length: 80 }, () => new Particle());
    };

    const connect = () => {
        for (let a = 0; a < State.particles.length; a++) {
            for (let b = a; b < State.particles.length; b++) {
                let dist = Math.hypot(State.particles[a].x - State.particles[b].x, State.particles[a].y - State.particles[b].y);
                if (dist < 180) {
                    ctx.strokeStyle = `rgba(${State.activeParticleColor}, ${1 - dist / 180 * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(State.particles[a].x, State.particles[a].y);
                    ctx.lineTo(State.particles[b].x, State.particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
        State.particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    };

    init();
    animate();
};

// --- [2. Scroll & UI Hook] ---
const useScrollAndUI = () => {
    if (DOM.circle) {
        const radius = DOM.circle.r.baseVal.value;
        State.circumference = radius * 2 * Math.PI;
        DOM.circle.style.strokeDasharray = `${State.circumference} ${State.circumference}`;
        DOM.circle.style.strokeDashoffset = State.circumference;
    }

    const setProgress = (percent) => {
        if (!DOM.circle || !DOM.percent) return;
        const offset = State.circumference - (percent / 100 * State.circumference);
        DOM.circle.style.strokeDashoffset = offset;
        DOM.percent.innerText = Math.floor(percent);
    };

    const updateMultiverse = (pos) => {
        if (!DOM.sectorAbyss) return;
        const abyssTop = DOM.sectorAbyss.offsetTop - 400;

        DOM.mapItems.forEach(item => item.classList.remove('active'));

        if (pos < abyssTop) {
            DOM.mapItems[0]?.classList.add('active');
            DOM.mapItems[1]?.classList.add('active');

            const booths = document.querySelectorAll('.booth-section');
            let currentBoothName = "테마파크";
            booths.forEach(booth => {
                if (pos >= booth.offsetTop - 500) {
                    currentBoothName = booth.querySelector('h3').innerText;
                }
            });

            if (DOM.rangMsg) DOM.rangMsg.innerText = `지금 보시는 곳은 '${currentBoothName}' 부스예요!`;
            State.activeParticleColor = '212, 175, 55';
            State.isLocked = false;
        } else {
            DOM.mapItems[2]?.classList.add('active');
            State.activeParticleColor = '77, 0, 0';

            if (!State.isVerified && !State.isLocked) {
                if (DOM.rangMsg) DOM.rangMsg.innerText = "잠시만요! 여기부터는 확인이 필요해요!";
                if (!State.overlayShown) showVerificationOverlay();
            }
        }
    };

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollPos / totalHeight) * 100;

        setProgress(progress);
        updateMultiverse(scrollPos);
    });
};

// --- [3. Auth & Storage Hook (Error Handling)] ---
const checkLocalAuth = () => {
    try {
        const savedAuth = localStorage.getItem('rang_adult_verified');
        if (savedAuth === 'true') {
            State.isVerified = true;
        }
    } catch (error) {
        console.warn("로컬 스토리지 접근이 제한되었습니다. 인증을 새로 진행합니다.");
    }
};

const showVerificationOverlay = () => {
    State.overlayShown = true;
    if (!DOM.overlay) return;
    DOM.overlay.style.display = 'flex';
    setTimeout(() => { DOM.overlay.style.opacity = '1'; }, 10);
    document.body.style.overflow = 'hidden';
};

// HTML onclick에서 호출할 수 있도록 window 객체에 할당합니다.
window.verifyAge = () => {
    const ageInput = document.getElementById('age-input').value;
    if (!ageInput) return alert("생년월일을 선택해주세요.");

    const birthDate = new Date(ageInput);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age >= 19) {
        State.isVerified = true;
        State.isLocked = false;

        try {
            localStorage.setItem('rang_adult_verified', 'true');
        } catch (error) {
            console.warn("인증 상태를 저장할 수 없습니다.");
        }

        if (DOM.overlay) {
            DOM.overlay.style.opacity = '0';
            setTimeout(() => {
                DOM.overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (DOM.rangMsg) DOM.rangMsg.innerText = "인증 완료! 어른들의 공간 '어비스'를 에스코트해 드릴게요.";
            }, 500);
        }
    } else {
        alert("죄송합니다. 만 19세 미만은 접근할 수 없습니다.");
        State.isLocked = true;
        window.exitVerification("에구.. 여긴 아직 위험해요! 안전한 테마파크로 돌아가요!");
    }
};

window.exitVerification = (msg) => {
    if (DOM.overlay) {
        DOM.overlay.style.opacity = '0';
        setTimeout(() => {
            DOM.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            State.overlayShown = false;
            if (msg && DOM.rangMsg) DOM.rangMsg.innerText = msg;
        }, 500);
    }
};

window.jumpTo = (id) => {
    const target = document.getElementById(id);
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
};

// --- [4. App Initialization] ---
document.addEventListener('DOMContentLoaded', () => {
    // 로컬 스토리지 데이터 확인
    checkLocalAuth();

    // 캔버스 및 스크롤 UI 활성화
    useCanvas();
    useScrollAndUI();

    // 만다오 예약 버튼 부드러운 전환 처리
    if (DOM.mandaoBtn) {
        DOM.mandaoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = DOM.mandaoBtn.getAttribute('href');
            document.body.style.transition = "opacity 0.8s ease";
            document.body.style.opacity = "0";
            setTimeout(() => { window.location.href = targetUrl; }, 800);
        });
    }

    // 만다오 페이지 내 예약 폼 예외처리
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("만다오 프라이빗 멤버십 확인 후 예약이 확정됩니다.");
        });
    }
});