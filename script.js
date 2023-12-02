const pokedex = document.getElementById('pokedex');
let pokemon = []; // Definir pokemon como una variable global

const searchContainer = document.querySelector('.mainbox');
const searchInput = document.querySelector('.search_input');
const checkbox = document.querySelector('.checkbox');

searchContainer.addEventListener('focusin', function() {
    this.classList.add('animate__animated', 'animate__pulse');
});
document.addEventListener('click', function(event) {
    const isClickInside = searchContainer.contains(event.target);
    if (!isClickInside) {
        // El clic fue fuera del contenedor de búsqueda, contraer la barra de búsqueda
        searchContainer.classList.remove('animate__animated', 'animate__pulse');
    }
});


searchInput.addEventListener('input', function() {
    this.classList.remove('animate__animated', 'animate__pulse');
    const searchValue = this.value.toLowerCase();
    const filteredPokemon = pokemon.filter(p => p.types.includes(searchValue));
    displayPokemon(filteredPokemon);
});

const fetchPokemonDetails = async (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(url);
    const data = await res.json();
    const types = data.types.map(type => translate(type.type.name, typeTranslations));
    const abilities = data.abilities.map(ability => translate(ability.ability.name, abilityTranslations));
    return { types, abilities };
}

const fetchPokemon = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=251`;
    const res = await fetch(url);
    const data = await res.json();
    pokemon = await Promise.all(data.results.map(async (result, index) => {
        const id = index + 1;
        const details = await fetchPokemonDetails(id);
        return {
            ...result,
            id,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            isShiny: false,
            ...details
        };
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
<p>Tipos: ${pokeman.types.join(', ')}</p>
<p>Habilidades: ${pokeman.abilities.join(', ')}</p>
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

const typeTranslations = {
    normal: 'normal',
    fire: 'fuego',
    water: 'agua',
    electric: 'eléctrico',
    grass: 'planta',
    ice: 'hielo',
    fighting: 'lucha',
    poison: 'veneno',
    ground: 'tierra',
    flying: 'volador',
    psychic: 'psíquico',
    bug: 'bicho',
    rock: 'roca',
    ghost: 'fantasma',
    dragon: 'dragón',
    dark: 'siniestro',
    steel: 'acero',
    fairy: 'hada',
};

const abilityTranslations = {
    overgrow: 'crecimiento',
    blaze: 'mar llamas',
    torrent: 'torrente',
    chlorophyll: 'clorofila',
    "swift-swim": 'nado rápido',
    "rain-dish": 'plato lluvia',
    "arena-trap": 'trampa arena',
    intimidate: 'intimidación',
    "shed-skin": 'muda piel',
    "shield-dust": 'polvo de escudo',
    "run-away": 'huida',
    "compound-eyes": 'ojo compuesto',
    "solar-power": 'energía solar',
    swarm: 'enjambre',
    "shed-skin": 'piel de serpiente',
    "tinted-lens": 'lentes tintadas',
    "keen-eye": 'ojo avizor',
    "tangled-feet": 'pies enredados',
    "frisk": 'cacheo',
    "reckless": 'audaz',
    "multitype": 'multitipo',
    "scrappy": 'audaz',
    "storm-drain": 'colector',
    "snow-cloak": 'manto frío',
    "honey-gather": 'recogemiel',
    "flower-gift": 'don floral',
    "bad-dreams": 'mal sueño',
    "big-pecks": 'grandes picos',
};

const translate = (word, translations) => {
    return translations[word] || word;
};

searchInput.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    if (searchValue === '') {
        displayPokemon(pokemon);
    } else {
        const filteredPokemon = pokemon.filter(p => p.types.includes(searchValue));
        displayPokemon(filteredPokemon);
    }
});