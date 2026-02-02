(() => {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const nav = qs("#site-nav");
  const navLogo = nav ? nav.querySelector("img") : null;
  const navLinks = qsa(".nav-link");
  const navIcons = qsa(".nav-icon");
  const desktopMenu = qs("#desktop-menu");
  const desktopMenuPanel = qs("#desktop-menu-panel");
  const mobileToggle = qs("#mobile-toggle");
  const mobileToggleIcon = qs("#mobile-toggle-icon");
  const mobileMenu = qs("#mobile-menu");

  let desktopCloseTimer = null;

  const setNavScrolled = () => {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.remove("bg-transparent", "border-transparent", "py-5");
      nav.classList.add(
        "bg-white/95",
        "backdrop-blur-md",
        "border-gray-100",
        "py-3",
        "shadow-md",
      );
      navLinks.forEach((link) => {
        link.classList.remove("text-white");
        link.classList.add("text-navy");
      });
      navIcons.forEach((icon) => {
        icon.classList.remove("text-white");
        icon.classList.add("text-navy");
      });
      if (navLogo && navLogo.dataset.logoLight) {
        navLogo.src = navLogo.dataset.logoLight;
      }
    } else {
      nav.classList.add("bg-transparent", "border-transparent", "py-5");
      nav.classList.remove(
        "bg-white/95",
        "backdrop-blur-md",
        "border-gray-100",
        "py-3",
        "shadow-md",
      );
      navLinks.forEach((link) => {
        link.classList.add("text-white");
        link.classList.remove("text-navy");
      });
      navIcons.forEach((icon) => {
        icon.classList.add("text-white");
        icon.classList.remove("text-navy");
      });
      if (navLogo && navLogo.dataset.logoDark) {
        navLogo.src = navLogo.dataset.logoDark;
      }
    }
  };

  const openDesktopMenu = () => {
    if (!desktopMenuPanel) return;
    if (desktopCloseTimer) {
      window.clearTimeout(desktopCloseTimer);
      desktopCloseTimer = null;
    }
    desktopMenuPanel.classList.remove(
      "opacity-0",
      "scale-95",
      "-translate-y-4",
      "invisible",
    );
    desktopMenuPanel.classList.add(
      "opacity-100",
      "scale-100",
      "translate-y-0",
      "visible",
    );
  };

  const closeDesktopMenu = () => {
    if (!desktopMenuPanel) return;
    desktopCloseTimer = window.setTimeout(() => {
      desktopMenuPanel.classList.add(
        "opacity-0",
        "scale-95",
        "-translate-y-4",
        "invisible",
      );
      desktopMenuPanel.classList.remove(
        "opacity-100",
        "scale-100",
        "translate-y-0",
        "visible",
      );
    }, 150);
  };

  const toggleMobileMenu = () => {
    if (!mobileMenu || !mobileToggleIcon) return;
    const isOpen = mobileMenu.classList.contains("opacity-100");
    if (isOpen) {
      mobileMenu.classList.remove("translate-y-4", "opacity-100", "scale-100");
      mobileMenu.classList.add(
        "translate-y-0",
        "opacity-0",
        "scale-95",
        "pointer-events-none",
      );
      mobileToggleIcon.textContent = "menu";
      mobileToggle.setAttribute("aria-expanded", "false");
    } else {
      mobileMenu.classList.add("translate-y-4", "opacity-100", "scale-100");
      mobileMenu.classList.remove(
        "translate-y-0",
        "opacity-0",
        "scale-95",
        "pointer-events-none",
      );
      mobileToggleIcon.textContent = "close";
      mobileToggle.setAttribute("aria-expanded", "true");
    }
  };

  window.addEventListener("scroll", setNavScrolled);
  setNavScrolled();

  if (desktopMenu) {
    desktopMenu.addEventListener("mouseenter", openDesktopMenu);
    desktopMenu.addEventListener("mouseleave", closeDesktopMenu);
    desktopMenu.addEventListener("focusin", openDesktopMenu);
    desktopMenu.addEventListener("focusout", closeDesktopMenu);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", toggleMobileMenu);
  }

  document.addEventListener("mousedown", (event) => {
    if (!mobileMenu || !mobileToggle) return;
    if (mobileMenu.classList.contains("opacity-100")) {
      const target = event.target;
      if (!mobileMenu.contains(target) && !mobileToggle.contains(target)) {
        toggleMobileMenu();
      }
    }
  });

  const impactSection = qs("#impact-stats");
  const counterEls = qsa("[data-counter-value]");

  const parseCounterValue = (value) => {
    const match = value.match(/^([^\d\.]*)([\d\.]+)([^\d\.]*)$/);
    if (!match) {
      return { prefix: "", number: 0, suffix: value, decimals: 0 };
    }
    const prefix = match[1] || "";
    const number = parseFloat(match[2]);
    const suffix = match[3] || "";
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    return { prefix, number, suffix, decimals };
  };

  const animateCounters = () => {
    counterEls.forEach((el) => {
      const value = el.getAttribute("data-counter-value") || "0";
      const { prefix, number, suffix, decimals } = parseCounterValue(value);
      const duration = 2000;
      const frameRate = 60;
      const totalFrames = Math.round(duration / (1000 / frameRate));
      let frame = 0;

      const timer = window.setInterval(() => {
        frame += 1;
        const progress = frame / totalFrames;
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = number * ease;
        if (frame >= totalFrames) {
          el.textContent = `${prefix}${number.toFixed(decimals)}${suffix}`;
          window.clearInterval(timer);
        } else {
          el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
        }
      }, 1000 / frameRate);
    });
  };

  if (impactSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(impactSection);
  } else if (counterEls.length) {
    animateCounters();
  }

  const lifecycleSteps = qsa("[data-lifecycle-step]");
  const lifecycleProgressDesktop = qs("#lifecycle-progress-desktop");
  const lifecycleProgressMobile = qs("#lifecycle-progress-mobile");
  let lifecycleIndex = 0;
  const lifecycleTotal = 4;

  const updateLifecycle = () => {
    lifecycleSteps.forEach((step) => {
      const idx = parseInt(step.getAttribute("data-lifecycle-step") || "0", 10);
      const circle = step.querySelector("div");
      const title = step.querySelector("h4");
      const desc = step.querySelector("p");
      const check = step.querySelector(".lifecycle-check");
      const activeDot = step.querySelector(".lifecycle-active-dot");
      const inactiveDot = step.querySelector(".lifecycle-inactive-dot");

      const isActive = idx === lifecycleIndex;
      const isPast = idx < lifecycleIndex;

      if (circle) {
        circle.classList.remove(
          "bg-primary",
          "shadow-[0_0_25px_rgba(255,105,5,0.6)]",
          "shadow-[0_0_20px_rgba(255,105,5,0.4)]",
          "scale-110",
          "border-2",
          "border-pastel-orange",
          "bg-white",
        );
        circle.classList.add(isActive || isPast ? "bg-primary" : "bg-white");
        if (isActive) {
          circle.classList.add(
            "shadow-[0_0_25px_rgba(255,105,5,0.6)]",
            "scale-110",
          );
        } else if (!isPast) {
          circle.classList.add("border-2", "border-pastel-orange");
        }
      }

      if (title) {
        title.classList.toggle("text-primary", isActive);
        title.classList.toggle("text-navy", !isActive);
      }

      if (desc) {
        desc.classList.toggle("text-navy", isActive);
        desc.classList.toggle("text-gray-400", !isActive);
      }

      if (check && activeDot && inactiveDot) {
        check.classList.toggle("hidden", !isPast);
        activeDot.classList.toggle("hidden", !isActive);
        inactiveDot.classList.toggle("hidden", isActive || isPast);
      }
    });

    const progressPct = (lifecycleIndex / (lifecycleTotal - 1)) * 100;
    if (lifecycleProgressDesktop) {
      // Line spans 12.5% -> 87.5% of the container (75% total).
      lifecycleProgressDesktop.style.width = `${progressPct * 0.75}%`;
    }
    if (lifecycleProgressMobile) {
      lifecycleProgressMobile.style.height = `${progressPct}%`;
    }
  };

  updateLifecycle();
  window.setInterval(() => {
    lifecycleIndex = (lifecycleIndex + 1) % lifecycleTotal;
    updateLifecycle();
  }, 3500);

  const collaborators = {
    categories: [
      "Developers & Asset Owners",
      "Lenders & Banks",
      "NBFCs & Alternative Capital",
      "Funds & Institutional Investors",
      "Global Clients",
    ],
    descriptions: [
      "Working with leading real estate developers to deliver execution certainty, cost discipline, and real-time visibility across large-scale residential and commercial assets.",
      "Partnering with top-tier banks to mitigate risk, ensure covenant compliance, and streamline loan monitoring through automated intelligence.",
      "Empowering NBFCs and alternative capital providers with high-yield asset management strategies and rigorous distressed asset recovery.",
      "Providing institutional investors with granular portfolio transparency, real-time ROI analytics, and strategic exit planning.",
      "Delivering standardized, compliant, and scalable asset management solutions for multinational corporations and global real estate portfolios.",
    ],
    logos: [
      {
        name: "Brookfield",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBKZAg7TR8EYFXhZ5BJoKpOjnH-opdJBS6rK_BuOdOySbHg9aRkrvNubucH2CIcseGcma16GQ5oe4OfBY3x8fxS9Aqw7bWWalSG1ekMeWlsEpQdDWUj0dVlFFL-P2wtWYitQKLvJjV6vAC56-hiy1KEWZYrXh7bM2K3TWOlXq-rhZRjTXQVJXUUSKPM4nmeDG0QsHKO9Yxw2okvleh7pWWSC6V6K8qQ7PZwC_PFIl3m5wdpP_lGm6ZXxf9NIi7_WWpMcQMMHnBlpk",
      },
      {
        name: "Transcon",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACPVpkSsTBWO6koj-hZF3mEPBSznTCFPbU8qTAxUa3gAX7zSO82wkSjpGRI1M4BAo36DizJcPRfeQ4g0mXsg2u4Lb5YXjghZ5D2V-zdrdRp9APqP3kBoiKgQeSnDhzwwLXndNw2Q4Ujna2MQB4s7y8eOqpsCK4KAy8RwDGv8lYmlk8B31amGN6rc_3ZMOzjsGRSomMIuDAdGjLcNLD_VHZs7o3ckFrD2BmUEO9RWnGyFUNmIYSRQzrKrpx3NtnkiSIInvz6E3KGTs",
      },
      {
        name: "Kanakia",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU7oTp_JZ_IIGEFSa9sjz8BvZwxFzE5O-b2pXrUDa0RVV-o-P_r0racyIKFgLBJ5t8okNG6rQu7iTqpc7_8_bUWtXwB-qGmtagpI0WdAZ6LiCLjsp8d0HiAZtMw-stx18dOUqrGllftAsxmhBk4yVm7i7St4k8DD54eMbkgkgDHE99dfvHDgJJP0Rzl8-8P5_QaeoKB6EGFSKd1qT7Z97ob4mmVgD9RSmFAYiq9jq6lu-iBAQOgZnZdGSlgOPpvWPWKam2xKuLII8",
      },
      {
        name: "Merusri",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3BXzWKIxJK8t8nW9guUP3yKwLAPxQJV9loXcXXqigTQHGWUaiRZGbaKKrymgilT4xnYPFciE0Fi5xvqFnPzybtvrDt2cMMnRd8rLT5qtsw3HGqVq892LTSWxbOQn1ANhvlTlNdPINJnV5A6VkdXomg9MNsSlMavsard8mguQH6LWXPjtPiI6lIUHw2NlO5_DUunvnybRaRsJ1gWebKaZ6cu3hWIOocQGLa7qn_zm-plz616Qh0sREv4z-A6M0gR_tT9XYZKaPkcM",
      },
      {
        name: "Saridena",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA20XomIsIclnu2nriySVPUy3PHMKaEoorEBkbWsVzqXVTFoke4ET3gGY95oi-nzAdIf-EZpCELWj5FkqMjZHhiPgjJz1OoqsL-dJuBLWF1ojGRVcN7-qfwQrYAMsUIcxUMvK_UnlU1qx4GRXhavbKIvn0vTd0ToKU-NUwN47yuNIqPZp5aKpWDQjJZTD53rcGtiKYlucBYVW5MS0xMoJFhe9PuFCZgBCWb5SDh7v09BwRIy6rDxMBHKoebhLzpNkYRaqkBdObooe4",
      },
      {
        name: "B.E.C.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGGQmea4pjm9KfF-eafAUuOHRwb3pkIYTmxGMJBQ3iGOxRBZfF_PCTbdsr9-uXmKWPwlYBKWHOZYpkgzTo_-jCNXvU_L-xgGld_E-PpaUf7OXjiKgjDJXe1BvRqiuHv7CUCdKNi20F-NWdxM9IKJ2wO0t55elMWWSzZhGC3BDNWk-HVIrGBj0WHxfY4w_XT0Qrz152pGe1011Hjhj5slYiNUHxvxhjhRWmWz8mwhF7WFtywASHtBUuCkk016nDIz1-isV3i_2stR8",
      },
      {
        name: "Clearpack",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWfKYxuQFlgJG3z61IYbJgVGPrFkXuxZ3nluhEuhHiKvY_WLr1qRoXlrrH89YlTiggTFhomwzvzvXT8ArM49Nui4cSnGsVbdyablkp6zJsQ2W43_WYUO8BcA0hXdzllMEnHfQ03TuSDV2E6svxwSb_NQvVLSUJdyl011n0hZyrYJlH_PXlui17TJxTwINV0T3hRGqyXP-j-ovbtOcli-XlXE-63T3F-85awMlsjwtE4pBTUVr4zg3nu3epDLCbxITXIsOUgF2CNrA",
      },
    ],
  };

  const collabTabs = qs("#collab-tabs");
  const collabTitle = qs("#collab-title");
  const collabDesc = qs("#collab-desc");
  const collabLogos = qs("#collab-logos");
  const collabLeft = qs("#collab-left");
  const collabRight = qs("#collab-right");
  let activeCollab = 0;

  const renderCollabTabs = () => {
    if (!collabTabs) return;
    collabTabs.innerHTML = "";
    collaborators.categories.forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className = `py-3.5 rounded-full text-xs md:text-sm lg:text-base font-bold transition-all duration-300 border flex-shrink-0 snap-center w-[210px] md:w-auto md:px-8 ${
        idx === activeCollab
          ? "bg-navy text-white border-navy shadow-lg shadow-navy/20 translate-y-[-2px]"
          : "bg-white text-navy border-navy/20 hover:border-navy/50 hover:bg-navy/5"
      }`;
      btn.addEventListener("click", () => {
        activeCollab = idx;
        renderCollaborators();
      });
      collabTabs.appendChild(btn);
    });
  };

  const renderCollabLogos = () => {
    if (!collabLogos) return;
    collabLogos.innerHTML = "";
    const offset = activeCollab % 3;
    const displayLogos = collaborators.logos
      .slice(offset)
      .concat(collaborators.logos.slice(0, offset));

    displayLogos.forEach((logo) => {
      const card = document.createElement("div");
      card.className =
        "group h-24 flex flex-col items-center justify-center p-4 transition-all duration-500 cursor-pointer hover:-translate-y-2 bg-white rounded-2xl hover:bg-pastel-navy/20";
      card.innerHTML = `
        <div class="flex flex-col items-center gap-3">
          <img src="${logo.img}" alt="${logo.name}" class="max-h-8 md:max-h-10 w-auto object-contain transition-all duration-300 group-hover:scale-110" />
          <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-navy/30 group-hover:text-primary transition-colors">${logo.name}</span>
        </div>
      `;
      collabLogos.appendChild(card);
    });

    const moreCard = document.createElement("div");
    moreCard.className =
      "group h-24 flex flex-col items-center justify-center p-4 transition-all duration-500 cursor-pointer hover:-translate-y-2 bg-white rounded-2xl hover:bg-pastel-navy/20";
    moreCard.innerHTML = `
      <div class="flex flex-col items-center gap-2">
        <div class="w-10 h-10 flex items-center justify-center text-navy/20 group-hover:text-primary transition-colors">
          <span class="material-icons-outlined text-3xl md:text-4xl">more_horiz</span>
        </div>
        <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-navy/30 group-hover:text-primary transition-colors">And Others</span>
      </div>
    `;
    collabLogos.appendChild(moreCard);
  };

  const renderCollaborators = () => {
    if (collabTitle)
      collabTitle.textContent = collaborators.categories[activeCollab];
    if (collabDesc)
      collabDesc.textContent = collaborators.descriptions[activeCollab];
    renderCollabTabs();
    renderCollabLogos();
    if (collabTabs) {
      setTimeout(() => {
        updateCollabArrows();
      }, 50);
    }
  };

  const updateCollabArrows = () => {
    if (!collabTabs || !collabLeft || !collabRight) return;
    const { scrollLeft, scrollWidth, clientWidth } = collabTabs;
    const showLeft = scrollLeft > 10;
    const showRight = scrollLeft < scrollWidth - clientWidth - 10;

    const setArrow = (el, show) => {
      el.disabled = !show;
      el.classList.toggle("border-navy", show);
      el.classList.toggle("text-navy", show);
      el.classList.toggle("hover:bg-navy", show);
      el.classList.toggle("hover:text-white", show);
      el.classList.toggle("cursor-pointer", show);
      el.classList.toggle("shadow-md", show);
      el.classList.toggle("border-gray-100", !show);
      el.classList.toggle("text-gray-200", !show);
      el.classList.toggle("cursor-not-allowed", !show);
      el.classList.toggle("opacity-0", !show);
      el.classList.toggle("invisible", !show);
    };

    setArrow(collabLeft, showLeft);
    setArrow(collabRight, showRight);
  };

  if (collabTabs) {
    collabTabs.addEventListener("scroll", updateCollabArrows);
    window.addEventListener("resize", updateCollabArrows);
    if (collabLeft) {
      collabLeft.addEventListener("click", () => {
        collabTabs.scrollBy({
          left: -collabTabs.clientWidth * 0.7,
          behavior: "smooth",
        });
      });
    }
    if (collabRight) {
      collabRight.addEventListener("click", () => {
        collabTabs.scrollBy({
          left: collabTabs.clientWidth * 0.7,
          behavior: "smooth",
        });
      });
    }
  }

  renderCollaborators();

  const productStack = qs("#product-stack");
  const productPrev = qs("#product-prev");
  const productNext = qs("#product-next");
  const productSlides = qsa("[data-slide]");
  const productDots = qsa("[data-dot]");
  let productIndex = 0;
  let productAnimating = false;

  const updateProductStack = (nextIndex) => {
    if (productAnimating) return;
    productAnimating = true;
    productIndex = nextIndex;

    productSlides.forEach((slide) => {
      const index = parseInt(slide.getAttribute("data-slide") || "0", 10);
      const isActive = index === productIndex;
      slide.classList.toggle("opacity-100", isActive);
      slide.classList.toggle("z-10", isActive);
      slide.classList.toggle("opacity-0", !isActive);
      slide.classList.toggle("z-0", !isActive);

      const content = slide.querySelector(".transition-all");
      if (content) {
        content.classList.toggle("translate-y-0", isActive);
        content.classList.toggle("opacity-100", isActive);
        content.classList.toggle("translate-y-6", !isActive);
        content.classList.toggle("opacity-0", !isActive);
      }
    });

    productDots.forEach((dot) => {
      const index = parseInt(dot.getAttribute("data-dot") || "0", 10);
      const isActive = index === productIndex;
      dot.classList.toggle("w-8", isActive);
      dot.classList.toggle("bg-primary", isActive);
      dot.classList.toggle("w-2", !isActive);
      dot.classList.toggle("bg-navy/10", !isActive);
    });

    window.setTimeout(() => {
      productAnimating = false;
    }, 700);
  };

  if (productPrev) {
    productPrev.addEventListener("click", () => {
      const nextIndex =
        (productIndex - 1 + productSlides.length) % productSlides.length;
      updateProductStack(nextIndex);
    });
  }

  if (productNext) {
    productNext.addEventListener("click", () => {
      const nextIndex = (productIndex + 1) % productSlides.length;
      updateProductStack(nextIndex);
    });
  }

  productDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const nextIndex = parseInt(dot.getAttribute("data-dot") || "0", 10);
      updateProductStack(nextIndex);
    });
  });

  if (productStack && productSlides.length) {
    window.setInterval(() => {
      const nextIndex = (productIndex + 1) % productSlides.length;
      updateProductStack(nextIndex);
    }, 8000);
  }

  const services = [
    {
      title: "Construction progress & cost tracking",
      icon: "foundation",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2531",
      description:
        "Ensure every brick and dollar is accounted for with real-time field reporting and automated budget variance analysis.",
      highlights: [
        "Automated budget tracking",
        "Field report synchronization",
        "Variance early-warnings",
      ],
    },
    {
      title: "Sales velocity and collection monitoring",
      icon: "trending_up",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
      description:
        "Optimize cash inflows with granular tracking of unit sales, booking speeds, and collection aging reports.",
      highlights: [
        "Unit-level sales visibility",
        "Aging schedule automation",
        "Revenue forecasting",
      ],
    },
    {
      title: "Cashflow and fund-flow intelligence",
      icon: "account_balance_wallet",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2626",
      description:
        "Maintain institutional-grade fund control with transparent movement tracking across projects and entities.",
      highlights: [
        "End-to-end fund tracking",
        "Escrow management",
        "Treasury dashboards",
      ],
    },
    {
      title: "NOC and approval workflows",
      icon: "assignment_turned_in",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2670",
      description:
        "Expedite project timelines by digitizing compliance, NOC applications, and bureaucratic approval stages.",
      highlights: [
        "Document lifecycle tracking",
        "Automated reminders",
        "Audit-ready storage",
      ],
    },
    {
      title: "Compliance, covenant & risk tracking",
      icon: "security",
      image:
        "https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=2340",
      description:
        "Protect investor interests with proactive monitoring of loan covenants, legal risks, and regulatory adherence.",
      highlights: [
        "Covenant breach alerts",
        "Risk heat-maps",
        "Institutional reporting",
      ],
    },
  ];

  const servicesList = qs("#services-list");
  const servicesVisual = qs("#services-visual");
  const servicesOverlay = qs("#services-overlay");
  let activeService = 0;

  const renderServices = () => {
    if (!servicesList || !servicesVisual || !servicesOverlay) return;
    servicesList.innerHTML = "";
    servicesVisual.querySelectorAll("img").forEach((img) => img.remove());
    servicesOverlay.innerHTML = "";

    const label = document.createElement("p");
    label.className =
      "text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mb-4";
    // label.textContent = "Key Capabilities";
    servicesList.appendChild(label);

    services.forEach((cap, idx) => {
      const isActive = idx === activeService;
      const btn = document.createElement("button");
      btn.className = `w-full group flex items-center gap-4 p-3 md:p-4 rounded-2xl transition-all duration-300 border text-left ${
        isActive
          ? "bg-navy border-navy shadow-xl shadow-navy/10"
          : "bg-gray-50 border-transparent hover:border-primary/20 hover:bg-white"
      }`;
      btn.innerHTML = `
        <div class="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
          isActive
            ? "bg-primary text-white"
            : "bg-white text-navy/40 group-hover:text-primary shadow-sm"
        }">
          <span class="material-icons-outlined text-xl">${cap.icon}</span>
        </div>
        <span class="flex-1 text-sm md:text-base font-bold tracking-tight transition-colors ${isActive ? "text-white" : "text-navy"}">${cap.title}</span>
        <span class="material-icons-outlined text-lg transition-all ${isActive ? "text-primary" : "text-navy/20 group-hover:text-primary"}">chevron_right</span>
      `;
      btn.addEventListener("click", () => {
        activeService = idx;
        renderServices();
      });
      servicesList.appendChild(btn);

      const img = document.createElement("img");
      img.src = cap.image;
      img.alt = cap.title;
      img.className = `absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`;
      servicesVisual.appendChild(img);

      const overlay = document.createElement("div");
      overlay.className = `bg-white/85 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/20 transition-all duration-700 transform ${
        isActive
          ? "opacity-100 translate-y-0 relative"
          : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"
      }`;
      overlay.innerHTML = `
        <h4 class="text-xl font-bold text-navy mb-2 tracking-tight">${cap.title}</h4>
        <p class="text-sm font-medium text-navy/70 leading-relaxed mb-6">${cap.description}</p>
      `;
      servicesOverlay.appendChild(overlay);
    });
  };

  renderServices();
})();
