document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM vollständig geladen, starte Skript.");

    // Kopf- und Fußzeile laden
    ladeKopfUndFusszeilen();
});

// 🟢 Funktion zum Laden der Kopf- und Fußzeilen
function ladeKopfUndFusszeilen() {
    fetch("/components/header.html")
        .then(response => response.ok ? response.text() : Promise.reject("❌ Fehler beim Laden der Kopfzeile"))
        .then(data => {
            document.getElementById("header").innerHTML = data;
            console.log("✅ Kopfzeile erfolgreich geladen.");
        })
        .catch(error => console.error(error));

    fetch("/components/footer.html")
        .then(response => response.ok ? response.text() : Promise.reject("❌ Fehler beim Laden der Fußzeile"))
        .then(data => {
            document.getElementById("footer").innerHTML = data;
            console.log("✅ Fußzeile erfolgreich geladen.");
        })
        .catch(error => console.error(error));
}
