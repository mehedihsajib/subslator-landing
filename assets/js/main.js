document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis (Smooth Scrolling)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Integrated GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 1.5 Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
            if (mobileMenu.classList.contains('hidden')) {
                icon.textContent = 'menu';
            } else {
                icon.textContent = 'close';
            }
        });

        // Close mobile menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
            });
        });
    }

    // 2. Smooth Scroll on Anchor Clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -80, // Offset for the fixed floating header
                    duration: 1.5, // nice slow glide
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // 3. Scroll Spy (Active Link Highlighting)
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -50% 0px", // Triggers when section is visibly prominent
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                // Remove active class from all
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                });
                
                // Add active class to the current navigation link
                const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    // 4. GSAP Animations
    window.addEventListener("load", () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // A. Initial Hero Text Animation Sequence
            const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
            
            // Add a slight delay to allow rendering and feeling intentional
            heroTl.from(".hero-title", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                delay: 0.2
            })
            .from(".hero-subtitle", {
                y: 20,
                opacity: 0,
                duration: 1,
            }, "-=0.9")
            .from(".hero-buttons", {
                y: 15,
                opacity: 0,
                duration: 0.8,
            }, "-=0.7");
            
            // Only animate mockup if it exists
            if(document.querySelector(".hero-mockup")) {
                heroTl.from(".hero-mockup", {
                    y: 60,
                    opacity: 0,
                    duration: 1.5,
                    scale: 0.95,
                    ease: "power3.out"
                }, "-=0.6");
            }

            // B. Standard Section Reveals (exclude complex sections)
            gsap.utils.toArray('section:not(#hero):not(#features):not(#how-it-works)').forEach(element => {
                gsap.fromTo(element, 
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                        opacity: 1, 
                        y: 0,
                        duration: 1,
                        ease: "power3.out"
                    }
                );
            });

            // C. Features Section specific independent triggers
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                gsap.fromTo("#features .text-center > *", 
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: "#features",
                            start: "top 80%",
                            toggleActions: "play none none none"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    }
                );
                
                gsap.fromTo("#features .glass-card, #features .glass-panel", 
                    { opacity: 0, y: 40 },
                    {
                        scrollTrigger: {
                            trigger: "#features",
                            start: "top 60%",
                            toggleActions: "play none none none"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    }
                );
            }
            
            // D. How It Works Specific independent triggers
            const howItWorksSection = document.querySelector('#how-it-works');
            if (howItWorksSection) {
                gsap.fromTo("#how-it-works .text-center > *", 
                    { opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: "#how-it-works",
                            start: "top 80%",
                            toggleActions: "play none none none"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    }
                );
                
                gsap.fromTo("#how-it-works .glass-card", 
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: "#how-it-works",
                            start: "top 60%",
                            toggleActions: "play none none none"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out"
                    }
                );
            }

            // Force recalculation to fix Lenis + Scrolltrigger sync issues correctly
            ScrollTrigger.refresh();
        }
    });
});
