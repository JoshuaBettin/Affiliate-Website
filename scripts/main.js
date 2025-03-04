document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM vollständig geladen");
    initHeaderFooter();
    initDynamicComponents();
});

function initHeaderFooter() {
    const loadComponent = async (path, elementId) => {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error(`❌ Fehler bei ${path}:`, error);
            document.getElementById(elementId).innerHTML = `
                <div class="p-4 bg-red-50 text-red-700 text-center">
                    ${elementId} konnte nicht geladen werden – Bitte Seite neu laden
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