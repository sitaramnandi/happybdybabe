/* ============================================================
   ★ TEST MODE ★
   Line 6 — set to true to test the Surprise right now.
   Set to false before you give her the link!
   ============================================================ */
const TEST_MODE = true;   // ← CHANGE THIS LINE true for evrything unlock and false mean every thing lock

/* ============================================================
   PHOTO DATA — edit captions, add src paths for your images
   e.g.  src: "assets/images/photo1.jpg"
   Leave src as "" to show a placeholder.
   ============================================================ */
const photoData = [
    { src: "assets/images/photo1.jpeg", caption: "Our first memory 💕" },
    { src: "assets/images/photo6.jpeg", caption: "That perfect day 🌸" },
    { src: "assets/images/photo3.jpeg", caption: "Always laughing ❤️" },
    { src: "assets/images/photo4.jpeg", caption: "Adventures together 🌟" },
    { src: "assets/images/photo5.jpeg", caption: "Forever us 💖" },
    { src: "assets/images/photo8.jpeg", caption: "I Love You 💖" },



];

/* ============================================================
   VIDEO DATA — add your video file paths here
   e.g.  src: "assets/videos/video1.mp4"
   Leave src as "" to show a placeholder tile.
   ============================================================ */
const videoData = [
    { src: "assets/videos/videos1.mp4", title: "Our story begins 💕" },
    { src: "assets/videos/videos2.mp4", title: "Beautiful days 🌸" },
    { src: "assets/videos/videos3.mp4", title: "My favorite moments ❤️" },
];

/* ============================================================
   LOCK LOGIC
   ============================================================ */
function isSurpriseUnlocked() {
    if (TEST_MODE) return true;
    const now = new Date();
    const unlock = new Date(now.getFullYear(), 3, 19, 0, 0, 0); // April 19, 00:00:00
    return now >= unlock;
}

function getUnlockTarget() {
    const now = new Date();
    let t = new Date(now.getFullYear(), 3, 19, 0, 0, 0);
    if (now >= t) t.setFullYear(t.getFullYear() + 1);
    return t;
}

/* ============================================================
   THREE.JS — HERO BACKGROUND
   ============================================================ */
/* Shared Canvas-2D particle system — used as fallback (and for non-WebGL browsers) */
function initCanvas2DParticles(canvasId, COUNT) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const colors = ["#ff6b9d", "#c678dd", "#ff9ff3", "#ffffff", "#ffb3d1"];

    function resize() {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
    }
    // Defer resize so the browser has finished layout
    requestAnimationFrame(resize);
    window.addEventListener("resize", resize, { passive: true });

    const pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * (canvas.width || window.innerWidth),
        y: Math.random() * (canvas.height || window.innerHeight),
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
    }));

    (function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pts.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        ctx.globalAlpha = 1;
    })();
}

function initHeroThreeJS() {
    if (typeof THREE === "undefined") { initCanvas2DParticles("heroCanvas", 250); return; }

    try {
        const canvas = document.getElementById("heroCanvas");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 55;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const COUNT = window.innerWidth < 600 ? 180 : 350;
        const pos = new Float32Array(COUNT * 3);
        const col = new Float32Array(COUNT * 3);
        const palette = [
            new THREE.Color(0xff6b9d), new THREE.Color(0xc678dd),
            new THREE.Color(0xff9ff3), new THREE.Color(0xffffff),
        ];

        for (let i = 0; i < COUNT; i++) {
            pos[i * 3] = (Math.random() - .5) * 220;
            pos[i * 3 + 1] = (Math.random() - .5) * 220;
            pos[i * 3 + 2] = (Math.random() - .5) * 100;
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const points = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 1.4, vertexColors: true, transparent: true, opacity: 0.75,
            blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        scene.add(points);

        let mx = 0, my = 0;
        document.addEventListener("mousemove", e => {
            mx = (e.clientX / window.innerWidth - 0.5) * 18;
            my = (e.clientY / window.innerHeight - 0.5) * 18;
        });

        (function animate() {
            requestAnimationFrame(animate);
            const t = Date.now() * 0.0004;
            points.rotation.y = t * 0.12;
            points.rotation.x = t * 0.06;
            camera.position.x += (mx - camera.position.x) * 0.04;
            camera.position.y += (-my - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        })();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } catch (e) {
        console.warn("WebGL unavailable for hero, using Canvas 2D fallback:", e.message);
        initCanvas2DParticles("heroCanvas", 250);
    }
}

/* ============================================================
   THREE.JS — SURPRISE HEART CANVAS (inside the modal left panel)
   ============================================================ */
let sxRafId = null;
let sxRenderer = null;

function buildHeartShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 0.25);
    s.bezierCurveTo(0, 0.25, -0.05, 0, -0.3, 0);
    s.bezierCurveTo(-0.65, 0, -0.65, 0.42, -0.65, 0.42);
    s.bezierCurveTo(-0.65, 0.65, -0.45, 0.87, 0, 1.05);
    s.bezierCurveTo(0.45, 0.87, 0.65, 0.65, 0.65, 0.42);
    s.bezierCurveTo(0.65, 0.42, 0.65, 0, 0.3, 0);
    s.bezierCurveTo(0.15, 0, 0, 0.25, 0, 0.25);
    return s;
}

/* Canvas 2D fallback for the surprise left panel (big pulsing emoji heart) */
function initSxHeartFallback() {
    const canvas = document.getElementById("sxHeartCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.offsetWidth || 360;
    canvas.height = canvas.parentElement.offsetHeight || 480;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    let t = 0;
    const emojis = ["❤️", "💕", "💖", "💗", "💫"];

    (function draw() {
        requestAnimationFrame(draw);
        t += 0.03;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = 1 + Math.sin(t * 1.8) * 0.07;
        ctx.font = `${Math.round(110 * scale)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(255,50,100,.7)";
        ctx.shadowBlur = 40 + Math.sin(t) * 20;
        ctx.fillText("❤️", cx, cy - 20);
        ctx.shadowBlur = 0;
        // Small orbiting emojis
        for (let i = 0; i < 5; i++) {
            const a = t * 0.6 + (i / 5) * Math.PI * 2;
            const r = 100 + Math.sin(t + i) * 12;
            ctx.font = "22px serif";
            ctx.fillText(emojis[i], cx + Math.cos(a) * r, cy - 20 + Math.sin(a) * r * 0.55);
        }
    })();
}

function initSxHeartCanvas() {
    if (typeof THREE === "undefined") { initSxHeartFallback(); return; }

    const canvas = document.getElementById("sxHeartCanvas");
    const container = canvas.parentElement;
    const W = container.offsetWidth || 380;
    const H = container.offsetHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4.5;

    if (sxRenderer) { try { sxRenderer.dispose(); } catch (_) { } sxRenderer = null; }
    try {
        sxRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
        console.warn("WebGL unavailable for surprise canvas:", e.message);
        initSxHeartFallback(); return;
    }
    sxRenderer.setSize(W, H);
    sxRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Lights */
    scene.add(new THREE.AmbientLight(0x330022, 1.0));
    const pinkLight = new THREE.PointLight(0xff4488, 4, 20);
    pinkLight.position.set(1.5, 1.5, 4);
    scene.add(pinkLight);
    const purpleLight = new THREE.PointLight(0xaa44ff, 3, 15);
    purpleLight.position.set(-1.5, -0.5, 3);
    scene.add(purpleLight);
    const rimLight = new THREE.PointLight(0xff99cc, 2, 10);
    rimLight.position.set(0, -2, 2);
    scene.add(rimLight);

    /* Main 3D extruded heart */
    const shape = buildHeartShape();
    const extruded = new THREE.ExtrudeGeometry(shape, {
        depth: 0.28, bevelEnabled: true, bevelSegments: 10,
        steps: 2, bevelSize: 0.04, bevelThickness: 0.04,
    });
    extruded.center();

    const heartMat = new THREE.MeshPhongMaterial({
        color: 0xff1155,
        emissive: 0x660022,
        specular: 0xff99cc,
        shininess: 120,
    });
    const mainHeart = new THREE.Mesh(extruded, heartMat);
    mainHeart.scale.set(2.6, 2.6, 2.6);
    scene.add(mainHeart);

    /* Small orbiting mini hearts */
    const miniHearts = [];
    const miniMat = new THREE.MeshPhongMaterial({
        color: 0xff66aa, emissive: 0x440011, transparent: true, opacity: 0.85,
    });
    for (let i = 0; i < 6; i++) {
        const mGeo = new THREE.ExtrudeGeometry(buildHeartShape(), {
            depth: 0.08, bevelEnabled: true, bevelSegments: 4,
            steps: 1, bevelSize: 0.02, bevelThickness: 0.02,
        });
        mGeo.center();
        const m = new THREE.Mesh(mGeo, miniMat);
        m.scale.set(0.35, 0.35, 0.35);
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.2 + (i % 2) * 0.5;
        m.userData = { angle, radius, speed: 0.4 + Math.random() * 0.3, yOff: (Math.random() - 0.5) * 1.2 };
        scene.add(m);
        miniHearts.push(m);
    }

    /* Floating particles */
    const pCount = 80;
    const pPos = new Float32Array(pCount * 3);
    const pVel = [];
    for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 8;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
        pVel.push({ vx: (Math.random() - 0.5) * 0.01, vy: Math.random() * 0.012 + 0.004 });
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.06, color: 0xff9ff3, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* Render loop */
    const startTime = Date.now();
    function renderSx() {
        sxRafId = requestAnimationFrame(renderSx);
        const t = (Date.now() - startTime) * 0.001;

        // Rotate main heart gently
        mainHeart.rotation.y = Math.sin(t * 0.5) * 0.6 + t * 0.3;
        mainHeart.rotation.x = Math.sin(t * 0.3) * 0.15;

        // Pulse scale
        const pulse = 1 + Math.sin(t * 1.8) * 0.06;
        mainHeart.scale.set(2.6 * pulse, 2.6 * pulse, 2.6 * pulse);

        // Orbit mini hearts
        miniHearts.forEach(m => {
            m.userData.angle += m.userData.speed * 0.016;
            const a = m.userData.angle;
            const r = m.userData.radius;
            m.position.set(Math.cos(a) * r, m.userData.yOff + Math.sin(t * 0.6) * 0.3, Math.sin(a) * r * 0.4);
            m.rotation.z = a + t;
        });

        // Drift particles
        const pos = pGeo.attributes.position.array;
        for (let i = 0; i < pCount; i++) {
            pos[i * 3] += pVel[i].vx;
            pos[i * 3 + 1] += pVel[i].vy;
            if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
            if (Math.abs(pos[i * 3]) > 5) pVel[i].vx *= -1;
        }
        pGeo.attributes.position.needsUpdate = true;

        // Animate lights
        pinkLight.intensity = 3.5 + Math.sin(t * 2.1) * 1.2;
        purpleLight.intensity = 2.5 + Math.cos(t * 1.7) * 0.8;

        sxRenderer.render(scene, camera);
    }
    renderSx();
}

function stopSxCanvas() {
    if (sxRafId !== null) { cancelAnimationFrame(sxRafId); sxRafId = null; }
}

/* ============================================================
   FLOATING HEARTS (hero)
   ============================================================ */
function initFloatingHearts() {
    const container = document.getElementById("floatingHearts");
    const symbols = ["❤️", "💕", "💗", "💖", "💝", "🌸", "💫", "✨"];

    function spawn() {
        const el = document.createElement("span");
        el.className = "float-heart";
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + "%";
        el.style.fontSize = (Math.random() * 1.4 + 0.8) + "rem";
        const dur = Math.random() * 9 + 7;
        el.style.animationDuration = dur + "s";
        el.style.animationDelay = (Math.random() * 1.5) + "s";
        container.appendChild(el);
        setTimeout(() => el.remove(), (dur + 2) * 1000);
    }

    for (let i = 0; i < 12; i++) setTimeout(spawn, Math.random() * 4000);
    setInterval(spawn, 1600);
}

/* ============================================================
   FLOATING HEARTS — inside sx-overlay bg
   ============================================================ */
function spawnSxHearts() {
    const container = document.getElementById("sxBgHearts");
    const symbols = ["❤️", "💕", "💖", "🌸", "✨", "💫"];

    function spawn() {
        if (!document.getElementById("sxOverlay").classList.contains("active")) return;
        const el = document.createElement("span");
        el.className = "float-heart";
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + "%";
        el.style.fontSize = (Math.random() + 0.6) + "rem";
        const dur = Math.random() * 7 + 5;
        el.style.animationDuration = dur + "s";
        el.style.animationDelay = "0s";
        container.appendChild(el);
        setTimeout(() => el.remove(), (dur + 1) * 1000);
    }

    return setInterval(spawn, 800);
}

/* ============================================================
   COUNTDOWN TIMER (page)
   ============================================================ */
function initCountdown() {
    const pad = n => String(n).padStart(2, "0");

    function getTarget() {
        const now = new Date();
        let t = new Date(now.getFullYear(), 3, 19);
        if (now >= t) t.setFullYear(t.getFullYear() + 1);
        return t;
    }

    const timerEl = document.getElementById("countdownTimer");
    const bdayEl = document.getElementById("birthdayNow");

    function tick() {
        const now = new Date();
        const isToday = now.getMonth() === 3 && now.getDate() === 19;

        if (isToday) {
            timerEl.style.display = "none";
            bdayEl.style.display = "block";
            launchConfetti();
            clearInterval(iv);
            return;
        }

        const diff = getTarget() - now;
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        document.getElementById("days").textContent = pad(days);
        document.getElementById("hours").textContent = pad(hours);
        document.getElementById("minutes").textContent = pad(minutes);
        document.getElementById("seconds").textContent = pad(seconds);
    }

    tick();
    const iv = setInterval(tick, 1000);
}

/* ============================================================
   SURPRISE BUTTON — lock / unlock state
   ============================================================ */
function initSurpriseLock() {
    const btn = document.getElementById("surpriseBtn");
    const lockInfo = document.getElementById("lockInfo");
    const lockText = document.getElementById("lockCountdownText");
    const pad = n => String(n).padStart(2, "0");

    function updateBtn() {
        if (isSurpriseUnlocked()) {
            btn.classList.remove("locked");
            btn.textContent = "✨ Open Your Surprise ✨";
            lockInfo.style.display = "none";
        } else {
            btn.classList.add("locked");
            btn.textContent = "🔒 Your Surprise Awaits…";
            lockInfo.style.display = "flex";

            const diff = getUnlockTarget() - new Date();
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            lockText.textContent = d > 0
                ? `Unlocks in ${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
                : `Unlocks in ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
        }
    }

    updateBtn();
    setInterval(updateBtn, 1000);
}

/* ============================================================
   PHOTO CAROUSEL (main page)
   ============================================================ */
function initCarousel() {
    const stage = document.getElementById("carouselStage");
    const dots = document.getElementById("carouselDots");
    let current = 0;
    let autoTimer;

    photoData.forEach((photo, i) => {
        const slide = document.createElement("div");
        slide.className = "c-slide";
        slide.dataset.index = i;

        if (photo.src) {
            const img = document.createElement("img");
            img.src = photo.src; img.alt = photo.caption; img.loading = "lazy";
            slide.appendChild(img);
        } else {
            slide.innerHTML = `<div class="slide-placeholder"><span class="ph-icon">📸</span><p>${photo.caption}</p></div>`;
        }
        stage.appendChild(slide);

        const dot = document.createElement("div");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goTo(i));
        dots.appendChild(dot);
    });

    const slides = stage.querySelectorAll(".c-slide");
    const dotEls = dots.querySelectorAll(".dot");
    const total = slides.length;

    function updateView() {
        slides.forEach((s, i) => {
            s.classList.remove("is-active", "is-prev", "is-next");
            if (i === current) s.classList.add("is-active");
            else if (i === (current - 1 + total) % total) s.classList.add("is-prev");
            else if (i === (current + 1) % total) s.classList.add("is-next");
        });
        dotEls.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    function goTo(idx) { current = (idx + total) % total; updateView(); resetAuto(); }
    function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 4200); }

    document.getElementById("nextBtn").addEventListener("click", () => goTo(current + 1));
    document.getElementById("prevBtn").addEventListener("click", () => goTo(current - 1));

    let tx = 0;
    stage.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", e => {
        const dx = tx - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 45) goTo(dx > 0 ? current + 1 : current - 1);
    });

    updateView(); resetAuto();
}

/* ============================================================
   TIMELINE SCROLL ANIMATION
   ============================================================ */
function initTimeline() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.18 });
    document.querySelectorAll(".tl-item").forEach(el => io.observe(el));
}

/* ============================================================
   GENERIC SCROLL FADE-IN
   ============================================================ */
function initScrollReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll(".time-unit, .love-letter, .carousel-wrapper, .birthday-now").forEach(el => {
        el.style.opacity = "0"; el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
        io.observe(el);
    });
}

/* ============================================================
   MUSIC PLAYER
   ============================================================ */
function initMusic() {
    const audio = document.getElementById("bgMusic");
    const btn = document.getElementById("musicBtn");
    const icon = btn.querySelector(".music-icon");
    const text = btn.querySelector(".music-text");
    let playing = false;

    audio.volume = 0.4;

    // Lock music until April 19, same as surprise
    if (!isSurpriseUnlocked()) {
        btn.classList.add("locked");
        btn.disabled = true;
        icon.textContent = "🔒";
        text.textContent = "Unlocks April 19";
        return; // don't attach play logic at all
    }

    btn.addEventListener("click", () => {
        if (playing) {
            audio.pause();
            icon.textContent = "🎵"; text.textContent = "Play Music";
        } else {
            audio.play().catch(() => { text.textContent = "Click again"; });
            icon.textContent = "🔊"; text.textContent = "Pause Music";
        }
        playing = !playing;
    });

    audio.addEventListener("ended", () => { icon.textContent = "🎵"; text.textContent = "Play Music"; playing = false; });
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti() {
    const colors = ["#ff6b9d", "#c678dd", "#ff9ff3", "#ffffff", "#ffb3d1", "#ffd6e7"];
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 55, origin: { x: 0 }, colors }), 260);
    setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 55, origin: { x: 1 }, colors }), 440);
    setTimeout(() => confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors, scalar: 1.5 }), 620);
}

/* ============================================================
   TYPING EFFECT
   ============================================================ */
const LOVE_MESSAGE =
    `My Dearest Love,

On this special day, I want you to know that meeting you was the greatest gift life has ever given me.

You are the reason I smile every morning, the reason I believe in magic, and the reason every ordinary day feels like an adventure worth living.

Your laughter is my favorite sound. Your smile is my safe place. Your love is the greatest treasure I have ever known.

Happy Birthday, my everything. May this year bring you every dream your heart holds — and may you always know how deeply you are loved.

Forever yours ❤️`;

let _typingIv = null;   // active interval handle
let _typingDone = false;  // has this session finished typing?

function startTyping() {
    const el = document.getElementById("sxTyped");
    const cursor = document.getElementById("sxCursor");
    if (!el) return;

    // Already finished — just show the full text, no restart
    if (_typingDone) {
        el.textContent = LOVE_MESSAGE;
        if (cursor) cursor.style.display = "none";
        return;
    }

    // Already typing — let it continue, don't spawn a second interval
    if (_typingIv !== null) return;

    el.textContent = "";
    if (cursor) cursor.style.display = "inline-block";
    let i = 0;
    _typingIv = setInterval(() => {
        if (i >= LOVE_MESSAGE.length) {
            clearInterval(_typingIv);
            _typingIv = null;
            _typingDone = true;
            if (cursor) cursor.style.display = "none";
            return;
        }
        el.textContent += LOVE_MESSAGE[i++];
        el.parentElement.scrollTop = el.parentElement.scrollHeight;
    }, 28);
}

function resetTyping() {
    clearInterval(_typingIv);
    _typingIv = null;
    _typingDone = false;
    const el = document.getElementById("sxTyped");
    const cursor = document.getElementById("sxCursor");
    if (el) el.textContent = "";
    if (cursor) cursor.style.display = "inline-block";
}

/* ============================================================
   BUILD VIDEO PANEL
   ============================================================ */
function buildVideoPanel() {
    const playerEl = document.getElementById("sxVideoPlayer");
    const thumbsEl = document.getElementById("sxVideoThumbs");
    let activeIdx = -1;

    if (videoData.every(v => !v.src)) {
        // All placeholders
        playerEl.innerHTML = `
            <div class="sx-video-ph">
                <span class="ph-big">🎬</span>
                <p>Add your videos to <strong>assets/videos/</strong><br>then fill in <code>videoData</code> in script.js</p>
            </div>`;
        thumbsEl.innerHTML = "";
        videoData.forEach(v => {
            const t = document.createElement("div");
            t.className = "sx-vid-thumb";
            t.innerHTML = `<div class="sx-vid-label">🎥</div>`;
            t.title = v.title;
            thumbsEl.appendChild(t);
        });
        return;
    }

    // Find first real video
    const firstReal = videoData.findIndex(v => v.src);

    function loadVideo(idx) {
        if (activeIdx === idx) return;
        activeIdx = idx;
        const v = videoData[idx];
        playerEl.innerHTML = `<video id="sxVid" controls playsinline>
            <source src="${v.src}" type="video/mp4">
        </video>`;
        thumbsEl.querySelectorAll(".sx-vid-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
    }

    thumbsEl.innerHTML = "";
    videoData.forEach((v, i) => {
        const t = document.createElement("div");
        t.className = "sx-vid-thumb";
        if (v.src) {
            const mini = document.createElement("video");
            mini.src = v.src; mini.muted = true; mini.preload = "metadata";
            t.appendChild(mini);
        } else {
            t.innerHTML = `<div class="sx-vid-label">🎥</div>`;
        }
        t.title = v.title;
        t.addEventListener("click", () => { if (v.src) loadVideo(i); });
        thumbsEl.appendChild(t);
    });

    loadVideo(firstReal);
}

/* ============================================================
   BUILD MEMORIES GRID (in surprise panel)
   ============================================================ */
function buildMemoriesGrid() {
    const grid = document.getElementById("sxMemGrid");
    grid.innerHTML = "";
    photoData.forEach(photo => {
        const item = document.createElement("div");
        item.className = "sx-mem-item";
        if (photo.src) {
            const img = document.createElement("img");
            img.src = photo.src; img.alt = photo.caption; img.loading = "lazy";
            item.appendChild(img);
        } else {
            item.textContent = "📸";
        }
        item.title = photo.caption;
        grid.appendChild(item);
    });
}

/* ============================================================
   SURPRISE EXPERIENCE — INIT + OPEN/CLOSE
   ============================================================ */
function initSurpriseExperience() {
    const overlay = document.getElementById("sxOverlay");
    const surpriseBtn = document.getElementById("surpriseBtn");
    const closeBtn = document.getElementById("sxClose");
    const ctaBtn = document.getElementById("sxCta");
    const tabNav = document.getElementById("sxTabNav");
    let sxHeartsInterval = null;
    let opened = false;

    /* Build static content once */
    buildVideoPanel();
    buildMemoriesGrid();

    /* Tab switching */
    tabNav.addEventListener("click", e => {
        const tab = e.target.closest(".sx-tab");
        if (!tab) return;
        tabNav.querySelectorAll(".sx-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.tab;
        document.querySelectorAll(".sx-panel").forEach(p => p.classList.remove("active"));
        document.getElementById("panel-" + target).classList.add("active");
        // Restart typing if message tab re-opened
        if (target === "message") startTyping();
    });

    function open() {
        if (!isSurpriseUnlocked()) {
            // Shake the button
            surpriseBtn.style.animation = "none";
            requestAnimationFrame(() => {
                surpriseBtn.style.animation = "shakeLock 0.5s ease";
            });
            return;
        }

        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        launchConfetti();

        // Reset to message tab
        tabNav.querySelectorAll(".sx-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === "message"));
        document.querySelectorAll(".sx-panel").forEach(p => p.classList.toggle("active", p.id === "panel-message"));

        // Reset + start typing after card animates in
        resetTyping();
        setTimeout(startTyping, 480);

        // Start 3D heart canvas
        if (!opened) {
            setTimeout(initSxHeartCanvas, 300);
            opened = true;
        }

        // Spawn overlay hearts
        sxHeartsInterval = spawnSxHearts();

        // Extra confetti bursts
        setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 }, colors: ["#ff6b9d", "#c678dd", "#fff"] }), 1500);
    }

    function close() {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
        stopSxCanvas();
        clearInterval(sxHeartsInterval);
        // Pause any playing video
        const vid = document.getElementById("sxVid");
        if (vid) vid.pause();
    }

    surpriseBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    ctaBtn.addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbar() {
    const nav = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        nav.style.background = window.scrollY > 50
            ? "rgba(13, 1, 24, 0.95)"
            : "rgba(13, 1, 24, 0.75)";
    }, { passive: true });
}

/* ============================================================
   GAME TOAST
   ============================================================ */
function showToast(title, body) {
    const toast = document.getElementById("gameToast");
    if (!toast) return;
    toast.querySelector("h3").textContent = title;
    toast.querySelector("p").textContent = body;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
}

/* ============================================================
   MEMORY MATCH GAME
   ============================================================ */
function initMemoryGame() {
    const symbols = ["❤️", "💕", "🌹", "💍", "🦋", "💫", "🌸", "🎂"];
    let cards = [], flipped = [], matched = 0, moves = 0, seconds = 0;
    let canFlip = true, timerIv = null, started = false;

    const grid = document.getElementById("memGrid");
    const movesEl = document.getElementById("memMoves");
    const timerEl = document.getElementById("memTimer");

    function buildGrid() {
        grid.innerHTML = "";
        flipped = []; matched = 0; moves = 0; seconds = 0;
        canFlip = true; started = false;
        clearInterval(timerIv);
        movesEl.textContent = "0";
        timerEl.textContent = "0:00";

        cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        cards.forEach(sym => {
            const card = document.createElement("div");
            card.className = "mem-card";
            card.dataset.sym = sym;
            card.innerHTML = `<div class="mem-inner">
                <div class="mem-front">💗</div>
                <div class="mem-back">${sym}</div>
            </div>`;
            card.addEventListener("click", () => flip(card));
            grid.appendChild(card);
        });
    }

    function flip(card) {
        if (!canFlip || card.classList.contains("flipped") || card.classList.contains("matched")) return;
        if (!started) { started = true; startTimer(); }

        card.classList.add("flipped");
        flipped.push(card);

        if (flipped.length === 2) {
            canFlip = false;
            moves++;
            movesEl.textContent = moves;

            if (flipped[0].dataset.sym === flipped[1].dataset.sym) {
                flipped.forEach(c => c.classList.add("matched"));
                flipped = []; canFlip = true; matched++;

                if (matched === symbols.length) {
                    clearInterval(timerIv);
                    setTimeout(() => {
                        launchConfetti();
                        showToast("🎉 You Won!", `${moves} moves · ${timerEl.textContent}`);
                    }, 400);
                }
            } else {
                setTimeout(() => {
                    flipped.forEach(c => c.classList.remove("flipped"));
                    flipped = []; canFlip = true;
                }, 900);
            }
        }
    }

    function startTimer() {
        timerIv = setInterval(() => {
            seconds++;
            timerEl.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
        }, 1000);
    }

    buildGrid();
    document.getElementById("memReset").addEventListener("click", buildGrid);
}

/* ============================================================
   SPIN THE WHEEL
   ============================================================ */
function initSpinWheel() {
    const segments = [
        { label: "Compliment 💕", color: "#ff2277", msgs: ["Your smile lights up every room you walk into!", "You are breathtakingly beautiful, inside and out!", "Your laugh is my absolute favorite sound in the universe!"] },
        { label: "Sweet Dare 🌹", color: "#9933dd", msgs: ["Send your favorite selfie to someone who loves you!", "Name 3 things you adore about yourself!", "Tell someone you love them right now! 💕"] },
        { label: "Love Fact 💫", color: "#dd44aa", msgs: ["Couples who laugh together truly last longer!", "Your heart literally syncs with someone you love deeply!", "Love actually makes time feel magical and different!"] },
        { label: "Make a Wish 🌸", color: "#ff5599", msgs: ["Close your eyes and make a birthday wish! 🌟", "The universe is listening to you right now 💫", "Your wish has already been heard ✨"] },
        { label: "Bonus Love ❤️", color: "#cc2299", msgs: ["You deserve infinite love today and every day!", "Someone is thinking of you right now with so much love!", "Extra hug delivered straight from the heart 🤗"] },
        { label: "Birthday Gift 🎁", color: "#ff1166", msgs: ["Today is ALL about you — enjoy every magical second!", "Every wish you make today is guaranteed to come true!", "You deserve the entire world, and then some 🌍"] },
        { label: "Sweet Kiss 💋", color: "#aa1188", msgs: ["A virtual kiss sent with all of my love 💋", "The sweetest kiss is yours today, always 💋", "Sealed with love, delivered with my whole heart 💋"] },
        { label: "Love Quote 💌", color: "#ee33bb", msgs: ['"You are my today and all of my tomorrows."', '"In all the world, there is no heart for me like yours."', '"I love you more than yesterday, less than tomorrow."'] },
    ];

    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    const spinBtn = document.getElementById("spinBtn");
    const resultEl = document.getElementById("wheelResult");
    const N = segments.length;
    let currentAngle = 0;
    let spinning = false;

    function drawWheel(rot) {
        const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const arc = (Math.PI * 2) / N;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,107,157,.3)";
        ctx.lineWidth = 3;
        ctx.stroke();

        segments.forEach((seg, i) => {
            const start = rot + i * arc, end = start + arc;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, end);
            ctx.closePath();

            // Gradient fill per segment
            const gx = cx + Math.cos(start + arc / 2) * r * 0.5;
            const gy = cy + Math.sin(start + arc / 2) * r * 0.5;
            const sg = ctx.createRadialGradient(cx, cy, 0, gx, gy, r);
            sg.addColorStop(0, seg.color + "cc");
            sg.addColorStop(1, seg.color);
            ctx.fillStyle = sg;
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,.25)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(start + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 10.5px Poppins,sans-serif";
            ctx.shadowColor = "rgba(0,0,0,.6)";
            ctx.shadowBlur = 4;
            ctx.fillText(seg.label, r - 10, 4);
            ctx.restore();
        });

        // Center circle
        const cg = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 26);
        cg.addColorStop(0, "#ff9ff3");
        cg.addColorStop(1, "#c678dd");
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.font = "16px serif";
        ctx.textAlign = "center";
        ctx.fillText("❤️", cx, cy + 6);
    }

    drawWheel(currentAngle);

    spinBtn.addEventListener("click", () => {
        if (spinning) return;
        spinning = true;
        spinBtn.disabled = true;
        resultEl.innerHTML = "";

        const extra = (Math.random() * 5 + 6) * Math.PI * 2;
        const dur = 4200 + Math.random() * 1200;
        const from = currentAngle;
        const t0 = performance.now();

        function ease(t) { return 1 - Math.pow(1 - t, 4); }

        (function animate(now) {
            const prog = Math.min((now - t0) / dur, 1);
            currentAngle = from + extra * ease(prog);
            drawWheel(currentAngle);
            if (prog < 1) { requestAnimationFrame(animate); }
            else {
                spinning = false;
                spinBtn.disabled = false;
                showWheelResult();
            }
        })(performance.now());
    });

    function showWheelResult() {
        const arc = (Math.PI * 2) / N;
        // Arrow points up = -π/2; find segment under it
        const norm = ((-currentAngle % (Math.PI * 2)) + Math.PI * 2 + Math.PI / 2) % (Math.PI * 2);
        const idx = Math.floor(norm / arc) % N;
        const seg = segments[idx];
        const msg = seg.msgs[Math.floor(Math.random() * seg.msgs.length)];

        resultEl.innerHTML = `
            <div class="wheel-result-card">
                <div class="wheel-result-label">${seg.label}</div>
                <div class="wheel-result-msg">${msg}</div>
            </div>`;
        launchConfetti();
    }
}

/* ============================================================
   SCRATCH CARD GAME
   ============================================================ */
function initScratchCard() {
    const messages = [
        "You are the most wonderful person in my world. I love you endlessly 💕",
        "Every single day with you is the best day of my life. Happy Birthday! 🌸",
        "You deserve all the happiness the universe holds, and so much more ✨",
        "I fall in love with you every single day. You are my greatest adventure ❤️",
        "Your birthday wish has been granted — infinite love from me to you forever 💫",
        "You light up every room you walk into. The world is better because of you 🌟",
        "Today, tomorrow, and always — you are my absolute favorite person 💌",
        "Wishing you a birthday as beautiful and magical as you truly are 🎂",
        "You make ordinary moments feel extraordinary. Thank you for existing 🦋",
        "My love for you grows bigger than the universe every single day ❤️",
    ];

    const canvas = document.getElementById("scratchCanvas");
    const ctx = canvas.getContext("2d");
    const fillEl = document.getElementById("scratchFill");
    const pctEl = document.getElementById("scratchPct");
    const msgEl = document.getElementById("srMsg");
    let isDrawing = false, revealed = false;

    function buildCard() {
        revealed = false;
        isDrawing = false;
        fillEl.style.width = "0%";
        pctEl.textContent = "0% scratched";
        canvas.style.display = "block";
        canvas.style.opacity = "1";
        canvas.style.transition = "none";
        msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gradient surface
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, "#7b2fa0");
        g.addColorStop(0.45, "#9b35bb");
        g.addColorStop(0.7, "#c678dd");
        g.addColorStop(1, "#7b2fa0");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle grid pattern
        ctx.fillStyle = "rgba(255,255,255,.04)";
        for (let y = 0; y < canvas.height; y += 16) {
            for (let x = (y / 16 % 2 === 0 ? 0 : 8); x < canvas.width; x += 16) {
                ctx.fillRect(x, y, 8, 8);
            }
        }

        // Sparkle dots
        ctx.fillStyle = "rgba(255,255,255,.15)";
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Hint text
        ctx.fillStyle = "rgba(255,255,255,.65)";
        ctx.font = "bold 15px Poppins,sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,.4)";
        ctx.shadowBlur = 6;
        ctx.fillText("✨ Scratch Here ✨", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "11px Poppins,sans-serif";
        ctx.fillStyle = "rgba(255,255,255,.4)";
        ctx.shadowBlur = 0;
        ctx.fillText("Use finger or mouse", canvas.width / 2, canvas.height / 2 + 14);
    }

    function pos(e) {
        const r = canvas.getBoundingClientRect();
        const sx = canvas.width / r.width;
        const sy = canvas.height / r.height;
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
    }

    function scratch(e) {
        if (!isDrawing || revealed) return;
        e.preventDefault();
        const { x, y } = pos(e);
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        // Small trailing circles for smooth feel
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        updatePct();
    }

    function updatePct() {
        // Sample every 4th pixel for performance
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0, total = 0;
        for (let i = 3; i < data.length; i += 16) { if (data[i] < 128) transparent++; total++; }
        const pct = Math.round(transparent / total * 100);
        fillEl.style.width = Math.min(pct, 100) + "%";
        pctEl.textContent = pct + "% scratched";

        if (pct >= 62 && !revealed) {
            revealed = true;
            setTimeout(() => {
                canvas.style.transition = "opacity 0.7s ease";
                canvas.style.opacity = "0";
                setTimeout(() => { canvas.style.display = "none"; }, 700);
                fillEl.style.width = "100%";
                pctEl.textContent = "100% revealed! 🎉";
                launchConfetti();
                showToast("💌 Revealed!", "Your hidden message is here!");
            }, 180);
        }
    }

    canvas.addEventListener("mousedown", e => { isDrawing = true; scratch(e); });
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", () => { isDrawing = false; });
    canvas.addEventListener("mouseleave", () => { isDrawing = false; });
    canvas.addEventListener("touchstart", e => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener("touchmove", e => scratch(e), { passive: false });
    canvas.addEventListener("touchend", () => { isDrawing = false; });

    document.getElementById("scratchNew").addEventListener("click", buildCard);
    buildCard();
}

/* ============================================================
   GAME TAB SWITCHING
   ============================================================ */
function initGameTabs() {
    document.querySelectorAll(".gtab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".gtab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".gpanel").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById("gpanel-" + tab.dataset.game).classList.add("active");
        });
    });
}

/* ============================================================
   SECTION LOCKS — blur everything except countdown until April 19
   ============================================================ */
function initSectionLocks() {
    const unlocked = isSurpriseUnlocked();
    const lockables = document.querySelectorAll(".lockable");

    if (unlocked) {
        // Reveal all sections immediately (or with a staggered animation)
        lockables.forEach((el, i) => {
            setTimeout(() => el.classList.add("revealed"), i * 200);
        });
        // Hide the unlock hint in countdown
        const hint = document.getElementById("cdUnlockHint");
        if (hint) hint.style.display = "none";
    } else {
        // Seed sparkle emojis into each veil-sparks div
        document.querySelectorAll(".veil-sparks").forEach(sparks => {
            const emojis = ["💕", "🌸", "✨", "💫", "❤️", "🦋"];
            for (let i = 0; i < 4; i++) {
                const s = document.createElement("span");
                s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                s.style.cssText = `
                    position:absolute; font-size:${0.8 + Math.random() * 0.6}rem;
                    left:${Math.random() * 85}%; top:${Math.random() * 80}%;
                    opacity:0.5;
                    animation: sparkleFloat ${2 + Math.random() * 2}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                    pointer-events:none;
                `;
                sparks.appendChild(s);
            }
        });
    }
}

/* ============================================================
   COUNTDOWN CANVAS — particles in the countdown section
   ============================================================ */
function initCountdownCanvas() {
    const canvas = document.getElementById("cdCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const COUNT = 120;
    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.5 + 0.2),
        opacity: Math.random() * 0.6 + 0.2,
        color: ["#ff6b9d", "#c678dd", "#ff9ff3", "#ffffff"][Math.floor(Math.random() * 4)],
    }));

    // Shooting stars
    const stars = Array.from({ length: 5 }, () => makeShootingStar(canvas));
    function makeShootingStar(c) {
        return {
            x: Math.random() * c.width,
            y: Math.random() * c.height * 0.5,
            len: Math.random() * 80 + 60,
            speed: Math.random() * 4 + 3,
            angle: Math.PI / 5,
            opacity: 0,
            life: 0,
            maxLife: Math.random() * 80 + 60,
            delay: Math.random() * 200,
        };
    }

    let frame = 0;
    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        // Particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity * (0.7 + 0.3 * Math.sin(frame * 0.02 + p.x));
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
            if (p.x < -5 || p.x > canvas.width + 5) p.vx *= -1;
        });

        // Shooting stars
        ctx.globalAlpha = 1;
        stars.forEach((s, i) => {
            if (frame < s.delay) return;
            s.life++;
            const progress = s.life / s.maxLife;
            s.opacity = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;

            const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
            grad.addColorStop(0, `rgba(255,159,243,${s.opacity * 0.9})`);
            grad.addColorStop(1, "rgba(255,159,243,0)");
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            if (s.life >= s.maxLife || s.x > canvas.width + 20 || s.y > canvas.height + 20) {
                stars[i] = makeShootingStar(canvas);
                stars[i].delay = frame + Math.random() * 120 + 40;
            }
        });

        ctx.globalAlpha = 1;
    }
    draw();
}

/* ============================================================
   COUNTDOWN HYPE MESSAGES — cycling text
   ============================================================ */
function initHypeMessages() {
    const el = document.getElementById("cdHype");
    if (!el) return;

    const messages = [
        "✨ Every second brings something extraordinary closer to you ✨",
        "🌸 The universe is getting ready to celebrate YOU 🌸",
        "💫 Something magical has been prepared just for you 💫",
        "❤️ She deserves the whole world — and more ❤️",
        "🎂 The most beautiful day of the year is almost here 🎂",
        "💕 Every moment counted down with love, just for you 💕",
        "🌟 April 19 — the day the world became a better place 🌟",
        "✨ Hold on, something extraordinary is waiting for you ✨",
    ];
    let idx = 0;

    setInterval(() => {
        el.classList.add("fade");
        setTimeout(() => {
            idx = (idx + 1) % messages.length;
            el.textContent = messages[idx];
            el.classList.remove("fade");
        }, 600);
    }, 4000);
}

/* ============================================================
   SX OVERLAY BACKGROUND CANVAS (shooting stars + particles)
   ============================================================ */
function initSxBgCanvas() {
    const canvas = document.getElementById("sxBgCanvas");
    if (!canvas) return;

    // Fall back to Canvas 2D if Three.js / WebGL unavailable
    if (typeof THREE === "undefined") { initCanvas2DParticles("sxBgCanvas", 150); return; }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1);

        // Star field
        const COUNT = 200;
        const pos = new Float32Array(COUNT * 3);
        const col = new Float32Array(COUNT * 3);
        const palette = [new THREE.Color(0xff6b9d), new THREE.Color(0xc678dd), new THREE.Color(0xff9ff3), new THREE.Color(0xffffff)];

        for (let i = 0; i < COUNT; i++) {
            pos[i * 3] = (Math.random() - .5) * 180;
            pos[i * 3 + 1] = (Math.random() - .5) * 180;
            pos[i * 3 + 2] = (Math.random() - .5) * 80;
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const starPoints = new THREE.Points(starGeo, new THREE.PointsMaterial({
            size: 0.9, vertexColors: true, transparent: true, opacity: 0.6,
            blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        scene.add(starPoints);

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animateBg() {
            requestAnimationFrame(animateBg);
            const t = Date.now() * 0.0003;
            starPoints.rotation.y = t * 0.08;
            starPoints.rotation.x = t * 0.04;
            renderer.render(scene, camera);
        }
        animateBg();
    } catch (e) {
        console.warn("WebGL unavailable for sx background:", e.message);
        initCanvas2DParticles("sxBgCanvas", 150);
    }
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    /* Helper: run each init safely so one failure doesn't block the rest */
    function safe(fn, label) {
        try { fn(); } catch (e) { console.warn("[BOOT]", label || fn.name, "failed:", e.message); }
    }

    /* ── CRITICAL: unlock sections first so content is always visible on April 19 ── */
    safe(initSectionLocks, "initSectionLocks");
    safe(initSurpriseLock, "initSurpriseLock");
    safe(initMusic, "initMusic");

    /* ── Visual / cosmetic inits ── */
    safe(initHeroThreeJS, "initHeroThreeJS");
    safe(initFloatingHearts, "initFloatingHearts");
    safe(initCountdown, "initCountdown");
    safe(initCountdownCanvas, "initCountdownCanvas");
    safe(initHypeMessages, "initHypeMessages");
    safe(initCarousel, "initCarousel");
    safe(initTimeline, "initTimeline");
    safe(initScrollReveal, "initScrollReveal");
    safe(initSurpriseExperience, "initSurpriseExperience");
    safe(initSxBgCanvas, "initSxBgCanvas");
    safe(initNavbar, "initNavbar");

    /* ── Games — only init if unlocked ── */
    if (isSurpriseUnlocked()) {
        safe(initGameTabs, "initGameTabs");
        safe(initMemoryGame, "initMemoryGame");
        safe(initSpinWheel, "initSpinWheel");
        safe(initScratchCard, "initScratchCard");
    }
});
