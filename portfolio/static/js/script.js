document.addEventListener("DOMContentLoaded", () => {

    /* THEME TOGGLE */
    const themeBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const staticBase = themeBtn.dataset.static; // e.g. "/static/images/"
    const heroSection = document.querySelector(".et-hero-tabs");
    const heroClouds = document.querySelector(".hero-clouds");

    // End Stone Bricks SVG pattern - yellow-tan bricks with dark olive mortar (offset rows)
    const END_STONE_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='32'%3E%3Crect width='64' height='32' fill='%237a7a38'/%3E%3Crect x='2' y='2' width='27' height='11' fill='%23dede8a'/%3E%3Crect x='35' y='2' width='27' height='11' fill='%23d8d880'/%3E%3Crect x='2' y='18' width='11' height='11' fill='%23d4d474'/%3E%3Crect x='18' y='18' width='27' height='11' fill='%23dcdc88'/%3E%3Crect x='51' y='18' width='11' height='11' fill='%23d8d87c'/%3E%3C/svg%3E\")";

    function applyHeroTheme(theme) {
        if (!heroSection) return;

        if (theme === "end") {
            heroSection.style.setProperty("background-image", END_STONE_SVG, "important");
            heroSection.style.setProperty("background-size", "128px 64px", "important");
            heroSection.style.setProperty("background-repeat", "repeat", "important");
            heroSection.style.setProperty("background-position", "0 0", "important");
            heroSection.style.setProperty("border-bottom", "10px solid #7a7a38", "important");
            if (heroClouds) heroClouds.style.display = "none";
        } else {
            heroSection.style.removeProperty("background-image");
            heroSection.style.removeProperty("background-size");
            heroSection.style.removeProperty("background-repeat");
            heroSection.style.removeProperty("background-position");
            heroSection.style.removeProperty("border-bottom");
            if (heroClouds) heroClouds.style.display = "";
        }
    }

    /* THEME INITIALIZATION */
    const storedTheme = localStorage.getItem("theme") || "overworld";
    function setThemeIcon(theme) {
        const map = {
            "overworld": ["villager_icon.svg", "Villager"],
            "nether":    ["piglin_icon.svg",   "Piglin"],
            "end":       ["enderman_icon.svg",  "Enderman"]
        };
        const [file, alt] = map[theme] || map["overworld"];
        themeIcon.src = staticBase + file;
        themeIcon.alt = alt;
    }

    if (storedTheme === "nether") {
        document.body.classList.add("nether-theme");
        setThemeIcon("nether");
    } else if (storedTheme === "end") {
        document.body.classList.add("end-theme");
        setThemeIcon("end");
    } else {
        setThemeIcon("overworld");
    }
    applyHeroTheme(storedTheme);

    themeBtn.addEventListener("click", () => {

        const currentTheme = localStorage.getItem("theme") || "overworld";
        let nextTheme;

        if (currentTheme === "overworld") {
            nextTheme = "nether";
            document.body.classList.remove("end-theme");
            document.body.classList.add("nether-theme");
            setThemeIcon("nether");
        } else if (currentTheme === "nether") {
            nextTheme = "end";
            document.body.classList.remove("nether-theme");
            document.body.classList.add("end-theme");
            setThemeIcon("end");
        } else {
            nextTheme = "overworld";
            document.body.classList.remove("end-theme");
            document.body.classList.remove("nether-theme");
            setThemeIcon("overworld");
        }

        localStorage.setItem("theme", nextTheme);
        applyHeroTheme(nextTheme);
    });


    /* NAVBAR */
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", function () {
        if (window.scrollY > window.innerHeight - 100) {
            navbar.style.background = "#ffffff";
        } else {
            navbar.style.background = "white";
        }
    });

    /* SCROLL ANIMATION */
    const sections = document.querySelectorAll(".et-slide");

    sections.forEach(section => {
        section.classList.add("animate");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        observer.observe(section);
    });



    /* THEMATIC PARTICLE SYSTEM (Cherry Blossom / Spores / Ender) */
    function createParticle() {
        const particle = document.createElement("div");
        const bodyClass = document.body.className;
        
        if (bodyClass.includes("end-theme")) {
            particle.classList.add("ender-particle");
        } else if (bodyClass.includes("nether-theme")) {
            particle.classList.add("glowstone-particle");
        } else {
            particle.classList.add("cherry-petal");
        }
        
        // Random horizontal start position
        particle.style.left = Math.random() * 100 + "vw";
        
        // Blocky random sizes (4px, 6px, 8px)
        const size = Math.floor(Math.random() * 3) * 2 + 4;
        particle.style.width = size + "px";
        particle.style.height = size + "px";
        
        // Color palettes based on theme
        const cherryColors = ["#ffb6c1", "#ffc0cb", "#e28ca7", "#fcaec0"];
        const glowstoneColors = ["#ff4d4d", "#ff8080", "#8a1f1f", "#b30000"];
        const enderColors = ["#df00ff", "#bc00ff", "#9400ff", "#300060"]; // Purple palette
        
        let colors;
        if (bodyClass.includes("end-theme")) {
            colors = enderColors;
        } else if (bodyClass.includes("nether-theme")) {
            colors = glowstoneColors;
        } else {
            colors = cherryColors;
        }
        
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        
        // Random falling speed (5 to 10 seconds)
        const duration = Math.random() * 5 + 5; 
        particle.style.animationDuration = duration + "s";
        
        // Random horizontal drift direction
        const drift = (Math.random() - 0.5) * 50;
        particle.style.setProperty('--drift', drift + "px");

        document.body.appendChild(particle);
        
        // Cleanup after fall
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Spawn particles steadily
    setInterval(createParticle, 150);
});