document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM vollständig geladen");
    initHeaderFooter();
    initImageSwitchers();
    
    if (document.getElementById('produkt-container')) {
      loadProducts('produkt-container');
    }
});

const BASE_URL = window.location.href.includes('github.io') 
  ? '/Affiliate-Website' 
  : '';

function initHeaderFooter() {
  const loadComponent = async (path, elementId) => {
      try {
          const response = await fetch(`${BASE_URL}${path}`);
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
          const html = await response.text();
          document.getElementById(elementId).innerHTML = html;
      } catch (error) {
          console.error(`❌ Fehler bei ${path}:`, error);
          document.getElementById(elementId).innerHTML = `
              <div class="p-4 bg-red-50 text-red-700 text-center">
                  Fehler beim Laden der Komponente.<br>
                  <a href="${BASE_URL}${path}" target="_blank" class="underline">Direktlink prüfen</a>
              </div>
          `;
      }
  };

  loadComponent('/components/header.html', 'header');
  loadComponent('/components/footer.html', 'footer');
}

async function loadProducts(containerId) {
  const container = document.getElementById(containerId);
  const products = [
      '/components/products/product1.html',
      '/components/products/product2.html',
      '/components/products/product3.html'
  ];

  try {
      const productHtml = await Promise.all(
          products.map(url => 
              fetch(`${BASE_URL}${url}`)
              .then(res => res.text())
          )
      );
      container.innerHTML = productHtml.join('');
      setTimeout(initImageSwitchers, 50);
  } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error);
      container.innerHTML = `<p class="text-red-500 text-center">Produkte konnten nicht geladen werden</p>`;
  }
}

// Bildwechsel-Funktionen
function switchImage(newSrc, clickedElement) {
    const mainImage = clickedElement.closest('.relative').querySelector('#main-image');
    mainImage.src = newSrc;
    
    clickedElement.closest('.relative').querySelectorAll('.thumbnail-container')
        .forEach(t => t.classList.remove('active-thumbnail'));
    clickedElement.classList.add('active-thumbnail');
}

function initImageSwitchers() {
    document.querySelectorAll('.thumbnail-container').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const newSrc = this.querySelector('img').src;
            switchImage(newSrc, this);
        });
    });
}

// Lightbox-Funktionen
function openLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imageSrc}" class="max-h-[90vh] max-w-[90vw]">
            <button onclick="closeLightbox()" class="lightbox-close">×</button>
        </div>
    `;
    document.body.appendChild(lightbox);
}

function closeLightbox() {
    document.getElementById('lightbox-overlay')?.remove();
}