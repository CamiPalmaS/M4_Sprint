const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

// Mapa de colores para los tipos de Pokémon
const typeColors = {
    steel: '#D0D0D0',
    water: '#00BFFF',
    bug: '#9ACD32',
    dragon: '#8A2BE2',
    electric: '#FFFF00',
    ghost: '#6A5ACD',
    fire: '#FF4500',
    fairy: '#FF69B4',
    ice: '#00CED1',
    fighting: '#DC143C',
    normal: '#A9A9A9',
    grass: '#008000',
    psychic: '#FF1493',
    rock: '#B8860B',
    dark: '#2F4F4F',
    ground: '#DEB887',
    poison: '#800080',
    flying: '#87CEEB'
};

// Tabla de eficacia de tipos
const typeChart = {
    fire: { fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 2, bug: 2, fairy: 1, steel: 2, dragon: 0.5, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 0.5, dark: 1, ground: 1, poison: 1, flying: 1 },
    water: { fire: 2, water: 0.5, grass: 0.5, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 1, dragon: 0.5, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 2, dark: 1, ground: 2, poison: 1, flying: 1 },
    grass: { fire: 0.5, water: 2, grass: 0.5, electric: 1, ice: 1, bug: 0.5, fairy: 1, steel: 0.5, dragon: 0.5, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 2, dark: 1, ground: 2, poison: 0.5, flying: 0.5 },
    electric: { fire: 1, water: 2, grass: 0.5, electric: 0.5, ice: 1, bug: 1, fairy: 1, steel: 1, dragon: 0.5, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 1, dark: 1, ground: 0, poison: 1, flying: 2 },
    ice: { fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 0.5, bug: 1, fairy: 1, steel: 0.5, dragon: 2, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 1, dark: 1, ground: 2, poison: 1, flying: 2 },
    bug: { fire: 0.5, water: 1, grass: 2, electric: 1, ice: 1, bug: 1, fairy: 0.5, steel: 0.5, dragon: 1, ghost: 0.5, fighting: 0.5, normal: 1, psychic: 2, rock: 1, dark: 2, ground: 1, poison: 0.5, flying: 0.5 },
    fairy: { fire: 0.5, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 0.5, dragon: 2, ghost: 1, fighting: 2, normal: 1, psychic: 1, rock: 1, dark: 2, ground: 1, poison: 0.5, flying: 1 },
    steel: { fire: 0.5, water: 0.5, grass: 1, electric: 0.5, ice: 2, bug: 1, fairy: 2, steel: 0.5, dragon: 1, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 2, dark: 1, ground: 1, poison: 1, flying: 1 },
    dragon: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 0, steel: 0.5, dragon: 2, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 1, dark: 1, ground: 1, poison: 1, flying: 1 },
    ghost: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 1, dragon: 1, ghost: 2, fighting: 1, normal: 0, psychic: 2, rock: 1, dark: 0.5, ground: 1, poison: 1, flying: 1 },
    fighting: { fire: 1, water: 1, grass: 1, electric: 1, ice: 2, bug: 0.5, fairy: 0.5, steel: 2, dragon: 1, ghost: 0, fighting: 1, normal: 2, psychic: 0.5, rock: 2, dark: 2, ground: 1, poison: 0.5, flying: 0.5 },
    normal: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 0.5, dragon: 1, ghost: 0, fighting: 1, normal: 1, psychic: 1, rock: 0.5, dark: 1, ground: 1, poison: 1, flying: 1 },
    ground: { fire: 2, water: 1, grass: 0.5, electric: 2, ice: 1, bug: 0.5, fairy: 1, steel: 2, dragon: 1, ghost: 1, fighting: 1, normal: 1, psychic: 1, rock: 2, dark: 1, poison: 2, flying: 0 },
    poison: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 0, dragon: 1, ghost: 0.5, fighting: 1, normal: 1, psychic: 1, rock: 0.5, dark: 1, ground: 0.5, poison: 0.5, flying: 1 },
    flying: { fire: 1, water: 1, grass: 2, electric: 0.5, ice: 1, bug: 2, fairy: 1, steel: 0.5, dragon: 1, ghost: 1, fighting: 2, normal: 1, psychic: 1, rock: 0.5, dark: 1, ground: 1, poison: 1, flying: 1 },
    dark: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 0.5, steel: 1, dragon: 1, ghost: 2, fighting: 0.5, normal: 1, psychic: 2, rock: 1, dark: 0.5, ground: 1, poison: 1, flying: 1 },
    rock: { fire: 2, water: 1, grass: 1, electric: 1, ice: 2, bug: 2, fairy: 1, steel: 0.5, dragon: 1, ghost: 1, fighting: 0.5, normal: 1, psychic: 1, rock: 1, dark: 1, ground: 0.5, poison: 1, flying: 2 },
    psychic: { fire: 1, water: 1, grass: 1, electric: 1, ice: 1, bug: 1, fairy: 1, steel: 0.5, dragon: 1, ghost: 1, fighting: 2, normal: 1, psychic: 0.5, rock: 1, dark: 0, ground: 1, poison: 2, flying: 1 }
};

let pokemonData = {};


// Función para buscar Pokémon por ID
function fetchPokemonById(pokemonNumber) {
    const pokemonId = document.getElementById(`pokemonId${pokemonNumber}`).value;
    if (!pokemonId) {
        alert('Por favor, ingresa un ID válido.');
        return;
    }

    fetch(`${apiUrl}/${pokemonId}`)
        .then(response => response.json())
        .then(pokemon => {
            pokemonData[pokemonNumber] = pokemon;
            displayPokemonCard(pokemon, pokemonNumber);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById(`pokemonCard${pokemonNumber}`).innerHTML = '<p class="text-danger">Pokémon no encontrado. Por favor, revisa el ID ingresado.</p>';
        });
}

// Función para mostrar la tarjeta del Pokémon
function displayPokemonCard(pokemon, pokemonNumber) {
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    const primaryType = types[0];
    const typeColor = typeColors[primaryType] || '#ffffff'; // Color por defecto si no se encuentra el tipo

    document.getElementById(`pokemonCard${pokemonNumber}`).innerHTML = `
        <div class="card" style="background-color: ${typeColor};">
            <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
            <div class="card-body">
                <h5 class="card-title">${pokemonName}</h5>
                <p class="card-text">Numero de pokedex: ${pokemon.id}</p>
                <p class="card-text"><strong>Tipo(s):</strong> ${types.join(', ')}</p>
            </div>
        </div>
    `;
}

// Función para comparar dos Pokémon basándose en el tipo
function comparePokemons() {
    if (!pokemonData[1] || !pokemonData[2]) {
        alert('Por favor, selecciona dos Pokémon antes de competir.');
        return;
    }

    const pokemon1 = pokemonData[1];
    const pokemon2 = pokemonData[2];

    const types1 = pokemon1.types.map(typeInfo => typeInfo.type.name);
    const types2 = pokemon2.types.map(typeInfo => typeInfo.type.name);

    const effectiveness1 = calculateEffectiveness(types1, types2);
    const effectiveness2 = calculateEffectiveness(types2, types1);

    let resultMessage;
    if (effectiveness1 > effectiveness2) {
        resultMessage = `${pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)} es el ganador. `;
    } else if (effectiveness1 < effectiveness2) {
        resultMessage = `${pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)} es el ganador. `;
    } else {
        resultMessage = `Es un empate entre ${pokemon1.name.charAt(0).toUpperCase() + pokemon1.name.slice(1)} y ${pokemon2.name.charAt(0).toUpperCase() + pokemon2.name.slice(1)}`;
    }

    document.getElementById('competitionResult').innerHTML = `<div class="alert alert-info">${resultMessage}</div>`;
}

// Calcula la eficacia de un conjunto de tipos frente a otro
function calculateEffectiveness(attackingTypes, defendingTypes) {
    return attackingTypes.reduce((effectiveness, type) => {
        const typeEffectiveness = typeChart[type] || {};
        return effectiveness * defendingTypes.reduce((total, defendingType) => total * (typeEffectiveness[defendingType] || 1), 1);
    }, 1);
}
