const contentImages = document.querySelectorAll("main img");
const imageViewer = document.createElement("div");
const viewerPanel = document.createElement("div");
const viewerImage = document.createElement("img");
const viewerCaption = document.createElement("p");
const closeViewerButton = document.createElement("button");

imageViewer.className = "image-lightbox";
imageViewer.setAttribute("role", "dialog");
imageViewer.setAttribute("aria-modal", "true");
imageViewer.setAttribute("aria-label", "Expanded photo");
imageViewer.tabIndex = -1;
imageViewer.hidden = true;
viewerPanel.className = "image-lightbox-panel";
viewerImage.alt = "";
viewerCaption.id = "image-viewer-caption";
closeViewerButton.className = "image-lightbox-close";
closeViewerButton.type = "button";
closeViewerButton.textContent = "X";
closeViewerButton.setAttribute("aria-label", "Close expanded photo");
closeViewerButton.title = "Close photo";
imageViewer.setAttribute("aria-describedby", viewerCaption.id);
viewerPanel.append(closeViewerButton, viewerImage, viewerCaption);
imageViewer.append(viewerPanel);
document.body.append(imageViewer);

let activeImage = null;

function showImage(image) {
    activeImage = image;
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = image.alt;
    imageViewer.hidden = false;
    image.setAttribute("aria-expanded", "true");
    closeViewerButton.focus({ preventScroll: true });
}

function closeImageViewer() {
    if (imageViewer.hidden) return;

    imageViewer.hidden = true;
    if (activeImage) {
        activeImage.setAttribute("aria-expanded", "false");
        activeImage.focus({ preventScroll: true });
        activeImage = null;
    }
}

closeViewerButton.addEventListener("click", closeImageViewer);
document.addEventListener("keydown", (event) => {
    if (imageViewer.hidden) return;

    if (event.key === "Escape") {
        event.preventDefault();
        closeImageViewer();
    } else if (event.key === "Tab") {
        event.preventDefault();
        closeViewerButton.focus({ preventScroll: true });
    }
}, true);
imageViewer.addEventListener("click", (event) => {
    if (event.target === imageViewer) closeImageViewer();
});

const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 })
    : null;

contentImages.forEach((image) => {
    const revealTarget = image.closest("figure") || image;
    revealTarget.classList.add("scroll-reveal");
    image.classList.add("zoomable-image");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `View larger image: ${image.alt || "photo"}`);

    if (revealObserver) {
        revealObserver.observe(revealTarget);
    } else {
        revealTarget.classList.add("is-visible");
    }

    image.setAttribute("aria-expanded", "false");
    image.addEventListener("click", () => showImage(image));
    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showImage(image);
        }
    });
});