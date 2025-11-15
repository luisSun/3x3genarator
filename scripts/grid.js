// script.js
// Controlador geral: modal, busca, integração com api.js e grid.js, salvar PNG, reset, tema

// Elementos principais
const modalSearch = document.getElementById("searchModal");
const closeModalBtn = document.getElementById("closeSearchModal");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let activeCellIndex = null;

// ================================
//  ABRIR MODAL PARA UMA CÉLULA
// ================================
function openSearch(cellIndex) {
    activeCellIndex = cellIndex; // salva célula ativa
    modalSearch.classList.remove("hidden");

    searchInput.value = "";
    searchResults.innerHTML = "";

    searchInput.focus();
}

window.openSearch = openSearch;

// ================================
//  FECHAR MODAL
// ================================
closeModalBtn.onclick = () => modalSearch.classList.add("hidden");

window.onclick = e => {
    if (e.target === modalSearch) {
        modalSearch.classList.add("hidden");
    }
};

// ================================
//  BUSCA DINÂMICA
// ================================
let searchTimeout = null;

searchInput.oninput = () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        const q = searchInput.value.trim();

        if (q.length < 2) {
            searchResults.innerHTML = "";
            return;
        }

        const items = await searchCharacters(q);

        searchResults.innerHTML = "";

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "resultItem";

            div.innerHTML = `
                <img src="${item.image}" />
                <span>${item.name}</span>
            `;

            div.onclick = () => {
                // 1. Preenche célula
                fillCellWithImage(item.image);

                // 2. Fecha o modal CORRETO
                document.getElementById("searchModal").classList.add("hidden");

                // 3. Limpa busca e lista
                searchInput.value = "";
                searchResults.innerHTML = "";
            };

            searchResults.appendChild(div);
        });
    }, 400); // aguarda 400ms antes de consultar
};

// ================================
//  RESET GRID
// ================================
function resetGrid() {
    buildGrid(currentGridSize);
}
window.resetGrid = resetGrid;

// ================================
//  TEMA
// ================================
function toggleTheme(mode) {
    document.body.className = mode;
}
window.toggleTheme = toggleTheme;

// ================================
//  SALVAR PNG
// ================================
function savePNG() {
    const node = document.getElementById("grid");

    html2canvas(node, { useCORS: true }).then(canvas => {
        const link = document.createElement("a");
        link.download = "template.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}
window.savePNG = savePNG;

// ================================
//  ALTERAR TAMANHO DA GRID
// ================================
function changeGridSize(size) {
    buildGrid(size);
}
window.changeGridSize = changeGridSize;

// ================================
//  INICIALIZAÇÃO
// ================================
window.addEventListener("DOMContentLoaded", () => {

    buildGrid(3); // monta a grid inicial

    // Botões de tamanho
    document.getElementById("btn3").onclick = () => changeGridSize(3);
    document.getElementById("btn4").onclick = () => changeGridSize(4);
    document.getElementById("btn5").onclick = () => changeGridSize(5);

    // Funções adicionais
    document.getElementById("resetBtn").onclick = resetGrid;
    document.getElementById("saveBtn").onclick = savePNG;
    document.getElementById("lightBtn").onclick = () => toggleTheme("light");
    document.getElementById("darkBtn").onclick = () => toggleTheme("dark");
});
