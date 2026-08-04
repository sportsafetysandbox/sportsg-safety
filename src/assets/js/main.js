const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav-item > button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".nav-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".nav-item.open").forEach((el) => {
      el.classList.remove("open");
      el.querySelector("button").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-item")) {
    document.querySelectorAll(".nav-item.open").forEach((el) => {
      el.classList.remove("open");
      el.querySelector("button").setAttribute("aria-expanded", "false");
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".nav-item.open").forEach((el) => {
      el.classList.remove("open");
      el.querySelector("button").setAttribute("aria-expanded", "false");
    });
  }
});

// Policy modal
const policyModal = document.getElementById("policy-modal");
if (policyModal) {
  const modalTitle = document.getElementById("policy-modal-title");
  const modalDesc = document.getElementById("policy-modal-desc");
  const modalDownload = document.getElementById("policy-modal-download");
  const modalIframe = document.getElementById("policy-modal-iframe");
  const modalUnavailable = document.getElementById("policy-modal-unavailable");
  const modalClose = document.getElementById("policy-modal-close");

  function openPolicyModal(title, body, link) {
    modalTitle.textContent = title;
    modalDesc.textContent = body;
    const hasDoc = link && link !== "#";
    modalIframe.src = hasDoc ? link : "";
    modalIframe.hidden = !hasDoc;
    modalUnavailable.hidden = hasDoc;
    modalDownload.href = hasDoc ? link : "#";
    modalDownload.style.opacity = hasDoc ? "" : "0.4";
    modalDownload.style.pointerEvents = hasDoc ? "" : "none";
    policyModal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closePolicyModal() {
    policyModal.hidden = true;
    modalIframe.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".policy-card").forEach((card) => {
    card.addEventListener("click", () => {
      openPolicyModal(
        card.dataset.policyTitle,
        card.dataset.policyBody,
        card.dataset.policyLink
      );
    });
  });

  modalClose.addEventListener("click", closePolicyModal);
  policyModal.querySelector(".policy-modal__backdrop").addEventListener("click", closePolicyModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !policyModal.hidden) closePolicyModal();
  });
}

// Generic filter-bar: a [data-filter-group="<id>"] bar filters items with
// [data-filter-value] inside the container with that id.
document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const container = document.getElementById(group.dataset.filterGroup);
  if (!container) return;
  const buttons = group.querySelectorAll("[data-filter]");
  const items = container.querySelectorAll("[data-filter-value]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle("outline", b !== btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      items.forEach((item) => {
        item.style.display = filter === "all" || item.dataset.filterValue === filter ? "" : "none";
      });
    });
  });
});
