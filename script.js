// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navContent = document.querySelector('.nav-content');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navContent.classList.toggle('active');
    });
}

// Add interaction to navigation links
document.querySelectorAll('.pill-nav nav a, .pill-nav .btn-primary').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // If it's a hash link, handle smooth scroll
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        }
        
        // Close mobile menu on click
        if(navContent && navContent.classList.contains('active')) {
            navContent.classList.remove('active');
        }
    });
});

// Restart animation hack for chart bars when scrolled into view
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.animation = 'none';
                void bar.offsetWidth; // trigger reflow
                bar.style.animation = null; 
            });
        }
    });
}, observerOptions);

const mockChart = document.querySelector('.mock-chart');
if (mockChart) {
    observer.observe(mockChart);
}

// Ensure badges do not drift off-screen on mouse move if any overlap issues occur, 
// using a subtle parallax
document.addEventListener('mousemove', (e) => {
    const badges = document.querySelectorAll('.floating-badge');
    if(window.innerWidth > 768) {
        // Calculate shift based on screen center
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;

        badges.forEach((badge, index) => {
            // Apply different multiplier per badge
            const multiplier = index % 2 === 0 ? 1 : -1;
            badge.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px)`;
        });
    }
});

// Custom Cursor Implementation
if (window.matchMedia("(pointer: fine)").matches) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('custom-cursor-outline');
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Smooth trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });

    // Add interactivity across functional elements
    const interactables = document.querySelectorAll('a, button, .btn-primary, .pill-card, .skill-tag');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
    });
}
