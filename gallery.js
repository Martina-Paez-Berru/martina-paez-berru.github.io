// Image Gallery Lightbox System
document.addEventListener('DOMContentLoaded', function() {
  // Create lightbox HTML structure
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <span class="lightbox-prev">&#10094;</span>
    <span class="lightbox-next">&#10095;</span>
    <div class="lightbox-content">
      <img src="" alt="">
    </div>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const counter = lightbox.querySelector('.lightbox-counter');

  let currentGallery = [];
  let currentIndex = 0;

  // Find all images with gallery-trigger class
  const galleryImages = document.querySelectorAll('.gallery-trigger');

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      const galleryName = this.getAttribute('data-gallery');
      
      // Get all images in this gallery
      currentGallery = Array.from(document.querySelectorAll(`[data-gallery="${galleryName}"]`));
      currentIndex = currentGallery.indexOf(this);
      
      showImage(currentIndex);
      lightbox.classList.add('active');
    });
  });

  function showImage(index) {
    if (currentGallery.length === 0) return;
    
    currentIndex = index;
    const img = currentGallery[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    
    // Update counter
    counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    
    // Hide navigation if only one image
    if (currentGallery.length === 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function nextImage() {
    if (currentIndex < currentGallery.length - 1) {
      showImage(currentIndex + 1);
    } else {
      showImage(0); // Loop back to first image
    }
  }

  function prevImage() {
    if (currentIndex > 0) {
      showImage(currentIndex - 1);
    } else {
      showImage(currentGallery.length - 1); // Loop to last image
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  // Event listeners
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', nextImage);
  prevBtn.addEventListener('click', prevImage);

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        prevImage();
      }
    }
  }
});
