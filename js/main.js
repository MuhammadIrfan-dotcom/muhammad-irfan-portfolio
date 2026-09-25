(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "✕" : "☰";
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }

  const sections = [...document.querySelectorAll("section[id], #top")];
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const setActive = () => {
    const y = window.scrollY + 110;
    let current = "top";
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec.id || "top";
    });
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          entry.target.classList.remove("is-waiting");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
  const hero = document.querySelector(".hero.reveal");
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add("is-in");
      hero.classList.remove("is-waiting");
    });
  }

  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statsIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statsIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => statsIo.observe(el));

  // Force work section + cards visible (reveal animation must not hide them)
  document.querySelectorAll("#work .work-card").forEach((card) => {
    card.classList.remove("pop");
    card.style.opacity = "1";
    card.style.visibility = "visible";
  });
  const workSection = document.querySelector("#work");
  if (workSection) {
    workSection.classList.add("is-in");
    workSection.classList.remove("is-waiting");
    workSection.querySelectorAll(".kicker, .section-title, .lead, .filters").forEach((el) => {
      el.classList.remove("pop");
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
    });
  }

  // Project filters
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".work-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const f = btn.dataset.filter || "all";
      cards.forEach((card) => {
        const type = card.dataset.type || "";
        const show = f === "all" || type === f;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  const modal = document.getElementById("success-modal");
  const modalClose = document.getElementById("success-modal-close");
  const modalOk = document.getElementById("success-modal-ok");

  function openSuccessModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    (modalOk || modalClose)?.focus?.();
  }

  function closeSuccessModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  if (modalClose) modalClose.addEventListener("click", closeSuccessModal);
  if (modalOk) modalOk.addEventListener("click", closeSuccessModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSuccessModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeSuccessModal();
    });
  }

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const message = String(data.get("message") || "").trim();
      if (!name || !email || !phone || !message) return;

      if (note) {
        note.hidden = false;
        note.textContent = "";
        note.style.color = "";
      }
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch("https://formsubmit.co/ajax/mirfanmanzoor238@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
            _subject: `Portfolio inquiry from ${name}`,
            _template: "table",
            _captcha: "false",
          }),
        });

        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.message || "Send failed");

        form.reset();
        if (note) note.hidden = true;
        openSuccessModal();
      } catch (err) {
        if (note) {
          note.hidden = false;
          note.style.color = "#ff8a8a";
          note.textContent =
            "Could not send. Please try again or email mirfanmanzoor238@gmail.com.";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
