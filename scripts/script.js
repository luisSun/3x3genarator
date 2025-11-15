// grid.js - Gerenciamento da grade

let currentGridSize = 3;
let selectedCellIndex = null;

/**
 * Cria ou recria a grid com herança das imagens.
 */
function buildGrid(size) {
    const grid = document.getElementById("grid");
    const oldCells = Array.from(grid.children);

    const savedImages = oldCells.map(cell => {
        const img = cell.querySelector("img");
        return img ? img.src : null;
    });

    grid.innerHTML = "";
    grid.dataset.size = size;
    currentGridSize = size;

    const total = size * size;

    for (let i = 0; i < total; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;

        if (savedImages[i]) {
            const img = document.createElement("img");
            img.src = savedImages[i];
            img.className = "cellImg";
            cell.appendChild(img);
        } else {
            const add = document.createElement("div");
            add.className = "addBtn";
            add.textContent = "+";
            cell.appendChild(add);
        }

        // Clique abre modal no script.js
        cell.onclick = () => openSearch(i);

        grid.appendChild(cell);
    }
}

// ================================
//  FUNÇÃO OTIMIZADA PARA PREENCHER CÉLULA
//  Mantém object-fit: cover e garante html2canvas correto
// ================================
async function fillCellWithImage(url, cellIndex = activeCellIndex) {
    if (cellIndex === null) return;

    const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
    if (!cell) return;

    cell.innerHTML = ""; // limpa a célula

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
        const size = cell.offsetWidth; // pega tamanho real da célula
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // lógica object-fit: cover
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (size - w) / 2;
        const y = (size - h) / 2;

        ctx.drawImage(img, x, y, w, h);

        // adiciona imagem final na célula
        const finalImg = document.createElement("img");
        finalImg.src = canvas.toDataURL();
        finalImg.className = "cellImg";
        cell.appendChild(finalImg);
    };
}

// ================================
//  FUNÇÃO OTIMIZADA PARA BUILD DA GRID
//  Mantém imagens já carregadas usando a nova função
// ================================
function buildGrid(size) {
    const grid = document.getElementById("grid");
    const oldCells = Array.from(grid.children);

    // salva URLs das imagens atuais
    const savedImages = oldCells.map(cell => {
        const img = cell.querySelector("img");
        return img ? img.src : null;
    });

    grid.innerHTML = "";
    grid.dataset.size = size;
    currentGridSize = size;

    const total = size * size;

    for (let i = 0; i < total; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;

        if (savedImages[i]) {
            fillCellWithImage(savedImages[i], i);
        } else {
            const add = document.createElement("div");
            add.className = "addBtn";
            add.textContent = "+";
            cell.appendChild(add);
        }

        cell.onclick = () => openSearch(i);
        grid.appendChild(cell);
    }
}

// Exporta para uso global
window.fillCellWithImage = fillCellWithImage;
window.buildGrid = buildGrid;
