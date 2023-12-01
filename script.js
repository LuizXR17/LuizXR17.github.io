const pokedex = document.getElementById('pokedex');
let pokemon = []; // Definir pokemon como una variable global

const fetchPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=251`;
    const res = await fetch(url);
    const data = await res.json();
    pokemon = data.results.map((result, index) => ({
        ...result,
        id: index + 1,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        isShiny: false
    }));
    displayPokemon(pokemon);
}

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map((pokeman) => `
<div class="pokemon" onclick="displayShinyPokemon(${pokeman.id})">
<img src="${pokeman.image}" id="pokemon-${pokeman.id}"/>
<h2>${pokeman.name}</h2>
<p>#${pokeman.id}</p>
</div>
`)
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
}

const displayShinyPokemon = async (pokemonId) => {
    const pokeman = pokemon.find(p => p.id === pokemonId);
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(url);
    const data = await res.json();
    const shinyImage = data.sprites.front_shiny;
    const normalImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    if (pokeman.isShiny) {
        document.getElementById(`pokemon-${pokemonId}`).src = normalImage;
        pokeman.isShiny = false;
    } else {
        document.getElementById(`pokemon-${pokemonId}`).src = shinyImage;
        pokeman.isShiny = true;
    }
}

fetchPokemon();