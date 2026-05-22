document.addEventListener("DOMContentLoaded", () => {
    // Project Modal Logic (Keeping it clean and smooth)
    const overlay = document.getElementById("project-overlay");
    if (overlay) {
        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach(card => {
            const details = card.querySelector(".project-details");
            if (!details) return;

            card.addEventListener("click", (e) => {
                e.stopPropagation();
                // Close any other open modals first to prevent overlay stack
                document.querySelectorAll(".project-details").forEach(d => d.classList.remove("active"));
                
                overlay.classList.add("active");
                details.classList.add("active");
            });
        });

        const closeModals = () => {
            overlay.classList.remove("active");
            document.querySelectorAll(".project-details").forEach(d => d.classList.remove("active"));
        };

        overlay.addEventListener("click", closeModals);
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                e.stopPropagation();
                closeModals();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && overlay.classList.contains("active")) closeModals();
        });
    }

    // CERTIFICATES CAROUSEL LOGIC
    const track = document.getElementById('cert-track');
    const prevBtn = document.getElementById('cert-prev');
    const nextBtn = document.getElementById('cert-next');
    const viewport = document.querySelector('.carousel-viewport');

    if (track && prevBtn && nextBtn && viewport) {
        const scrollAmount = () => viewport.clientWidth;

        nextBtn.addEventListener('click', () => {
            viewport.scrollBy({
                left: scrollAmount(),
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            viewport.scrollBy({
                left: -scrollAmount(),
                behavior: 'smooth'
            });
        });

        // Optional: Hide/Show buttons based on scroll position (end-stops)
        const toggleButtons = () => {
            const isAtStart = viewport.scrollLeft <= 5;
            const isAtEnd = viewport.scrollLeft + viewport.clientWidth >= track.scrollWidth - 5;
            
            prevBtn.style.opacity = isAtStart ? '0.3' : '1';
            prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
            
            nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
            nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        };

        viewport.addEventListener('scroll', toggleButtons);
        // Initial check
        toggleButtons();
        // Resize check
        window.addEventListener('resize', toggleButtons);
    }
});