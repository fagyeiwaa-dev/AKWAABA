const contentImages = document.querySelectorAll("main img");
const imageViewer = document.createElement("dialog");
const viewerImage = document.createElement("img");
const viewerCaption = document.createElement("p");
const closeViewerButton = document.createElement("button");

imageViewer.className = "image-lightbox";
imageViewer.setAttribute("aria-label", "Expanded photo");
viewerImage.alt = "";
viewerCaption.id = "image-viewer-caption";
closeViewerButton.className = "image-lightbox-close";
closeViewerButton.type = "button";
closeViewerButton.textContent = "Close";
closeViewerButton.setAttribute("aria-label", "Close expanded photo");
imageViewer.setAttribute("aria-describedby", viewerCaption.id);
imageViewer.append(closeViewerButton, viewerImage, viewerCaption);
document.body.append(imageViewer);

function showImage(image) {
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = image.alt;
    imageViewer.showModal();
}

closeViewerButton.addEventListener("click", () => imageViewer.close());
imageViewer.addEventListener("cancel", (event) => {
    event.preventDefault();
    imageViewer.close();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageViewer.open) {
        event.preventDefault();
        imageViewer.close();
    }
}, true);
imageViewer.addEventListener("click", (event) => {
    if (event.target === imageViewer) imageViewer.close();
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

    image.addEventListener("click", () => showImage(image));
    image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showImage(image);
        }
    });
});