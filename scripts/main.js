document.addEventListener("DOMContentLoaded", async () => {

    console.log("✅ DOM vollständig geladen");

    initHeaderFooter();

    

    // Nur auf Kategorienseite ausführen

    if (document.getElementById('wearables-container')) {

        await loadCategoryProducts('wearables-container', 'wearables');

        await loadCategoryProducts('audio-container', 'audio');

        await loadCategoryProducts('zubehoer-container', 'zubehoer');

        enforceCardHeights();

    }



    // Immer ausführen

    initImageSwitchers();

    initHoverEffects();



    // Nur auf Indexseite ausführen

    if (document.getElementById('produkt-container')) {

        loadProducts('produkt-container');

    }

});



const BASE_URL = window.location.href.includes('github.io') 

    ? '/Affiliate-Website' 

    : '';



let allCategories = [];



function initHeaderFooter() {

    const loadComponent = async (path, elementId) => {

        try {

            const response = await fetch(`${BASE_URL}${path}`);

            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

            const html = await response.text();

            document.getElementById(elementId).innerHTML = html;

        } catch (error) {

            console.error(`❌ Fehler bei ${path}:`, error);

            const element = document.getElementById(elementId);

            if (element) {

                element.innerHTML = `

                    <div class="p-4 bg-red-50 text-red-700 text-center">

                        Fehler beim Laden der Komponente.<br>

                        <a href="${BASE_URL}${path}" target="_blank" class="underline">Direktlink prüfen</a>

                    </div>

                `;

            }

        }

    };



    loadComponent('/components/header.html', 'header');

    loadComponent('/components/footer.html', 'footer');

}



async function loadProducts(containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;



    const products = [

        '/components/products/product1.html',

        '/components/products/product2.html',

        '/components/products/product3.html'

    ];



    try {

        const productHtml = await Promise.all(

            products.map(url => 

                fetch(`${BASE_URL}${url}`).then(res => res.text())

            )

        );

        container.innerHTML = productHtml.join('');

        setTimeout(() => {

            initImageSwitchers();

            initHoverEffects();

        }, 50);

    } catch (error) {

        console.error('Fehler beim Laden der Produkte:', error);

        container.innerHTML = `<p class="text-red-500 text-center">Produkte konnten nicht geladen werden</p>`;

    }

}



function switchImage(newSrc, clickedElement) {

    const mainImage = clickedElement.closest('.relative')?.querySelector('#main-image');

    if (!mainImage) return;



    mainImage.src = newSrc;

    clickedElement.closest('.relative').querySelectorAll('.thumbnail-container')

        .forEach(t => t.classList.remove('active-thumbnail'));

    clickedElement.classList.add('active-thumbnail');

}



function initImageSwitchers() {

    document.querySelectorAll('.thumbnail-container').forEach(thumbnail => {

        thumbnail.addEventListener('click', function() {

            const img = this.querySelector('img');

            if (img) switchImage(img.src, this);

        });

    });

}



function initHoverEffects() {

    document.querySelectorAll('.thumbnail-container').forEach(thumb => {

        thumb.addEventListener('mouseenter', () => {

            thumb.style.transform = 'scale(1.15)';

        });

        thumb.addEventListener('mouseleave', () => {

            if (!thumb.classList.contains('active-thumbnail')) {

                thumb.style.transform = 'scale(1)';

            }

        });

    });

}



function openLightbox(imageSrc) {

    const lightbox = document.createElement('div');

    lightbox.id = 'lightbox-overlay';

    lightbox.innerHTML = `

        <div class="lightbox-content">

            <img src="${imageSrc}">

            <button onclick="closeLightbox()" class="lightbox-close">×</button>

        </div>

    `;

    document.body.appendChild(lightbox);

}



function closeLightbox() {

    const lightbox = document.getElementById('lightbox-overlay');

    if (lightbox) lightbox.remove();

}



async function loadAllProducts() {

    const products = [

        '/components/products/product1.html',

        '/components/products/product2.html',

        '/components/products/product3.html'

    ];



    try {

        return await Promise.all(

            products.map(url => 

                fetch(`${BASE_URL}${url}`)

                    .then(res => res.text())

                    .then(html => {

                        const wrapper = document.createElement('div');

                        wrapper.innerHTML = html;

                        const productElement = wrapper.firstElementChild;

                        productElement.dataset.kategorie = productElement.dataset.kategorie.toLowerCase();

                        return productElement;

                    })

            )

        );

    } catch (error) {

        console.error('Fehler beim Laden aller Produkte:', error);

        return [];

    }

}



async function loadCategoryProducts(containerId, kategorie) {

    try {

        const container = document.getElementById(containerId);

        if (!container) {

            console.warn(`Container ${containerId} nicht gefunden`);

            return;

        }



        const products = await loadAllProducts();

        const normalizedKategorie = kategorie.toLowerCase();

        const countElement = document.querySelector(`.product-count[data-kategorie="${normalizedKategorie}"]`);

        

        const filtered = products.filter(product => {

            const categories = product.dataset.kategorie.split(' ');

            return categories.includes(normalizedKategorie);

        });



        container.innerHTML = filtered.map(p => p.outerHTML).join('');

        

        if (countElement) {

            countElement.textContent = filtered.length;

            countElement.nextSibling.textContent = 

                filtered.length === 1 ? ' Produkt' : ' Produkte';

        }



    } catch (error) {

        console.error(`Fehler beim Laden von ${containerId}:`, error);

        const container = document.getElementById(containerId);

        if (container) {

            container.innerHTML = `<p class="text-red-500">Produkte konnten nicht geladen werden</p>`;

        }

    }

}



function enforceCardHeights() {

    const cards = document.querySelectorAll('.produkt-karte');

    let maxHeight = 0;

    

    cards.forEach(card => {

        const height = card.offsetHeight;

        if (height > maxHeight) maxHeight = height;

    });

    

    cards.forEach(card => {

        card.style.minHeight = `${maxHeight}px`;

    });

}