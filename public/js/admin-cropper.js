/**
 * Chef Blog Admin - Image Cropping & Adjustment Tool
 * Uses Cropper.js to allow interactive cropping, zooming, rotating, and aspect ratio adjustment.
 */

(function () {
  let cropper = null;
  let currentFileInput = null;
  let currentPreviewImg = null;
  let modalEl = null;

  function createCropperModal() {
    if (document.getElementById('cropperModal')) {
      return document.getElementById('cropperModal');
    }

    const modal = document.createElement('div');
    modal.id = 'cropperModal';
    modal.className = 'cropper-modal-overlay';
    modal.innerHTML = `
      <div class="cropper-modal-container">
        <div class="cropper-modal-header">
          <h3><i class="fas fa-crop-alt"></i> Crop & Adjust Image</h3>
          <button type="button" class="cropper-close-btn" id="cropperCancelX">&times;</button>
        </div>
        <div class="cropper-modal-body">
          <div class="cropper-canvas-area">
            <img id="cropperSourceImage" src="" alt="Crop Source">
          </div>
          <div class="cropper-side-preview">
            <label class="preview-label">Live Preview</label>
            <div class="cropper-preview-box" id="cropperPreviewBox"></div>
            <div class="aspect-ratio-controls">
              <span class="control-section-title">Aspect Ratio</span>
              <div class="aspect-btn-group">
                <button type="button" class="aspect-btn" data-aspect="free">Free</button>
                <button type="button" class="aspect-btn active" data-aspect="1">1:1 Square</button>
                <button type="button" class="aspect-btn" data-aspect="1.3333">4:3 Food</button>
                <button type="button" class="aspect-btn" data-aspect="1.7777">16:9 Wide</button>
                <button type="button" class="aspect-btn" data-aspect="0.75">3:4 Portrait</button>
              </div>
            </div>
            <div class="transform-controls">
              <span class="control-section-title">Transform</span>
              <div class="transform-btn-group">
                <button type="button" class="tool-btn" id="cropRotateLeft" title="Rotate Left 90°"><i class="fas fa-undo"></i></button>
                <button type="button" class="tool-btn" id="cropRotateRight" title="Rotate Right 90°"><i class="fas fa-redo"></i></button>
                <button type="button" class="tool-btn" id="cropZoomIn" title="Zoom In"><i class="fas fa-search-plus"></i></button>
                <button type="button" class="tool-btn" id="cropZoomOut" title="Zoom Out"><i class="fas fa-search-minus"></i></button>
                <button type="button" class="tool-btn" id="cropFlipH" title="Flip Horizontal"><i class="fas fa-arrows-alt-h"></i></button>
                <button type="button" class="tool-btn" id="cropReset" title="Reset View"><i class="fas fa-sync-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div class="cropper-modal-footer">
          <button type="button" class="btn-cropper-cancel" id="cropperCancelBtn">Cancel</button>
          <button type="button" class="btn-cropper-apply" id="cropperApplyBtn"><i class="fas fa-check"></i> Apply & Save Crop</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    attachModalEvents(modal);
    return modal;
  }

  let scaleX = 1;
  let scaleY = 1;

  function attachModalEvents(modal) {
    const cancelX = modal.querySelector('#cropperCancelX');
    const cancelBtn = modal.querySelector('#cropperCancelBtn');
    const applyBtn = modal.querySelector('#cropperApplyBtn');
    const rotateLeft = modal.querySelector('#cropRotateLeft');
    const rotateRight = modal.querySelector('#cropRotateRight');
    const zoomIn = modal.querySelector('#cropZoomIn');
    const zoomOut = modal.querySelector('#cropZoomOut');
    const flipH = modal.querySelector('#cropFlipH');
    const reset = modal.querySelector('#cropReset');

    const closeHandler = () => {
      closeCropperModal();
    };

    cancelX.addEventListener('click', closeHandler);
    cancelBtn.addEventListener('click', closeHandler);

    rotateLeft.addEventListener('click', () => { if (cropper) cropper.rotate(-90); });
    rotateRight.addEventListener('click', () => { if (cropper) cropper.rotate(90); });
    zoomIn.addEventListener('click', () => { if (cropper) cropper.zoom(0.1); });
    zoomOut.addEventListener('click', () => { if (cropper) cropper.zoom(-0.1); });
    
    flipH.addEventListener('click', () => {
      if (cropper) {
        scaleX = -scaleX;
        cropper.scaleX(scaleX);
      }
    });

    reset.addEventListener('click', () => {
      if (cropper) {
        scaleX = 1;
        scaleY = 1;
        cropper.reset();
      }
    });

    // Aspect ratio buttons
    modal.querySelectorAll('.aspect-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        modal.querySelectorAll('.aspect-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const aspectVal = this.getAttribute('data-aspect');
        if (cropper) {
          if (aspectVal === 'free') {
            cropper.setAspectRatio(NaN);
          } else {
            cropper.setAspectRatio(parseFloat(aspectVal));
          }
        }
      });
    });

    // Apply button
    applyBtn.addEventListener('click', () => {
      if (!cropper || !currentFileInput) return;

      const canvas = cropper.getCroppedCanvas({
        maxWidth: 1600,
        maxHeight: 1600,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      canvas.toBlob(blob => {
        if (!blob) return;
        
        // Generate new file
        const origName = currentFileInput.dataset.origName || 'cropped-image.jpg';
        const fileExt = origName.split('.').pop() || 'jpg';
        const newFile = new File([blob], origName.replace(/\.[^/.]+$/, "") + "-cropped." + fileExt, {
          type: blob.type || 'image/jpeg',
          lastModified: Date.now()
        });

        // Set into file input using DataTransfer
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        currentFileInput.files = dataTransfer.files;

        // Update preview image if exists
        const previewSelector = currentFileInput.getAttribute('data-preview');
        const previewEl = previewSelector ? document.querySelector(previewSelector) : currentPreviewImg;
        if (previewEl) {
          previewEl.src = canvas.toDataURL('image/jpeg', 0.9);
          previewEl.style.display = 'block';
        }

        // Show friendly success indicator next to the input
        let badge = currentFileInput.parentElement.querySelector('.crop-success-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'crop-success-badge';
          badge.innerHTML = '<i class="fas fa-check-circle"></i> Image Cropped & Ready';
          currentFileInput.parentElement.appendChild(badge);
        }

        closeCropperModal();
      }, 'image/jpeg', 0.92);
    });
  }

  function openCropper(file, fileInput, previewElement, defaultAspect = 1) {
    currentFileInput = fileInput;
    currentPreviewImg = previewElement;
    currentFileInput.dataset.origName = file.name;
    scaleX = 1;
    scaleY = 1;

    modalEl = createCropperModal();
    const sourceImg = modalEl.querySelector('#cropperSourceImage');
    
    // Choose appropriate default aspect ratio based on field type
    const aspect = fileInput.getAttribute('data-aspect') || (defaultAspect ? defaultAspect.toString() : 'free');
    modalEl.querySelectorAll('.aspect-btn').forEach(b => {
      if (b.getAttribute('data-aspect') === aspect) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const reader = new FileReader();
    reader.onload = e => {
      sourceImg.src = e.target.result;
      modalEl.classList.add('active');

      if (cropper) {
        cropper.destroy();
      }

      const ratio = aspect === 'free' ? NaN : parseFloat(aspect);

      cropper = new Cropper(sourceImg, {
        aspectRatio: ratio,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        preview: '#cropperPreviewBox',
        ready: function () {
          // Ready callback
        }
      });
    };
    reader.readAsDataURL(file);
  }

  function closeCropperModal() {
    if (modalEl) {
      modalEl.classList.remove('active');
    }
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  // Initialize all file inputs with crop support
  function initImageCropInputs() {
    const inputs = document.querySelectorAll('input[type="file"][accept*="image"], .crop-input');
    inputs.forEach(input => {
      // Avoid duplicate binding
      if (input.dataset.cropInitialized) return;
      input.dataset.cropInitialized = 'true';

      input.addEventListener('change', function (e) {
        const file = this.files && this.files[0];
        if (!file) return;

        // Skip if this change was triggered by our own DataTransfer assignment
        if (file.name.includes('-cropped.')) return;

        // Verify it's an image
        if (!file.type.startsWith('image/')) {
          return;
        }

        // Determine default aspect ratio
        let defaultAspect = 1.3333; // 4:3 for food
        if (this.id === 'chefImage' || this.name === 'chefImage') {
          defaultAspect = 0.75; // 3:4 for portrait
        } else if (this.id === 'blogImage' || this.name === 'image') {
          defaultAspect = 1.7777; // 16:9 for blogs
        }

        openCropper(file, this, null, defaultAspect);
      });
    });
  }

  // Expose globally
  window.initImageCropInputs = initImageCropInputs;
  window.openCropper = openCropper;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageCropInputs);
  } else {
    initImageCropInputs();
  }
})();
