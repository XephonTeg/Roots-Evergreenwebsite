const overlay = document.getElementById("contactOverlay");
const openContactBtn = document.getElementById("openContact");
const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const thankYou = document.getElementById("thankYou");
const overlayDim = document.getElementById("overlayDim");
const closeContactBtn = document.getElementById("closeContact");
const cancelBtn = document.getElementById("cancelBtn");

const optionalAssets = [
  {
    imageId: "wordmarkImage",
    fallbackId: "wordmarkFallback"
  },
  {
    imageId: "logoImage",
    fallbackId: "logoFallback"
  },
  {
    imageId: "topRightLeafImage",
    fallbackId: "topRightLeafFallback"
  },
  {
    imageId: "bottomLeftLeafImage",
    fallbackId: "bottomLeftLeafFallback"
  },
  {
    imageId: "seedIconImage",
    fallbackId: "seedIconFallback"
  }
];

const THANK_YOU_DURATION_MS = 5000;
const FADE_OUT_MS = 780;

function activateOptionalAsset(imageId, fallbackId) {
  const imgEl = document.getElementById(imageId);
  const fallbackEl = document.getElementById(fallbackId);

  if (!imgEl || !fallbackEl) {
    return;
  }

  const testImage = new Image();
  testImage.onload = () => {
    imgEl.classList.add("loaded");
    fallbackEl.classList.add("hidden");
  };

  testImage.onerror = () => {
    imgEl.classList.remove("loaded");
    fallbackEl.classList.remove("hidden");
  };

  testImage.src = imgEl.getAttribute("src");
}

function openOverlay() {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  const firstField = document.getElementById("name");
  if (firstField) {
    firstField.focus();
  }
}

function closeOverlay() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  thankYou.classList.remove("visible");
  thankYou.setAttribute("aria-hidden", "true");
  sendBtn.disabled = false;
  sendBtn.textContent = "Send";
}

async function handleFormSubmit(event) {
  event.preventDefault();

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Unable to submit contact form");
    }

    contactForm.reset();
    thankYou.classList.add("visible");
    thankYou.setAttribute("aria-hidden", "false");

    setTimeout(() => {
      thankYou.classList.remove("visible");
      thankYou.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        closeOverlay();
        openContactBtn.focus();
      }, FADE_OUT_MS);
    }, THANK_YOU_DURATION_MS);
  } catch (error) {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    alert("We could not send your message right now. Please try again.");
  }
}

openContactBtn.addEventListener("click", openOverlay);
contactForm.addEventListener("submit", handleFormSubmit);

if (closeContactBtn) {
  closeContactBtn.addEventListener("click", () => {
    closeOverlay();
    openContactBtn.focus();
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    closeOverlay();
    openContactBtn.focus();
  });
}

if (overlayDim) {
  overlayDim.addEventListener("click", () => {
    closeOverlay();
    openContactBtn.focus();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("open")) {
    closeOverlay();
    openContactBtn.focus();
  }
});

optionalAssets.forEach(({ imageId, fallbackId }) => {
  activateOptionalAsset(imageId, fallbackId);
});
