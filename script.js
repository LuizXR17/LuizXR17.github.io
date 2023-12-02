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

const fetchPokemonSpeciesDetails = async (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const res = await fetch(url);
    const data = await res.json();
    const description = data.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text;
    return description;
}

const fetchPokemonDetails = async (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const res = await fetch(url);
    const data = await res.json();
    const types = data.types.map(type => translate(type.type.name, typeTranslations));
    const abilities = data.abilities.map(ability => translate(ability.ability.name, abilityTranslations));
    const height = data.height * 10; // Convert decimeters to centimeters
    const weight = data.weight / 10; // Convert hectograms to kilograms
    const attack = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
    const defense = data.stats.find(stat => stat.stat.name === 'defense').base_stat;
    const speed = data.stats.find(stat => stat.stat.name === 'speed').base_stat;
    const description = await fetchPokemonSpeciesDetails(pokemonId);
    return { types, abilities, height, weight, attack, defense, speed, description };
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
        <p>Altura: ${pokeman.height} cm</p>
        <p>Peso: ${pokeman.weight} kg</p>
        <p>Ataque: ${pokeman.attack}</p>
        <p>Defensa: ${pokeman.defense}</p>
        <p>Velocidad: ${pokeman.speed}</p>
        <p>Descripción: ${pokeman.description}</p>
        <button onclick="addToCompare(${pokeman.id}); event.stopPropagation();">Añadir a la comparación</button>        </div>
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

let pokemonToCompare = [];

const addToCompare = (pokemonId) => {
    const pokeman = pokemon.find(p => p.id === pokemonId);
    pokemonToCompare.push(pokeman);

    Swal.fire({
        icon: "success",
    title: "El pokemon se añadio con éxito",
    showConfirmButton: false,
    timer: 1500
});
}

const comparePokemon = () => {
    if (pokemonToCompare.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "¡Algo salió mal!",
            footer: 'No has añadido ningún pokemon para comparar'
        });
    } else {
        const comparisonHTMLString = pokemonToCompare
        .map((pokeman) => `
        <div class="pokemon">
        <img src="${pokeman.image}"/>
        <h2>${pokeman.name}</h2>
        <p>#${pokeman.id}</p>
        <p>Tipos: ${pokeman.types.join(', ')}</p>
        <p>Habilidades: ${pokeman.abilities.join(', ')}</p>
        <p>Altura: ${pokeman.height} cm</p>
        <p>Peso: ${pokeman.weight} kg</p>
        <p>Ataque: ${pokeman.attack}</p>
        <p>Defensa: ${pokeman.defense}</p>
        <p>Velocidad: ${pokeman.speed}</p>
        <p>Descripción: ${pokeman.description}</p>
        </div>
        `)
        .join('');
    pokedex.innerHTML = comparisonHTMLString;
 }
}

// Crea un contenedor para el botón
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('button-container');

// Añade un botón a la interfaz de usuario para comparar Pokémon
const compareButton = document.createElement('button');
compareButton.textContent = 'Comparar Pokémon';
compareButton.classList.add('btn'); // Añade la clase 'btn' al botón
compareButton.addEventListener('click', comparePokemon);

// Añade el botón al contenedor
buttonContainer.appendChild(compareButton);

// Añade el contenedor de botones al body
document.body.appendChild(buttonContainer);