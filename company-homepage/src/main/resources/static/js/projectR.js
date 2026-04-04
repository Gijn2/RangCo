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