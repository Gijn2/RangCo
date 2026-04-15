/**
 * Project R: 통합 가이드 및 멀티버스 제어 시스템 (수정본)
 */

// --- [전역 변수 설정] ---
const canvas = document.getElementById('connection-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let activeParticleColor = '212, 175, 55';

const circle = document.getElementById('fragment-progress');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

const rangMsg = document.getElementById('rang-message');
let isVerified = false;
let overlayShown = false;
let isLocked = false;

// --- [1. 캔버스 애니메이션 로직] ---
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = `rgba(${activeParticleColor}, 0.4)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCanvas() {
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
            if (dist < 180) {
                ctx.strokeStyle = `rgba(${activeParticleColor}, ${1 - dist / 180 * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
}

// --- [2. UI 및 스크롤 제어 로직] ---
function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = offset;
    document.getElementById('fragment-percent').innerText = Math.floor(percent);
}

function updateMultiverse(pos) {
    const sectorAbyss = document.getElementById('sector-abyss');
    if (!sectorAbyss) return;

    const abyssTop = sectorAbyss.offsetTop - 400;
    const mapItems = document.querySelectorAll('.map-item');

    mapItems.forEach(item => item.classList.remove('active'));

    if (pos < abyssTop) {
        mapItems[0]?.classList.add('active'); // Plaza
        mapItems[1]?.classList.add('active'); // Park

        const booths = document.querySelectorAll('.booth-section');
        let currentBoothName = "테마파크";

        booths.forEach(booth => {
            if (pos >= booth.offsetTop - 500) {
                currentBoothName = booth.querySelector('h3').innerText;
            }
        });

        rangMsg.innerText = `지금 보시는 곳은 '${currentBoothName}' 부스예요! 정말 멋지죠?`;
        activeParticleColor = '212, 175, 55';
        isLocked = false;
    } else {
        mapItems[2]?.classList.add('active'); // Abyss
        activeParticleColor = '77, 0, 0';

        if (!isVerified && !isLocked) {
            rangMsg.innerText = "잠시만요! 여기부터는 확인이 필요해요! ";
            if (!overlayShown) showVerificationOverlay();
        } else if (isVerified) {
            rangMsg.innerText = "Abyss의 비밀스러운 공간에 들어오셨군요. 환영합니다.";
        }
    }
}

// --- [3. 성인 인증 시스템] ---
function showVerificationOverlay() {
    overlayShown = true;
    const overlay = document.getElementById('verification-overlay');
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.opacity = '1'; }, 10);
    document.body.style.overflow = 'hidden';
}

function verifyAge() {
    const ageInput = document.getElementById('age-input').value;
    if (!ageInput) return alert("생년월일을 선택해주세요.");

    const birthDate = new Date(ageInput);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    if (age >= 19) {
        isVerified = true;
        isLocked = false;
        const overlay = document.getElementById('verification-overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            rangMsg.innerText = "인증 완료! 어른들의 공간 '어비스'를 에스코트해 드릴게요.";
        }, 500);
    } else {
        alert("죄송합니다. 만 19세 미만은 접근할 수 없습니다.");
        isLocked = true;
        exitVerification("에구.. 여긴 아직 위험해요! 안전한 테마파크로 돌아가요!");
    }
}

function exitVerification(msg) {
    const overlay = document.getElementById('verification-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        overlayShown = false;
        if (msg) rangMsg.innerText = msg;
    }, 500);
}

// --- [4. 초기화 및 이벤트 리스너 등록 (핵심)] ---
document.addEventListener('DOMContentLoaded', () => {
    // 진행바 초기화
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    // 만다오 버튼 클릭 핸들러 (한 번만 등록)
    const mandaoBtn = document.getElementById('mandaoReserveBtn');
    if (mandaoBtn) {
        mandaoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = mandaoBtn.getAttribute('href');
            document.body.style.transition = "opacity 1s ease";
            document.body.style.opacity = "0";
            setTimeout(() => { window.location.href = targetUrl; }, 1000);
        });
    }

    // 캔버스 시작
    initCanvas();
    animate();

    // 스크롤 이벤트 연결
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollPos / totalHeight) * 100;

        setProgress(progress);
        updateMultiverse(scrollPos);
    });
});

// 점프 함수는 전역 유지
function jumpTo(id) {
    const target = document.getElementById(id);
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
}

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

document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guestName = document.getElementById('guestName').value;
    const responseMsg = document.getElementById('responseMsg');

    const reservationData = { checkIn, checkOut, guestName };

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            responseMsg.textContent = "예약 요청이 완료되었습니다. 관리자 확인 후 확정됩니다.";
            responseMsg.className = "mt-4 text-center text-sm text-green-600 block";
        } else {
            throw new Error('서버 오류');
        }
    } catch (error) {
        responseMsg.textContent = "예약 처리 중 문제가 발생했습니다.";
        responseMsg.className = "mt-4 text-center text-sm text-red-600 block";
    }
});