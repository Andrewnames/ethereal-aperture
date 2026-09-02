const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initNav() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-nav]"));
  if (!links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          link.classList.toggle("is-active", link.dataset.nav === entry.target.id);
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  for (const link of links) {
    const section = document.getElementById(link.dataset.nav ?? "");
    if (section) observer.observe(section);
  }
}

function initLightbox() {
  const figures = Array.from(document.querySelectorAll<HTMLElement>("figure[data-photo]"));
  const dialog = document.getElementById("lightbox");
  if (!figures.length || !(dialog instanceof HTMLElement)) return;

  const frameEl = dialog.querySelector<HTMLElement>("[data-lb-idx]");
  const captionEl = dialog.querySelector<HTMLElement>("[data-lb-caption]");
  const imageEl = dialog.querySelector<HTMLImageElement>("[data-lb-image]");
  const emptyEl = dialog.querySelector<HTMLElement>("[data-lb-empty]");
  const closeBtn = dialog.querySelector<HTMLButtonElement>("[data-lb-close]");
  const prevBtn = dialog.querySelector<HTMLButtonElement>("[data-lb-prev]");
  const nextBtn = dialog.querySelector<HTMLButtonElement>("[data-lb-next]");

  let index = 0;
  let lastFocus: HTMLElement | null = null;
  let touchStartX = 0;

  const open = (i: number, from?: HTMLElement) => {
    index = (i + figures.length) % figures.length;
    lastFocus = from ?? figures[index] ?? null;
    render();
    dialog.classList.add("is-open");
    document.body.classList.add("is-locked");
    closeBtn?.focus();
  };

  const close = () => {
    dialog.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    lastFocus?.focus();
  };

  const step = (n: number) => open(index + n, lastFocus ?? undefined);

  const render = () => {
    const figure = figures[index];
    if (!figure) return;
    const src = figure.dataset.src ?? "";
    const alt = figure.dataset.alt ?? "";
    const caption = figure.dataset.caption ?? "";
    const label = figure.dataset.indexLabel ?? "";

    if (frameEl) frameEl.textContent = `Frame ${label}`;
    if (captionEl) captionEl.textContent = caption;

    if (src && imageEl && emptyEl) {
      imageEl.hidden = false;
      emptyEl.hidden = true;
      imageEl.src = src;
      imageEl.alt = alt;
    } else if (imageEl && emptyEl) {
      imageEl.hidden = true;
      imageEl.removeAttribute("src");
      imageEl.alt = "";
      emptyEl.hidden = false;
    }
  };

  const trap = (event: KeyboardEvent) => {
    if (!dialog.classList.contains("is-open") || event.key !== "Tab") return;
    const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute("hidden") && el.offsetParent !== null,
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  for (const [i, figure] of figures.entries()) {
    figure.addEventListener("click", () => open(i, figure));
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(i, figure);
      }
    });
  }

  closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    close();
  });
  prevBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(-1);
  });
  nextBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(1);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });

  dialog.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const delta = endX - touchStartX;
    if (Math.abs(delta) < 48) return;
    step(delta < 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (!dialog.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
    trap(event);
  });
}

function initWrite() {
  const dialog = document.getElementById("write-dialog");
  if (!(dialog instanceof HTMLElement)) return;

  const form = dialog.querySelector<HTMLFormElement>("[data-write-form]");
  const fields = dialog.querySelector<HTMLElement>("[data-write-fields]");
  const flash = dialog.querySelector<HTMLElement>("[data-write-flash]");
  const interest = dialog.querySelector<HTMLSelectElement>("[data-write-interest]");
  const source = dialog.querySelector<HTMLInputElement>("[data-write-source]");
  const closeBtn = dialog.querySelector<HTMLButtonElement>("[data-write-close]");
  let lastFocus: HTMLElement | null = null;

  const setFlash = (text: string, kind: "ok" | "error" | "off") => {
    if (!flash) return;
    if (kind === "off") {
      flash.hidden = true;
      flash.textContent = "";
      flash.classList.remove("is-error");
      return;
    }
    flash.hidden = false;
    flash.textContent = text;
    flash.classList.toggle("is-error", kind === "error");
  };

  const setInterest = (value: string, fromClass: boolean) => {
    if (source) source.value = fromClass ? "class" : "site";
    if (!interest) return;
    if (value && ![...interest.options].some((option) => option.value === value)) {
      interest.add(new Option(value, value, true, true));
    }
    interest.value = value;
  };

  const open = (from?: HTMLElement, about = "") => {
    lastFocus = from ?? null;
    form?.reset();
    if (fields) fields.hidden = false;
    setFlash("", "off");
    setInterest(about, Boolean(about));
    dialog.classList.add("is-open");
    document.body.classList.add("is-locked");
    const first = dialog.querySelector<HTMLInputElement>("input[name='name']");
    first?.focus();
  };

  const close = () => {
    dialog.classList.remove("is-open");
    if (!document.getElementById("lightbox")?.classList.contains("is-open")) {
      document.body.classList.remove("is-locked");
    }
    lastFocus?.focus();
  };

  const trap = (event: KeyboardEvent) => {
    if (!dialog.classList.contains("is-open") || event.key !== "Tab") return;
    const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute("hidden") && el.offsetParent !== null,
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  for (const trigger of document.querySelectorAll<HTMLElement>("[data-write]")) {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      open(trigger, trigger.dataset.about ?? "");
    });
  }

  closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  window.addEventListener("keydown", (event) => {
    if (!dialog.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    trap(event);
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector<HTMLButtonElement>("button[type='submit']");
    if (submit) submit.disabled = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean }
        | null;
      if (response.ok && data?.ok) {
        if (fields) fields.hidden = true;
        setFlash("Received. I will write back from this address.", "ok");
        closeBtn?.focus();
      } else {
        setFlash(
          "Something was missing — name, a real email, and a note are required.",
          "error",
        );
      }
    } catch {
      setFlash("Could not send just now. Try again in a moment.", "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  const about = new URLSearchParams(window.location.search).get("about") ?? "";
  if (about) open(undefined, about);
}

initNav();
initLightbox();
initWrite();
