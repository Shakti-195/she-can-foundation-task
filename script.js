/* =============================================
   SHE CAN FOUNDATION — Interactive Scripts
   Theme toggle, animations, form handling, etc.
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ---- ELEMENTS ----
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");
    const submitBtn = document.getElementById("submitBtn");
    const particlesContainer = document.getElementById("particles");

    // ---- THEME MANAGEMENT ----
    const THEME_KEY = "shecan-theme";

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
    });

    // ---- NAVBAR SCROLL ----
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle("scrolled", scrollY > 50);
        lastScroll = scrollY;
    }, { passive: true });

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll("header[id], section[id]");
    const navLinkEls = document.querySelectorAll(".nav-link[data-section]");

    function updateActiveLink() {
        let currentSection = "";
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentSection = section.id;
            }
        });

        navLinkEls.forEach(link => {
            link.classList.toggle("active", link.dataset.section === currentSection);
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    // ---- HAMBURGER MENU ----
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        navLinks.classList.toggle("open");
    });

    // Close menu on link click (mobile)
    navLinks.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("open");
            navLinks.classList.remove("open");
        });
    });

    // ---- HERO PARTICLES ----
    function createParticles() {
        if (!particlesContainer) return;
        const count = window.innerWidth < 640 ? 12 : 25;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("span");
            particle.classList.add("particle");
            particle.style.left = Math.random() * 100 + "%";
            particle.style.top = Math.random() * 100 + "%";
            particle.style.animationDelay = Math.random() * 6 + "s";
            particle.style.animationDuration = (4 + Math.random() * 4) + "s";
            particle.style.width = (2 + Math.random() * 4) + "px";
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ---- ANIMATED STAT COUNTERS ----
    const statNumbers = document.querySelectorAll(".stat-number[data-count]");
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statsCounted = true;

        statNumbers.forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1800;
            const startTime = performance.now();

            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * ease);
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        });
    }

    // ---- SCROLL REVEAL ----
    const revealElements = document.querySelectorAll(
        ".about .section-tag, .about .section-title, .about-grid, " +
        ".mission .section-tag, .mission .section-title, .mission-grid, " +
        ".contact .section-tag, .contact .section-title, .contact .section-subtitle, .contact-wrapper, " +
        ".footer-top"
    );

    revealElements.forEach(el => el.classList.add("reveal"));

    // Add stagger to grids
    document.querySelectorAll(".mission-grid, .about-features").forEach(el => {
        el.classList.add("reveal-stagger");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => {
        revealObserver.observe(el);
    });

    // Stats counter trigger
    const statsSection = document.querySelector(".hero-stats");
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ---- CONTACT FORM ----
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Clear previous state
        successMessage.className = "form-message";
        successMessage.textContent = "";

        if (name === "" || email === "" || message === "") {
            successMessage.classList.add("error");
            successMessage.textContent = "⚠ Please fill in all fields.";
            shakeElement(submitBtn);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            successMessage.classList.add("error");
            successMessage.textContent = "⚠ Please enter a valid email address.";
            shakeElement(submitBtn);
            return;
        }

        // Simulate submit
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;

            successMessage.classList.add("success");
            successMessage.textContent = "✓ Message sent successfully! We'll get back to you soon.";
            contactForm.reset();

            // Auto-hide message
            setTimeout(() => {
                successMessage.style.opacity = "0";
                setTimeout(() => {
                    successMessage.textContent = "";
                    successMessage.style.opacity = "1";
                    successMessage.className = "form-message";
                }, 400);
            }, 5000);
        }, 1200);
    });

    // Shake animation for errors
    function shakeElement(el) {
        el.style.animation = "none";
        el.offsetHeight; // trigger reflow
        el.style.animation = "shake 0.5s ease";
        el.addEventListener("animationend", () => {
            el.style.animation = "";
        }, { once: true });
    }

    // Add shake keyframes dynamically
    const shakeStyle = document.createElement("style");
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ---- SMOOTH ANCHOR SCROLLING ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

});