/* ============================================================
   CAPITAL EM FOCO — INTERAÇÕES
   JavaScript puro / sem dependências
   ============================================================ */

(() => {
    "use strict";

    /* ------------------------------------------------------------
       01. PREFERÊNCIA DE MOVIMENTO
    ------------------------------------------------------------ */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ------------------------------------------------------------
       02. HEADER INTELIGENTE
       Esconde ao descer e reaparece ao subir.
    ------------------------------------------------------------ */

    const header = document.querySelector(".site-header");

    if (header && !prefersReducedMotion) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const difference = currentScrollY - lastScrollY;

            if (currentScrollY <= 20) {
                header.classList.remove(
                    "header-scrolled",
                    "header-hidden"
                );
            } else if (difference > 5) {
                header.classList.add("header-scrolled");
                header.classList.add("header-hidden");
            } else if (difference < -5) {
                header.classList.add("header-scrolled");
                header.classList.remove("header-hidden");
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeader);
                    ticking = true;
                }
            },
            { passive: true }
        );
    }


    /* ------------------------------------------------------------
       03. REVELAÇÃO DOS ELEMENTOS AO ENTRAREM NA TELA
    ------------------------------------------------------------ */

    const revealSelectors = [
        ".section-heading",
        ".section-intro",
        ".about-content",
        ".course-card",
        ".method-item",
        ".benefit",
        ".testimonial-card",
        ".faq-item",
        ".hero-card"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(", ")
    );

    if (revealElements.length && !prefersReducedMotion) {

        revealElements.forEach((element, index) => {
            element.classList.add("reveal-element");

            const delay = Math.min(
                (index % 4) * 70,
                210
            );

            element.style.setProperty(
                "--reveal-delay",
                `${delay}ms`
            );
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* ------------------------------------------------------------
       04. HERO — ENTRADA INICIAL
    ------------------------------------------------------------ */

    const heroCopy = document.querySelector(".hero-copy");
    const heroCard = document.querySelector(".hero-card");

    if (!prefersReducedMotion) {

        if (heroCopy) {

            heroCopy.classList.add("hero-intro");

            requestAnimationFrame(() => {
                heroCopy.classList.add(
                    "hero-intro-visible"
                );
            });
        }

        if (heroCard) {

            heroCard.classList.add(
                "hero-card-intro"
            );

            setTimeout(() => {
                heroCard.classList.add(
                    "hero-card-intro-visible"
                );
            }, 180);
        }
    }


    /* ------------------------------------------------------------
       05. PARALLAX SUTIL NO HERO
    ------------------------------------------------------------ */

    if (
        heroCard &&
        !prefersReducedMotion &&
        window.matchMedia("(min-width: 821px)").matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        let parallaxFrame = null;

        const animateParallax = () => {

            currentX +=
                (mouseX - currentX) * 0.055;

            currentY +=
                (mouseY - currentY) * 0.055;

            heroCard.style.transform = `
                perspective(1000px)
                rotateY(${currentX * 2.2}deg)
                rotateX(${currentY * -1.7}deg)
                translateY(-2px)
            `;

            parallaxFrame =
                requestAnimationFrame(
                    animateParallax
                );
        };

        window.addEventListener(
            "mousemove",
            (event) => {

                const x =
                    event.clientX /
                    window.innerWidth -
                    0.5;

                const y =
                    event.clientY /
                    window.innerHeight -
                    0.5;

                mouseX = x;
                mouseY = y;

                if (!parallaxFrame) {
                    parallaxFrame =
                        requestAnimationFrame(
                            animateParallax
                        );
                }
            },
            { passive: true }
        );

        document.addEventListener(
            "mouseleave",
            () => {
                mouseX = 0;
                mouseY = 0;
            }
        );
    }


    /* ------------------------------------------------------------
       06. LINK ATIVO DA NAVEGAÇÃO
    ------------------------------------------------------------ */

    const navigationLinks =
        document.querySelectorAll(
            ".main-navigation a[href^='#']"
        );

    const navigationSections = [];

    navigationLinks.forEach((link) => {

        const id =
            link.getAttribute("href");

        if (!id || id === "#") {
            return;
        }

        const section =
            document.querySelector(id);

        if (section) {

            navigationSections.push({
                link,
                section
            });
        }
    });

    if (navigationSections.length) {

        const navObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navigationSections.forEach(
                            ({ link }) => {
                                link.classList.remove(
                                    "is-active"
                                );
                            }
                        );

                        const current =
                            navigationSections.find(
                                ({ section }) =>
                                    section === entry.target
                            );

                        if (current) {
                            current.link.classList.add(
                                "is-active"
                            );
                        }
                    });
                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

        navigationSections.forEach(
            ({ section }) => {
                navObserver.observe(section);
            }
        );
    }


    /* ------------------------------------------------------------
       07. SCROLL SUAVE
    ------------------------------------------------------------ */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]:not([href="#"])'
        );

    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");

                const target =
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth",
                    block: "start"
                });
            }
        );
    });


    /* ------------------------------------------------------------
       08. EFEITO MAGNÉTICO NOS BOTÕES
    ------------------------------------------------------------ */

    const magneticButtons =
        document.querySelectorAll(
            ".button-primary, .header-cta"
        );

    if (
        !prefersReducedMotion &&
        window.matchMedia(
            "(min-width: 821px)"
        ).matches
    ) {

        magneticButtons.forEach((button) => {

            button.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        (
                            event.clientX -
                            rect.left -
                            rect.width / 2
                        ) * 0.08;

                    const y =
                        (
                            event.clientY -
                            rect.top -
                            rect.height / 2
                        ) * 0.08;

                    button.style.transform =
                        `translate(${x}px, ${y}px)`;
                }
            );

            button.addEventListener(
                "mouseleave",
                () => {
                    button.style.transform = "";
                }
            );
        });
    }


    /* ------------------------------------------------------------
       09. FAQ — UM ITEM ABERTO POR VEZ
    ------------------------------------------------------------ */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) {
                    return;
                }

                faqItems.forEach(
                    (otherItem) => {

                        if (
                            otherItem !== item &&
                            otherItem.open
                        ) {
                            otherItem.open = false;
                        }
                    }
                );
            }
        );
    });


    /* ------------------------------------------------------------
       10. FEEDBACK VISUAL DOS BOTÕES
    ------------------------------------------------------------ */

    const purchaseButtons =
        document.querySelectorAll(
            ".course-card .button"
        );

    purchaseButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                button.classList.add(
                    "is-clicked"
                );

                window.setTimeout(() => {

                    button.classList.remove(
                        "is-clicked"
                    );

                }, 450);
            }
        );
    });


    /* ------------------------------------------------------------
       11. ANIMAÇÃO DOS NÚMEROS DOS INDICADORES
    ------------------------------------------------------------ */

    const statNumbers =
        document.querySelectorAll(
            ".stat-item strong"
        );

    if (
        statNumbers.length &&
        !prefersReducedMotion
    ) {

        const statObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const element =
                            entry.target;

                        const finalText =
                            element.textContent.trim();

                        if (!/^\d+$/.test(finalText)) {

                            observer.unobserve(
                                element
                            );

                            return;
                        }

                        const finalNumber =
                            Number(finalText);

                        let current = 0;

                        const duration = 500;

                        const start =
                            performance.now();

                        const animateNumber =
                            (time) => {

                                const progress =
                                    Math.min(
                                        (time - start) /
                                            duration,
                                        1
                                    );

                                const eased =
                                    1 -
                                    Math.pow(
                                        1 - progress,
                                        3
                                    );

                                current =
                                    Math.round(
                                        finalNumber *
                                            eased
                                    );

                                element.textContent =
                                    String(current)
                                        .padStart(2, "0");

                                if (
                                    progress < 1
                                ) {
                                    requestAnimationFrame(
                                        animateNumber
                                    );
                                }
                            };

                        requestAnimationFrame(
                            animateNumber
                        );

                        observer.unobserve(
                            element
                        );
                    });
                },
                {
                    threshold: 0.7
                }
            );

        statNumbers.forEach((element) => {
            statObserver.observe(element);
        });
    }


    /* ------------------------------------------------------------
       12. CURSOR GLOW
    ------------------------------------------------------------ */

    if (
        heroCard &&
        !prefersReducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        const glow =
            document.createElement("div");

        glow.className =
            "cursor-glow";

        document.body.appendChild(glow);

        let glowX = -100;
        let glowY = -100;

        let targetX = -100;
        let targetY = -100;

        let glowFrame = null;

        const animateGlow = () => {

            glowX +=
                (targetX - glowX) * 0.12;

            glowY +=
                (targetY - glowY) * 0.12;

            glow.style.transform =
                `translate3d(
                    ${glowX}px,
                    ${glowY}px,
                    0
                )`;

            glowFrame =
                requestAnimationFrame(
                    animateGlow
                );
        };

        window.addEventListener(
            "mousemove",
            (event) => {

                targetX =
                    event.clientX - 120;

                targetY =
                    event.clientY - 120;

                if (!glowFrame) {

                    glowFrame =
                        requestAnimationFrame(
                            animateGlow
                        );
                }
            },
            { passive: true }
        );
    }


    /* ------------------------------------------------------------
       13. REFLEXO NOS CARDS
    ------------------------------------------------------------ */

    const interactiveCards =
        document.querySelectorAll(
            ".course-card, .testimonial-card"
        );

    if (
        !prefersReducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        interactiveCards.forEach((card) => {

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        (
                            (event.clientX -
                                rect.left) /
                            rect.width
                        ) * 100;

                    const y =
                        (
                            (event.clientY -
                                rect.top) /
                            rect.height
                        ) * 100;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}%`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}%`
                    );
                }
            );
        });
    }


    /* ------------------------------------------------------------
       14. ANO AUTOMÁTICO NO FOOTER
    ------------------------------------------------------------ */

    const footerYear =
        document.querySelector(
            ".footer-bottom p"
        );

    if (footerYear) {

        footerYear.textContent =
            footerYear.textContent.replace(
                /\b20\d{2}\b/,
                new Date().getFullYear()
            );
    }


    /* ------------------------------------------------------------
       15. PERFORMANCE
    ------------------------------------------------------------ */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {
                document.body.classList.add(
                    "page-hidden"
                );
            } else {
                document.body.classList.remove(
                    "page-hidden"
                );
            }
        }
    );

})();