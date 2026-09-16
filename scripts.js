/* ==========================================================================
   İlhan Bahadır Yavaş - Portfolio
   Vanilla ES2018+. No build step, no framework, no CDN dependency.

   Modules
   -------------------------------------------------------------------------
   1.  Project data
   2.  Hero WebGL field (domain-warped fbm, adaptive resolution)
   3.  Header stuck state and scroll spy (IntersectionObserver only)
   4.  Mobile drawer
   5.  Scroll reveal
   6.  Project card cursor spotlight
   7.  Tech stack filter (accessible tablist)
   8.  Copy email
   9.  Back to top
   10. Project modal with focus trap

   There is no window scroll listener anywhere in this file. Every
   scroll-driven state is derived from IntersectionObserver.
   ========================================================================== */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ======================================================================
       1. Project data
       ====================================================================== */

    var PROJECTS = {
        'c-building': {
            title: 'Project C-Building',
            subtitle: 'Co-op Isometric Action Roguelite',
            kicker: 'Unity / Systems Programmer',
            description: 'A 4-player co-op isometric action roguelite built in Unity, spanning 5 distinct biomes and a hero roster of 8 playable characters with fully composable ability kits.',
            features: [
                'Architected a data-driven combat framework (ComposedAbilitySO pipeline) replacing hardcoded per-hero logic, letting designers compose abilities from reusable Effect and Delivery primitives while preserving hooks for bespoke hero mechanics.',
                'Built the multiplayer networking foundation on Unity Netcode for GameObjects and UGS Relay/Lobby, including a session state machine, additive scene loading, and per-client camera isolation across 4 concurrent players.',
                'Designed a dual-camera system, a fixed isometric view plus a free-look observer mode, driving the asymmetric finale where one player becomes a stationary tactical overseer for the remaining team.',
                'Implemented a branching music system using DSP-time-anchored bar-aligned transitions across 5 biome soundtracks and a 3-state combat and escape sequence, keeping tempo-locked layer switching free of desync.',
                'Collaborated directly with a game designer to translate evolving GDD and LDD specifications into versioned technical architecture, flagging design and implementation gaps before development started.'
            ],
            technologies: ['Unity', 'C#', 'Netcode for GameObjects', 'UGS Relay/Lobby', 'URP', 'ScriptableObject Composition', 'OOP']
        },
        'bubbles': {
            title: 'Bubbles',
            subtitle: 'AI-Powered Turkish News Platform',
            kicker: 'Senior Capstone / Backend Lead and Scrum Master',
            awards: [
                'Best Senior Project, System Development Award, CTIS Awards 2026',
                'Best Presentation, Startup Studio Demo Day 2026'
            ],
            description: 'A production news platform that ingests Turkish news feeds and enriches them with AI: summarization, political and writing perspective scoring, and multilingual semantic search.',
            features: [
                'Led the team Agile and Scrum process across bi-weekly sprints, backlog grooming and retrospectives, coordinating frontend, backend and AI/ML developers in Jira.',
                'Architected and operated the backend: containerized microservices on Railway, PM2 background workers for RSS ingestion and AI processing, and a Redis and BullMQ job queue.',
                'Built CI/CD pipelines with GitHub Actions automating build, test and deployment, then added health-check endpoints and external uptime monitoring after diagnosing a production outage.',
                'Managed MongoDB Atlas indexing, TTL policies and performance tuning, alongside a Qdrant vector database powering multilingual semantic search.',
                'Integrated AI into production: a fine-tuned mBART Turkish summarizer plus political and writing perspective-score models served on Modal Labs GPUs, with LLM taggers for enrichment.'
            ],
            technologies: ['Node.js', 'Docker', 'MongoDB Atlas', 'Qdrant', 'Redis + BullMQ', 'Modal Labs GPU', 'GitHub Actions', 'PM2']
        },
        'bloomwake': {
            title: 'BloomWake',
            subtitle: 'Browser-Based Swarm Survivor',
            kicker: 'CrazyGames / Solo Developer',
            description: 'A high-performance bounded-swarm survivor game for the browser, engineered so that hundreds of simultaneous on-screen entities never cost the frame budget.',
            features: [
                'Optimized rendering path that keeps hundreds of concurrent enemies on screen without frame drops.',
                'Object pooling and allocation-free hot paths through the update loop.',
                'Spatial partitioning to keep broadphase collision cost near-linear as the swarm grows.',
                'Bounded-arena wave design tuned so difficulty scales with player power rather than raw entity count.'
            ],
            technologies: ['JavaScript', 'Canvas/WebGL', 'Vector Math', 'Spatial Partitioning', 'Object Pooling']
        },
        'aerodrop': {
            title: 'AeroDrop',
            subtitle: 'Physics-Based Cell-Growing Game',
            kicker: 'CrazyGames / Solo Developer',
            description: 'A physics-driven browser game where the player grows by absorbing mass, built around integrated water physics and a movement system whose cost scales with size.',
            features: [
                'Integrated water physics simulation driving buoyancy, drag and momentum.',
                'Mass-based Jet Boost movement system that trades size for acceleration.',
                'Dynamic bot AI simulation producing a populated arena without a server.',
                'Vector-math driven collision and absorption rules tuned for readable feedback.'
            ],
            technologies: ['TypeScript', 'JavaScript', 'Canvas/WebGL', 'Vector Math', 'Bot AI']
        },
        'not-enough-mana': {
            title: 'Not Enough Mana',
            subtitle: '2D Browser Card Game',
            kicker: 'PixiJS / Solo Developer',
            description: 'A 2D browser-based card game developed from scratch in PixiJS, with its own rendering pipeline, asset management and turn-based state logic.',
            features: [
                'Modular graphics rendering pipeline built directly on PixiJS and HTML5 Canvas.',
                'Custom asset management layer handling loading, atlases and runtime lookup.',
                'Robust turn-based game state machine covering draw, play, resolve and end-turn phases.',
                'Data-driven card definitions, so new cards are content rather than code.'
            ],
            technologies: ['PixiJS', 'HTML5 Canvas', 'JavaScript', 'Game State Management']
        },
        'zombie-survival': {
            title: 'Zombie Survival',
            subtitle: 'Unreal Engine 5 Co-op Prototype',
            kicker: 'Unreal Engine 5 / Solo Developer',
            video: 'https://youtu.be/PsBm4uJqYyc',
            description: 'A cooperative survival loop prototype featuring round pacing, resource pressure, and health and damage feedback including screen shake, post-process effects and audio cues.',
            features: [
                'Enemy AI authored with Behavior Trees and the Environment Query System.',
                'NavMesh integration with spawn timer and aggro tuning for balanced difficulty.',
                'Scalable Blueprint systems for pickups, combat and inventory management.',
                'Level blockouts designed for player flow, choke points and sight lines.',
                'Debug tooling including on-screen counters for real-time gameplay analysis.'
            ],
            technologies: ['UE5', 'Blueprints', 'Behavior Trees', 'NavMesh', 'EQS', 'DataTables', 'Perception']
        }
    };

    /* ======================================================================
       2. Hero WebGL field

       A fullscreen-triangle fragment shader: two levels of domain warping
       over value-noise fbm, producing a slow anthracite flow with sparse
       accent filaments. Rendered below native resolution and upscaled, so
       the GPU cost stays flat even on integrated hardware.
       ====================================================================== */

    var VERT_SRC = [
        'attribute vec2 a_pos;',
        'void main() {',
        '  gl_Position = vec4(a_pos, 0.0, 1.0);',
        '}'
    ].join('\n');

    var FRAG_SRC = [
        'precision highp float;',
        '',
        'uniform vec2  u_res;',
        'uniform float u_time;',
        'uniform vec2  u_pointer;',
        'uniform vec3  u_base;',
        'uniform vec3  u_lift;',
        'uniform vec3  u_accent;',
        '',
        'float hash(vec2 p) {',
        '  vec3 p3 = fract(vec3(p.xyx) * 0.1031);',
        '  p3 += dot(p3, p3.yzx + 33.33);',
        '  return fract((p3.x + p3.y) * p3.z);',
        '}',
        '',
        'float noise(vec2 p) {',
        '  vec2 i = floor(p);',
        '  vec2 f = fract(p);',
        '  vec2 u = f * f * (3.0 - 2.0 * f);',
        '  float a = hash(i);',
        '  float b = hash(i + vec2(1.0, 0.0));',
        '  float c = hash(i + vec2(0.0, 1.0));',
        '  float d = hash(i + vec2(1.0, 1.0));',
        '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
        '}',
        '',
        'float fbm(vec2 p) {',
        '  float sum = 0.0;',
        '  float amp = 0.5;',
        '  for (int i = 0; i < 5; i++) {',
        '    sum += amp * noise(p);',
        '    p = p * 2.03 + vec2(1.7, 9.2);',
        '    amp *= 0.5;',
        '  }',
        '  return sum;',
        '}',
        '',
        'void main() {',
        '  vec2 uv = gl_FragCoord.xy / u_res;',
        '  vec2 p  = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);',
        '',
        '  float t = u_time * 0.042;',
        '  p += (u_pointer - 0.5) * 0.14;',
        '',
        '  vec2 sp = p * 2.15;',
        '',
        '  vec2 q = vec2(fbm(sp + t), fbm(sp + vec2(5.2, 1.3) - t * 0.8));',
        '  vec2 r = vec2(fbm(sp + 2.0 * q + vec2(1.7, 9.2) + t * 1.15),',
        '                fbm(sp + 2.0 * q + vec2(8.3, 2.8) - t * 0.90));',
        '  float f = fbm(sp + 2.0 * r);',
        '',
        '  vec3 col = mix(u_base, u_lift, clamp(f * f * 1.95, 0.0, 1.0));',
        '',
        '  float ridge = clamp(1.0 - abs(r.x - r.y) * 3.9, 0.0, 1.0);',
        '  float filament = pow(ridge, 8.5) * smoothstep(0.26, 0.82, f);',
        '  col += u_accent * filament * 0.20;',
        '',
        '  float aspect = u_res.x / max(u_res.y, 1.0);',
        '  float d = length((uv - u_pointer) * vec2(aspect, 1.0));',
        '  col += u_accent * smoothstep(0.62, 0.0, d) * 0.026;',
        '',
        '  col *= 1.0 - 0.62 * pow(length(p * vec2(0.86, 1.0)), 2.0);',
        '',
        '  col += (hash(gl_FragCoord.xy + u_time) - 0.5) / 210.0;',
        '',
        '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
        '}'
    ].join('\n');

    function compile(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function initHeroField() {
        var canvas = document.getElementById('hero-canvas');
        var hero = document.getElementById('home');
        if (!canvas || !hero) { return; }

        var attrs = {
            alpha: false,
            antialias: false,
            depth: false,
            stencil: false,
            powerPreference: 'low-power',
            preserveDrawingBuffer: false
        };

        var gl = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs);

        // No WebGL: the CSS gradient painted on .hero-canvas-wrap stays visible.
        if (!gl) {
            canvas.remove();
            return;
        }

        var vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
        var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
        if (!vs || !fs) { canvas.remove(); return; }

        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link failed:', gl.getProgramInfoLog(program));
            canvas.remove();
            return;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.useProgram(program);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        );

        var aPos = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        var uRes = gl.getUniformLocation(program, 'u_res');
        var uTime = gl.getUniformLocation(program, 'u_time');
        var uPointer = gl.getUniformLocation(program, 'u_pointer');

        gl.uniform3f(gl.getUniformLocation(program, 'u_base'), 0.039, 0.043, 0.051);
        gl.uniform3f(gl.getUniformLocation(program, 'u_lift'), 0.098, 0.116, 0.138);
        gl.uniform3f(gl.getUniformLocation(program, 'u_accent'), 0.659, 0.886, 0.298);

        // Render below native resolution. Cheap, and the field is soft enough
        // that the upscale is invisible.
        var lowPower = (navigator.hardwareConcurrency || 8) <= 4;
        var renderScale = lowPower ? 0.55 : 0.72;
        var dprCap = 1.5;

        var pointer = { x: 0.62, y: 0.42 };
        var smoothed = { x: 0.62, y: 0.42 };

        var running = false;
        var visible = true;
        var inView = true;
        var rafId = 0;
        var startTime = 0;
        var elapsed = 0;
        var lastFrame = 0;
        var slowFrames = 0;
        var downscaled = false;

        function resize() {
            var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            var w = Math.max(1, Math.round(canvas.clientWidth * dpr * renderScale));
            var h = Math.max(1, Math.round(canvas.clientHeight * dpr * renderScale));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
                gl.uniform2f(uRes, w, h);
            }
        }

        function draw(time) {
            gl.uniform1f(uTime, time);
            gl.uniform2f(uPointer, smoothed.x, smoothed.y);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        function frame(now) {
            if (!running) { return; }
            rafId = window.requestAnimationFrame(frame);

            if (!startTime) { startTime = now; lastFrame = now; }
            var delta = now - lastFrame;
            lastFrame = now;
            elapsed += Math.min(delta, 50) / 1000;

            // One-shot adaptive downscale if the device cannot hold the budget.
            if (!downscaled && elapsed > 1.5) {
                slowFrames = delta > 26 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
                if (slowFrames > 45) {
                    downscaled = true;
                    renderScale = 0.45;
                    resize();
                }
            }

            smoothed.x += (pointer.x - smoothed.x) * 0.045;
            smoothed.y += (pointer.y - smoothed.y) * 0.045;

            draw(elapsed);
        }

        function start() {
            if (running || prefersReducedMotion.matches) { return; }
            running = true;
            lastFrame = 0;
            startTime = 0;
            rafId = window.requestAnimationFrame(frame);
        }

        function stop() {
            running = false;
            if (rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
        }

        function sync() {
            if (visible && inView) { start(); } else { stop(); }
        }

        function renderStatic() {
            resize();
            smoothed.x = pointer.x;
            smoothed.y = pointer.y;
            draw(12.0);
        }

        // Pointer parallax. Values are read in the rAF loop, never in a handler.
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            hero.addEventListener('pointermove', function (event) {
                var rect = hero.getBoundingClientRect();
                pointer.x = (event.clientX - rect.left) / rect.width;
                pointer.y = 1 - (event.clientY - rect.top) / rect.height;
            }, { passive: true });
        }

        var resizeTimer = 0;
        window.addEventListener('resize', function () {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(function () {
                resize();
                if (!running) { renderStatic(); }
            }, 120);
        }, { passive: true });

        document.addEventListener('visibilitychange', function () {
            visible = !document.hidden;
            sync();
        });

        // Stop the loop entirely once the hero scrolls away.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
                sync();
            }, { threshold: 0 }).observe(hero);
        }

        canvas.addEventListener('webglcontextlost', function (event) {
            event.preventDefault();
            stop();
        });

        canvas.addEventListener('webglcontextrestored', function () {
            window.location.reload();
        });

        function onMotionChange() {
            if (prefersReducedMotion.matches) {
                stop();
                renderStatic();
            } else {
                sync();
            }
        }
        if (prefersReducedMotion.addEventListener) {
            prefersReducedMotion.addEventListener('change', onMotionChange);
        } else if (prefersReducedMotion.addListener) {
            prefersReducedMotion.addListener(onMotionChange);
        }

        resize();
        if (prefersReducedMotion.matches) {
            renderStatic();
        } else {
            draw(0);
            start();
        }
        canvas.classList.add('is-live');
    }

    /* ======================================================================
       3. Header stuck state and scroll spy
       ====================================================================== */

    function initHeaderState() {
        var header = document.getElementById('site-header');
        if (!header || !('IntersectionObserver' in window)) { return; }

        var sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
        document.body.prepend(sentinel);

        new IntersectionObserver(function (entries) {
            header.classList.toggle('is-stuck', !entries[0].isIntersecting);
        }, { rootMargin: '-8px 0px 0px 0px', threshold: 0 }).observe(sentinel);
    }

    function initScrollSpy() {
        if (!('IntersectionObserver' in window)) { return; }

        var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
        if (!links.length) { return; }

        var ratios = Object.create(null);

        var targets = links
            .map(function (link) {
                var id = link.getAttribute('href').slice(1);
                var section = document.getElementById(id);
                if (section) { ratios[id] = 0; }
                return section;
            })
            .filter(Boolean);

        if (!targets.length) { return; }

        function paint() {
            var bestId = null;
            var bestRatio = 0;
            for (var id in ratios) {
                if (ratios[id] > bestRatio) { bestRatio = ratios[id]; bestId = id; }
            }
            links.forEach(function (link) {
                link.classList.toggle(
                    'is-current',
                    bestId !== null && link.getAttribute('href') === '#' + bestId
                );
            });
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
            });
            paint();
        }, {
            rootMargin: '-76px 0px -45% 0px',
            threshold: [0, 0.12, 0.3, 0.55, 0.8, 1]
        });

        targets.forEach(function (section) { observer.observe(section); });
    }

    /* ======================================================================
       4. Mobile drawer
       ====================================================================== */

    function initDrawer() {
        var toggle = document.getElementById('nav-toggle');
        var drawer = document.getElementById('nav-drawer');
        if (!toggle || !drawer) { return; }

        function setOpen(open) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu');
            drawer.hidden = !open;
            document.body.style.overflow = open ? 'hidden' : '';
            if (open) {
                var first = drawer.querySelector('.nav-drawer-link');
                if (first) { first.focus(); }
            }
        }

        toggle.addEventListener('click', function () {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        drawer.addEventListener('click', function (event) {
            if (event.target.closest('a')) { setOpen(false); }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setOpen(false);
                toggle.focus();
            }
        });

        var desktop = window.matchMedia('(min-width: 1024px)');
        function onBreakpoint() {
            if (desktop.matches) { setOpen(false); }
        }
        if (desktop.addEventListener) {
            desktop.addEventListener('change', onBreakpoint);
        } else if (desktop.addListener) {
            desktop.addListener(onBreakpoint);
        }
    }

    /* ======================================================================
       5. Scroll reveal
       ====================================================================== */

    function initReveal() {
        var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
        if (!items.length) { return; }

        if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
            items.forEach(function (item) { item.classList.add('is-in'); });
            return;
        }

        var groups = new Map();
        items.forEach(function (item) {
            var parent = item.parentElement;
            var index = groups.get(parent) || 0;
            item.style.setProperty('--reveal-delay', Math.min(index, 5) * 70 + 'ms');
            groups.set(parent, index + 1);
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        items.forEach(function (item) { observer.observe(item); });

        // Failsafe: content is never allowed to stay invisible, whatever the
        // observer does. Anything still hidden after 4s is shown outright.
        window.setTimeout(function () {
            items.forEach(function (item) {
                if (!item.classList.contains('is-in')) {
                    item.style.setProperty('--reveal-delay', '0ms');
                    item.classList.add('is-in');
                }
            });
        }, 4000);
    }

    /* ======================================================================
       6. Project card cursor spotlight
       ====================================================================== */

    function initSpotlight() {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }
        if (prefersReducedMotion.matches) { return; }

        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-spotlight]'));
        if (!cards.length) { return; }

        var pending = null;
        var queued = false;

        function flush() {
            queued = false;
            if (!pending) { return; }
            pending.card.style.setProperty('--mx', pending.x + 'px');
            pending.card.style.setProperty('--my', pending.y + 'px');
            pending = null;
        }

        cards.forEach(function (card) {
            card.addEventListener('pointermove', function (event) {
                var rect = card.getBoundingClientRect();
                pending = {
                    card: card,
                    x: Math.round(event.clientX - rect.left),
                    y: Math.round(event.clientY - rect.top)
                };
                if (!queued) {
                    queued = true;
                    window.requestAnimationFrame(flush);
                }
            }, { passive: true });
        });
    }

    /* ======================================================================
       7. Tech stack filter
       ====================================================================== */

    function initStackFilter() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.stack-tab'));
        var items = Array.prototype.slice.call(document.querySelectorAll('.stack-item'));
        var panel = document.getElementById('stack-panel');
        var count = document.getElementById('stack-count');
        if (!tabs.length || !items.length) { return; }

        var LABELS = {
            all: 'technologies',
            systems: 'systems and engine technologies',
            backend: 'backend technologies',
            devops: 'DevOps technologies',
            web: 'web technologies'
        };

        function apply(filter) {
            var shown = 0;
            items.forEach(function (item) {
                var match = filter === 'all' || item.getAttribute('data-cat') === filter;
                item.classList.toggle('is-muted', !match);
                if (match) { shown += 1; }
            });
            if (count) {
                count.textContent = (filter === 'all' ? 'Showing all ' : 'Showing ') +
                    shown + ' ' + LABELS[filter];
            }
        }

        function select(tab, moveFocus) {
            tabs.forEach(function (other) {
                var active = other === tab;
                other.classList.toggle('is-active', active);
                other.setAttribute('aria-selected', active ? 'true' : 'false');
                other.tabIndex = active ? 0 : -1;
            });
            if (panel) { panel.setAttribute('aria-labelledby', tab.id); }
            apply(tab.getAttribute('data-filter'));
            if (moveFocus) { tab.focus(); }
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () { select(tab, false); });

            tab.addEventListener('keydown', function (event) {
                var next = null;
                if (event.key === 'ArrowRight') { next = tabs[(index + 1) % tabs.length]; }
                else if (event.key === 'ArrowLeft') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
                else if (event.key === 'Home') { next = tabs[0]; }
                else if (event.key === 'End') { next = tabs[tabs.length - 1]; }
                if (next) {
                    event.preventDefault();
                    select(next, true);
                }
            });
        });

        apply('all');
    }

    /* ======================================================================
       8. Copy email
       ====================================================================== */

    function initCopyEmail() {
        var button = document.getElementById('copy-btn');
        var label = document.getElementById('copy-btn-label');
        var status = document.getElementById('copy-status');
        if (!button || !label) { return; }

        var value = button.getAttribute('data-copy') || '';
        var resetTimer = 0;

        function fallbackCopy(text) {
            var field = document.createElement('textarea');
            field.value = text;
            field.setAttribute('readonly', '');
            field.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
            document.body.appendChild(field);
            field.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
            document.body.removeChild(field);
            return ok;
        }

        function settle(ok) {
            label.textContent = ok ? 'Copied' : 'Copy Failed';
            if (status) {
                status.textContent = ok
                    ? value + ' copied to your clipboard.'
                    : 'Could not reach the clipboard. Select the address and copy it manually.';
            }
            window.clearTimeout(resetTimer);
            resetTimer = window.setTimeout(function () {
                label.textContent = 'Copy Email';
                if (status) { status.textContent = ''; }
            }, 3200);
        }

        button.addEventListener('click', function () {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(value).then(
                    function () { settle(true); },
                    function () { settle(fallbackCopy(value)); }
                );
            } else {
                settle(fallbackCopy(value));
            }
        });
    }

    /* ======================================================================
       9. Back to top
       ====================================================================== */

    function initBackToTop() {
        var button = document.getElementById('to-top');
        var hero = document.getElementById('home');
        if (!button || !hero) { return; }

        button.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
            var brand = document.querySelector('.nav-brand');
            if (brand) { brand.focus({ preventScroll: true }); }
        });

        if (!('IntersectionObserver' in window)) {
            button.hidden = false;
            return;
        }

        new IntersectionObserver(function (entries) {
            button.hidden = entries[0].isIntersecting;
        }, { threshold: 0 }).observe(hero);
    }

    /* ======================================================================
       10. Project modal
       ====================================================================== */

    function initModal() {
        var modal = document.getElementById('project-modal');
        var scrim = document.getElementById('modal-scrim');
        var closeBtn = document.getElementById('modal-close');
        var body = document.getElementById('modal-body');
        if (!modal || !scrim || !closeBtn || !body) { return; }

        var lastFocused = null;

        function escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function render(project) {
            if (!project) {
                body.innerHTML = '<h2 class="modal-title" id="modal-title">Details Unavailable</h2>' +
                    '<p class="modal-empty">This project has no detail entry yet. ' +
                    'Reach out by email and I will walk you through it.</p>';
                return;
            }

            var html = '';

            html += '<p class="modal-kicker">' + escapeHtml(project.kicker) + '</p>';
            html += '<h2 class="modal-title" id="modal-title">' + escapeHtml(project.title) + '</h2>';

            if (project.subtitle) {
                html += '<p class="modal-subtitle">' + escapeHtml(project.subtitle) + '</p>';
            }

            if (project.awards && project.awards.length) {
                html += '<div class="modal-awards">';
                project.awards.forEach(function (award) {
                    html += '<p class="modal-award">' +
                        '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false" style="flex:none;margin-top:2px;">' +
                        '<path fill="currentColor" d="M12 2 9.2 7.6 3 8.5l4.5 4.4L6.4 19 12 16.1 17.6 19l-1.1-6.1L21 8.5l-6.2-.9L12 2Z"/></svg>' +
                        escapeHtml(award) + '</p>';
                });
                html += '</div>';
            }

            html += '<p class="modal-desc">' + escapeHtml(project.description) + '</p>';

            if (project.features && project.features.length) {
                html += '<h3 class="modal-subhead">What I Built</h3><ul class="modal-points">';
                project.features.forEach(function (feature) {
                    html += '<li>' + escapeHtml(feature) + '</li>';
                });
                html += '</ul>';
            }

            if (project.technologies && project.technologies.length) {
                html += '<h3 class="modal-subhead">Stack</h3><ul class="tag-row">';
                project.technologies.forEach(function (tech) {
                    html += '<li class="tag">' + escapeHtml(tech) + '</li>';
                });
                html += '</ul>';
            }

            if (project.video) {
                html += '<a class="modal-video" href="' + escapeHtml(project.video) +
                    '" target="_blank" rel="noopener noreferrer">Watch Demo' +
                    '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">' +
                    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                    'stroke-linejoin="round" d="M7 17 17 7m0 0h-7m7 0v7"/></svg></a>';
            }

            body.innerHTML = html;
        }

        function focusables() {
            return Array.prototype.slice.call(modal.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(function (node) { return node.offsetParent !== null; });
        }

        function open(key) {
            lastFocused = document.activeElement;
            render(PROJECTS[key]);
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
            // Next frame, so the opacity transition has a start value to run from.
            window.requestAnimationFrame(function () {
                modal.classList.add('is-open');
                closeBtn.focus();
            });
        }

        function close() {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            var delay = prefersReducedMotion.matches ? 0 : 240;
            window.setTimeout(function () {
                modal.hidden = true;
                body.innerHTML = '';
            }, delay);
            if (lastFocused && typeof lastFocused.focus === 'function') {
                lastFocused.focus();
            }
        }

        document.addEventListener('click', function (event) {
            var trigger = event.target.closest('[data-project]');
            if (trigger) {
                event.preventDefault();
                open(trigger.getAttribute('data-project'));
            }
        });

        closeBtn.addEventListener('click', close);
        scrim.addEventListener('click', close);

        document.addEventListener('keydown', function (event) {
            if (modal.hidden) { return; }

            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }

            if (event.key !== 'Tab') { return; }

            var nodes = focusables();
            if (!nodes.length) { return; }

            var first = nodes[0];
            var last = nodes[nodes.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    /* ======================================================================
       Boot
       ====================================================================== */

    function boot() {
        initHeaderState();
        initScrollSpy();
        initDrawer();
        initReveal();
        initSpotlight();
        initStackFilter();
        initCopyEmail();
        initBackToTop();
        initModal();
        initHeroField();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }
}());
