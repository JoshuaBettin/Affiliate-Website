document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM vollständig geladen, starte Skript.");

    // Kopf- und Fußzeile laden
    ladeKopfUndFusszeilen();

    // Stelle sicher, dass Mammoth.js geladen ist, bevor die Datenschutzerklärung geladen wird
    if (typeof Mammoth === "undefined") {
        console.error("Fehler: Mammoth.js wurde nicht geladen!");
        return;
    }

    // Datenschutzerklärung laden
    ladeDatenschutzerklaerung();
});

// 🟢 Funktion zum Laden der Kopf- und Fußzeilen
function ladeKopfUndFusszeilen() {
    fetch("/components/header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fehler beim Laden der Kopfzeile: " + response.status);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("header").innerHTML = data;
            console.log("Kopfzeile erfolgreich geladen.");
        })
        .catch(error => console.error("Fehler beim Laden der Kopfzeile:", error));

    fetch("/components/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Fehler beim Laden der Fußzeile: " + response.status);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer").innerHTML = data;
            console.log("Fußzeile erfolgreich geladen.");
        })
        .catch(error => console.error("Fehler beim Laden der Fußzeile:", error));
}

// 🟢 Funktion zum Laden der Datenschutzerklärung
async function ladeDatenschutzerklaerung() {
    let container = document.getElementById("datenschutz-inhalt");

    if (!container) {
        console.error("Fehler: Element mit ID 'datenschutz-inhalt' nicht gefunden!");
        return;
    }

    let docxFilePath = "/assets/Datenschutzerklaerung.docx"; // Stelle sicher, dass die Datei existiert

    try {
        let response = await fetch(docxFilePath);
        if (!response.ok) {
            throw new Error("Fehler beim Abruf der Datei: " + response.status);
        }

        let blob = await response.blob();
        let reader = new FileReader();

        reader.onload = function (event) {
            let arrayBuffer = reader.result;

            Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(function (result) {
                    console.log("Datenschutzerklärung erfolgreich geladen!");
                    container.innerHTML = result.value;
                })
                .catch(function (err) {
                    console.error("Fehler bei der Umwandlung mit Mammoth:", err);
                });
        };

        reader.readAsArrayBuffer(blob);
    } catch (error) {
        console.error("Fehler beim Laden der Datenschutzerklärung:", error);
        container.innerHTML = "Fehler beim Laden der Datenschutzerklärung.";
    }
}
