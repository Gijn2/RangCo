/**
 * Rang Universal City: 통합 제어 시스템 (Clean Version)
 * 중복 로직 제거 및 상태 관리 최적화
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
    mandaoBtn: document.getElementById('mandaoReserveBtn'),
    reservationForm: document.getElementById('reservationForm')
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

    resize();
    window.addEventListener('resize', resize);
    State.particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
        ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
        State.particles.forEach(p => { p.update(); p.draw(); });

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
        requestAnimationFrame(animate);
    };
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

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollPos / totalHeight) * 100;

        setProgress(progress);

        if (!DOM.sectorAbyss) return;
        const abyssTop = DOM.sectorAbyss.offsetTop - 400;

        DOM.mapItems.forEach(item => item.classList.remove('active'));

        if (scrollPos < abyssTop) {
            DOM.mapItems[0]?.classList.add('active');
            DOM.mapItems[1]?.classList.add('active');

            let currentBoothName = "테마파크";
            document.querySelectorAll('.booth-section').forEach(booth => {
                if (scrollPos >= booth.offsetTop - 500) {
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
                if (!State.overlayShown) {
                    State.overlayShown = true;
                    if (DOM.overlay) {
                        DOM.overlay.style.display = 'flex';
                        setTimeout(() => { DOM.overlay.style.opacity = '1'; }, 10);
                        document.body.style.overflow = 'hidden';
                    }
                }
            }
        }
    });
};

// --- [3. Global Functions (HTML onclick 연결용)] ---
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
        try { localStorage.setItem('rang_adult_verified', 'true'); } catch (e) {}

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
    try {
        if (localStorage.getItem('rang_adult_verified') === 'true') State.isVerified = true;
    } catch (e) {}

    useCanvas();
    useScrollAndUI();

    // 부드러운 페이지 전환 (만다오 버튼)
    if (DOM.mandaoBtn) {
        DOM.mandaoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = '/mandao';
            document.body.style.transition = "opacity 0.8s ease";
            document.body.style.opacity = "0";
            setTimeout(() => { window.location.href = targetUrl; }, 800);
        });
    }

    // 만다오 예약 폼 비동기 전송 로직
    if (DOM.reservationForm) {
        DOM.reservationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const guestName = document.getElementById('guestName').value;
            const responseMsg = document.getElementById('responseMsg');

            try {
                const response = await fetch('/api/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ checkIn, checkOut, guestName })
                });

                if (response.ok) {
                    responseMsg.textContent = "예약 요청이 완료되었습니다. 관리자 확인 후 확정됩니다.";
                    responseMsg.className = "mt-4 text-center text-sm text-green-600 block";
                } else {
                    throw new Error('서버 오류');
                }
            } catch (error) {
                // 테스트 또는 서버 다운 시 대비용 Alert (개발 편의성 유지)
                alert("만다오 프라이빗 멤버십 확인 후 예약이 확정됩니다. (서버 연결 실패)");
                responseMsg.textContent = "가승인이 완료되었습니다. (오프라인 모드)";
                responseMsg.className = "mt-4 text-center text-sm text-yellow-500 block";
            }
        });
    }
});
