document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM vollständig geladen");
    initHeaderFooter();
    initDynamicComponents();
  });
  
  // 🟢 Dynamische Basis-URL für GitHub Pages
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

function initDynamicComponents() {
    // Für zukünftige Erweiterungen
    document.querySelectorAll('[data-dynamic]').forEach(element => {
        console.log('Dynamisches Element:', element);
    });
}