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
  const modalDownload = document.getElementById("policy-modal-download");
  const modalContent = document.getElementById("policy-modal-content");
  const modalClose = document.getElementById("policy-modal-close");

  const modalHeader = policyModal.querySelector(".policy-modal__header");

  function openPolicyModal(id, title, link, color) {
    modalTitle.textContent = title;
    const contentSrc = document.getElementById("policy-content-" + id);
    modalContent.innerHTML = contentSrc ? contentSrc.innerHTML : "";
    modalContent.scrollTop = 0;
    const hasDoc = link && link !== "#";
    modalDownload.href = hasDoc ? link : "#";
    modalDownload.hidden = !hasDoc;
    if (color) {
      modalHeader.style.background = color;
      modalHeader.classList.add("is-colored");
    } else {
      modalHeader.style.background = "";
      modalHeader.classList.remove("is-colored");
    }
    policyModal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closePolicyModal() {
    policyModal.hidden = true;
    modalHeader.style.background = "";
    modalHeader.classList.remove("is-colored");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".policy-card").forEach((card) => {
    card.addEventListener("click", () => {
      openPolicyModal(
        card.dataset.policyId,
        card.dataset.policyTitle,
        card.dataset.policyLink,
        card.dataset.policyColor
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
