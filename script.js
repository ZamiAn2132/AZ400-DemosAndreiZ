/* ─── script.js ─────────────────────────────────────────────── */

// ── 1. Particle Canvas Background ────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    const ctx    = canvas.getContext('2d');

    let W, H, particles = [];

    const COLORS = ['#0078d4', '#00b4d8', '#7b2ff7', '#ffffff'];

    class Particle {
        constructor() { this.reset(true); }

        reset(init = false) {
            this.x  = Math.random() * W;
            this.y  = init ? Math.random() * H : H + 10;
            this.r  = Math.random() * 1.5 + 0.3;
            this.vy = -(Math.random() * 0.4 + 0.15);
            this.vx = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10) this.reset();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle   = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        particles = Array.from({ length: 140 }, () => new Particle());
        loop();
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);

        // subtle radial glow in top-right
        const grd = ctx.createRadialGradient(W * 0.75, H * 0.2, 0, W * 0.75, H * 0.2, W * 0.55);
        grd.addColorStop(0, 'rgba(123,47,247,0.07)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // second glow bottom-left
        const grd2 = ctx.createRadialGradient(W * 0.2, H * 0.8, 0, W * 0.2, H * 0.8, W * 0.4);
        grd2.addColorStop(0, 'rgba(0,120,212,0.06)');
        grd2.addColorStop(1, 'transparent');
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, W, H);

        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    init();
})();


// ── 2. Navbar scroll state ────────────────────────────────────
(function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    });
})();


// ── 3. Typewriter – azure-pipelines.yml ──────────────────────
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    // colour-coded YAML  (using span classes defined in CSS)
    const lines = [
        '<span class="c"># azure-pipelines.yml</span>',
        '<span class="c"># Curs AZ-400 — Andrei</span>',
        '',
        '<span class="p">trigger</span>:',
        '  <span class="p">branches</span>:',
        '    <span class="p">include</span>: [<span class="s">main</span>, <span class="s">develop</span>]',
        '',
        '<span class="p">pool</span>:',
        '  <span class="p">vmImage</span>: <span class="s">ubuntu-latest</span>',
        '',
        '<span class="p">stages</span>:',
        '  - <span class="p">stage</span>: <span class="n">Build</span>',
        '    <span class="p">jobs</span>:',
        '    - <span class="p">job</span>: <span class="n">BuildJob</span>',
        '      <span class="p">steps</span>:',
        '      - <span class="p">task</span>: <span class="n">DotNetCoreCLI@2</span>',
        '        <span class="p">inputs</span>:',
        '          <span class="p">command</span>: <span class="s">build</span>',
        '',
        '  - <span class="p">stage</span>: <span class="n">Deploy</span>',
        '    <span class="p">dependsOn</span>: <span class="v">Build</span>',
        '    <span class="p">condition</span>: <span class="v">succeeded()</span>',
        '    <span class="p">jobs</span>:',
        '    - <span class="p">deployment</span>: <span class="n">DeployProd</span>',
        '      <span class="p">environment</span>: <span class="s">production</span>',
        '<span class="c">  # ✓ Pipeline complete!</span>',
    ];

    let lineIdx = 0, charIdx = 0;
    let rendered = '';

    function type() {
        if (lineIdx >= lines.length) {
            // restart after 3 s
            setTimeout(() => {
                lineIdx = 0; charIdx = 0; rendered = '';
                el.innerHTML = '';
                type();
            }, 3000);
            return;
        }

        const line = lines[lineIdx];

        // For HTML-tagged lines, dump the whole line at once
        if (line.includes('<span')) {
            rendered += line + '\n';
            el.innerHTML = rendered + '<span class="cursor">▌</span>';
            lineIdx++; charIdx = 0;
            setTimeout(type, 55);
        } else if (charIdx < line.length) {
            rendered += line[charIdx];
            el.innerHTML = rendered + '<span class="cursor">▌</span>';
            charIdx++;
            setTimeout(type, 28);
        } else {
            rendered += '\n';
            el.innerHTML = rendered + '<span class="cursor">▌</span>';
            lineIdx++; charIdx = 0;
            setTimeout(type, 80);
        }
    }

    // cursor blink style
    const style = document.createElement('style');
    style.textContent = `.cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`;
    document.head.appendChild(style);

    setTimeout(type, 800);
})();


// ── 4. Counter animation ──────────────────────────────────────
(function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const animate = (el) => {
        const target = +el.dataset.target;
        const duration = 1600;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); }
        });
    }, { threshold: 0.6 });

    counters.forEach(c => observer.observe(c));
})();


// ── 5. Pipeline loop – cycling active step ────────────────────
(function initPipelineLoop() {
    const items = document.querySelectorAll('.loop-item');
    let current = 0;

    if (!items.length) return;

    function activate(idx) {
        items.forEach(i => i.classList.remove('active'));
        items[idx].classList.add('active');
        delete items[idx].dataset.active; // remove initial inline attr
    }

    // start after page load
    setTimeout(() => {
        setInterval(() => {
            current = (current + 1) % items.length;
            activate(current);
        }, 1400);
    }, 2000);
})();


// ── 6. Scroll-reveal (fade-in-up) ────────────────────────────
(function initScrollReveal() {
    const targets = [
        ...document.querySelectorAll('.module-card'),
        ...document.querySelectorAll('.loop-item'),
        document.querySelector('.instructor-card'),
    ].filter(Boolean);

    targets.forEach(el => el.classList.add('fade-in-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 60);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(t => observer.observe(t));
})();


// ── 7. Smooth hero title entrance ────────────────────────────
(function initHeroEntrance() {
    const parts = ['.eyebrow', '.line-sm', '.line-lg', '.line-instructor', '.hero-sub', '.hero-actions', '.hero-stats'];
    parts.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + i * 130);
    });
})();
