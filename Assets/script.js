const modelsCatalog = [
    { title: "BetLDP", desc: "Casino ficticio, mete dinero con cupones: NUEVO USUARIO o paga +542215989210...", link: "https://betldpoficial-sudo.github.io/bet-ldp/" },
    { title: "Descargador de Archivos.bat", desc: "Modelo .bat: introducis la URL, seleccionas ubicación.", link: "./Models/downloader.html?=Descargador_de_Archivos.bat.zip" },
    { title: "Mercado en Progreso", desc: "Minijuego de compra/venta de objetos ficticios.", link: "./Models/Mercado_en_Progreso.html" },
    { title: "Registros de micros", desc: "Carga registros de viajes, lineas y recorridos Union Platense S.A.", link: "./Models/Registros_de_micros/index.html" },
    { title: "Ruleta Rusa", desc: "Carga participantes y desafía a la suerte.", link: "./Models/Ruleta_Rusa.html" },
    { title: "Creador de Codigos QR", desc: "Personaliza color, contenido y destinatario.", link: "./Models/Creador_de_Codigos_QR.html" },
    { title: "Acortador de URLS", desc: "Acortador potenciado por Google y GitHub.", link: "./Models/Acortador de URLS.html" },
    { title: "Eliminador de Archivos Temporales", desc: "Limpia tu PC de archivos temporales innecesarios.", link: "./Models/downloader.html?=Eliminador_de_Archivos_Temporales.zip" },
    { title: "Programar Apagado Automatico", desc: "Programa el apagado de tu PC con opciones personalizadas.", link: "./Models/downloader.html?=Programar_apagado_automatico.zip" },
];

function buildMarketplaceGrid() {
    const grid = document.getElementById('modelsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    modelsCatalog.forEach(model => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'model-card';
        cardDiv.setAttribute('data-link', model.link);
        cardDiv.innerHTML = `<div><h3>${escapeHtml(model.title)}</h3><p>${escapeHtml(model.desc)}</p></div>`;
        cardDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(model.link, '_blank');
        });
        grid.appendChild(cardDiv);
    });
    triggerReveal();
}



const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
        const answerDiv = q.nextElementSibling;
        const arrowSpan = q.querySelector('span');
        if (answerDiv.classList.contains('show')) {
            answerDiv.classList.remove('show');
            if (arrowSpan) arrowSpan.innerHTML = '▼';
        } else {
            answerDiv.classList.add('show');
            if (arrowSpan) arrowSpan.innerHTML = '▲';
        }
    });
});

const tabs = document.querySelectorAll('.tab-content');
const navBtns = document.querySelectorAll('.nav-btn');

function switchTab(tabId) {
    tabs.forEach(tab => {
        tab.classList.remove('active-tab');
        if (tab.id === tabId) {
            tab.classList.add('active-tab');
        }
    });
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
    if (tabId === 'models') {
        setTimeout(() => {
            buildMarketplaceGrid();
        }, 30);
    }
    triggerReveal();
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
    });
});
document.getElementById('goToFaqBtn')?.addEventListener('click', () => switchTab('p-frecuentes'));
document.getElementById('goToModelsBtn')?.addEventListener('click', () => switchTab('models'));
document.getElementById('goToPoliciesBtn')?.addEventListener('click', () => {
    window.open('./LoDePedro_SA_Documento_Legal.pdf', '_blank');
});

switchTab('inicio');
buildMarketplaceGrid();

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500);
    }
    triggerReveal();
});

function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight - 80) {
            el.classList.add('visible');
        } else {
            if (!el.classList.contains('visible') && rect.top < windowHeight - 50) el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', triggerReveal);
setTimeout(triggerReveal, 200);

const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const type = item.getAttribute('data-contact');
        if (type === 'wa') {
            window.open('https://wa.me/+542215989210', '_blank');
        } else if (type === 'mail') {
            window.open('mailto:pedrogabrielojeda664@gmail.com', '_blank');
        } else if (type === 'ig') {
            window.open('https://www.instagram.com/ldp_studios664/', '_blank');
        }
    });
});

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

console.log("Web LDP cargada con todas las funcionalidades");
