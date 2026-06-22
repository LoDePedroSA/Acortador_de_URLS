const urlPreviewSpan = document.getElementById("previewUrl");
const inputSiglas = document.getElementById("siglasAlias");
const inputUrl = document.getElementById("urlOriginal");
const btnEnviar = document.getElementById("btnEnviar");
const resultArea = document.getElementById("resultArea");
const resultMessage = document.getElementById("resultMessage");
const generatedLinkDiv = document.getElementById("generatedLinkDiv");

function updatePreview() {
    let siglas = inputSiglas.value.trim();
    if (siglas === "") {
        urlPreviewSpan.innerText = "https://lodepedrosa.github.io/Acortador_de_URLS/?=[tusiglas]";
        urlPreviewSpan.style.opacity = "0.7";
    } else {
        urlPreviewSpan.innerText = `https://lodepedrosa.github.io/Acortador_de_URLS/?=${encodeURIComponent(siglas)}`;
        urlPreviewSpan.style.opacity = "1";
    }
}

inputSiglas.addEventListener("input", updatePreview);
updatePreview();

function showMessage(type, message, extraLink = null) {
    resultArea.style.display = "block";
    resultArea.classList.remove("result-success", "result-error", "result-info");
    if (type === "success") {
        resultArea.classList.add("result-success");
    } else if (type === "error") {
        resultArea.classList.add("result-error");
    } else {
        resultArea.classList.add("result-info");
    }
    resultMessage.innerText = message;

    if (extraLink && type === "success") {
        generatedLinkDiv.innerHTML = `<div class="link-example">✅ Tu enlace acortado: <strong>${escapeHtml(extraLink)}</strong><br>
            <span style="font-size:0.75rem;">👉 Compártelo, redirigirá automáticamente</span></div>`;
    } else {
        generatedLinkDiv.innerHTML = "";
    }

    setTimeout(() => {
        if (type !== "error") {
        }
    }, 5000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function enviar() {
    let urlLarga = inputUrl.value.trim();
    let siglas = inputSiglas.value.trim();

    if (!urlLarga) {
        showMessage("error", "❌ Por favor ingresa la URL que deseas acortar.");
        return;
    }
    if (!siglas) {
        showMessage("error", "❌ Debes escribir las siglas o alias para tu enlace corto.");
        return;
    }

    if (!urlLarga.startsWith("http://") && !urlLarga.startsWith("https://")) {
        showMessage("error", "⚠️ La URL debe comenzar con http:// o https://");
        return;
    }

    const siglasLimpio = siglas.trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(siglasLimpio)) {
        showMessage("error", "❌ Las siglas solo pueden contener letras, números, guiones (-) y guion bajo (_). Sin espacios.");
        return;
    }

    const originalBtnText = btnEnviar.innerText;
    btnEnviar.innerText = "⏳ Verificando disponibilidad...";
    btnEnviar.disabled = true;

    try {
        const querySnapshot = await coleccionRef.where("siglas", "==", siglasLimpio).get();

        if (!querySnapshot.empty) {
            showMessage("error", `❌ Las siglas "${escapeHtml(siglasLimpio)}" ya están en uso. Elige otro alias.`);
            btnEnviar.innerText = originalBtnText;
            btnEnviar.disabled = false;
            return;
        }

        const nuevoDocumento = {
            activo: true,
            url: urlLarga,
            siglas: siglasLimpio,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await coleccionRef.add(nuevoDocumento);

        const urlRedir = `https://lodepedrosa.github.io/Acortador_de_URLS/?=${encodeURIComponent(siglasLimpio)}`;
        showMessage("success", `✅ ¡Enlace creado exitosamente!`, urlRedir);

        inputSiglas.value = "";
        updatePreview();
        inputUrl.value = "";
    } catch (error) {
        console.error("Error en Firestore:", error);
        showMessage("error", `❌ Error al guardar: ${error.message}. Revisa la consola o conexión.`);
    } finally {
        btnEnviar.innerText = originalBtnText;
        btnEnviar.disabled = false;
    }
}

async function autorediccionador() {
    const currentUrl = window.location.href;
    let parametroSiglas = null;

    const matchEquals = currentUrl.match(/\?=(.+?)(?:&|$)/);
    if (matchEquals && matchEquals[1]) {
        parametroSiglas = decodeURIComponent(matchEquals[1]);
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("alias")) {
            parametroSiglas = urlParams.get("alias");
        } else if (urlParams.has("siglas")) {
            parametroSiglas = urlParams.get("siglas");
        }
    }

    if (!parametroSiglas) {
        console.log("[Autoredir] No se detectaron siglas en URL, modo normal.");
        return;
    }

    console.log(`[Autoredir] Buscando siglas: "${parametroSiglas}"`);

    try {
        const querySnapshot = await coleccionRef.where("siglas", "==", parametroSiglas).limit(1).get();

        if (querySnapshot.empty) {
            console.warn(`[Autoredir] No existe documento con siglas: ${parametroSiglas}`);
            const bodyMsg = document.createElement("div");
            bodyMsg.style.position = "fixed";
            bodyMsg.style.bottom = "20px";
            bodyMsg.style.left = "20px";
            bodyMsg.style.background = "#aa2e2ecc";
            bodyMsg.style.padding = "8px 18px";
            bodyMsg.style.borderRadius = "40px";
            bodyMsg.style.color = "white";
            bodyMsg.style.fontSize = "0.8rem";
            bodyMsg.style.zIndex = "9999";
            bodyMsg.innerText = `⚠️ El enlace "${parametroSiglas}" no existe o no está activo.`;
            document.body.appendChild(bodyMsg);
            setTimeout(() => bodyMsg.remove(), 4000);
            return;
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        const destinoUrl = data.url;
        const activo = data.activo;

        if (!activo) {
            console.warn(`[Autoredir] La sigla ${parametroSiglas} está desactivada.`);
            const msgDiv = document.createElement("div");
            msgDiv.style.position = "fixed";
            msgDiv.style.bottom = "20px";
            msgDiv.style.left = "20px";
            msgDiv.style.background = "#b45f06cc";
            msgDiv.style.padding = "8px 18px";
            msgDiv.style.borderRadius = "40px";
            msgDiv.style.color = "white";
            msgDiv.innerText = `🔒 El enlace "${parametroSiglas}" se encuentra inactivo.`;
            document.body.appendChild(msgDiv);
            setTimeout(() => msgDiv.remove(), 4000);
            return;
        }

        if (destinoUrl) {
            console.log(`[Autoredir] Redirigiendo a: ${destinoUrl}`);
            window.location.href = destinoUrl;
        } else {
            throw new Error("El documento no contiene campo 'url' válido.");
        }
    } catch (error) {
        console.error("[Autoredir] Error crítico:", error);
        const errorDiv = document.createElement("div");
        errorDiv.style.position = "fixed";
        errorDiv.style.bottom = "20px";
        errorDiv.style.left = "20px";
        errorDiv.style.background = "#8b0000cc";
        errorDiv.style.padding = "8px 20px";
        errorDiv.style.borderRadius = "30px";
        errorDiv.style.color = "#ffcaca";
        errorDiv.innerText = `Error al procesar redirección: ${error.message}`;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

btnEnviar.addEventListener("click", enviar);

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        autorediccionador();
    }, 100);
});

const ejemploDemo = () => {
    console.log("Acortador LDP listo. Firestore conectado");
};
ejemploDemo();

if (window.location.search.includes("?=")) {
    const hint = document.createElement("div");
    hint.style.backgroundColor = "#1e2a3a";
    hint.style.padding = "8px";
    hint.style.borderRadius = "24px";
    hint.style.marginTop = "10px";
    hint.style.fontSize = "0.7rem";
    hint.style.textAlign = "center";
    hint.innerText = "🔄 Detectado intento de acceso con siglas. Redirigiendo automáticamente...";
    document.querySelector(".card").appendChild(hint);
    setTimeout(() => hint.remove(), 2000);
}

const helpText = document.createElement("div");
