// api.js - Consulta à API Jikan (Pesquisa Instantânea)

async function searchCharacters(query) {
    if (!query || query.length < 2) return [];

    const url = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data) return [];

        return data.data.map(char => {
            const image =
                char.images?.webp?.image_url ||     // 🔥 sempre vem
                char.images?.jpg?.image_url || ""; // fallback

            return {
                id: char.mal_id,
                name: char.name,
                image: image,
                kanji: char.name_kanji || ""
            };
        });

    } catch (err) {
        console.error("Erro ao consultar Jikan:", err);
        return [];
    }
}

window.searchCharacters = searchCharacters;
