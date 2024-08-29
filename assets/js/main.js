const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
const limit = 20; // Número de Pokémon por página
let offset = 0; // Offset inicial para la carga de Pokémon
let isLoading = false; // Flag para evitar múltiples solicitudes simultáneas

// Define colores para cada tipo de Pokémon
const typeColors = {
    steel: '#D4D2D0',
    water: '#539DDF',
    bug: '#A8B820',
    dragon: '#6D30B1',
    electric: '#F8D03F',
    ghost: '#6F6F9E',
    fire: '#F85A3F',
    fairy: '#F4A8FF',
    ice: '#6FC8C2',
    fighting: '#C82B54',
    normal: '#B6B7A6',
    grass: '#5CBA60',
    psychic: '#F57E9C',
    rock: '#B8A04B',
    dark: '#6D6D6D',
    ground: '#D6B25D',
    poison: '#A58F9D',
    flying: '#9AB6F2'
};

document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('loadButton');
    const loadMoreButton = document.getElementById('loadMore');
    const clearAllButton = document.getElementById('clearAll');

    if (loadButton) {
        loadButton.addEventListener('click', () => loadInitialPokemons());
    }

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => loadMorePokemons());
    }

    if (clearAllButton) {
        clearAllButton.addEventListener('click', () => clearPokemons());
    }
});

async function loadInitialPokemons() {
    if (isLoading) return; // Prevenir múltiples solicitudes simultáneas
    isLoading = true;

    try {
        const response = await fetch(`${apiUrl}?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error al cargar Pokémon');
        }
        const data = await response.json();
        const pokemonList = data.results;

        // Obtener detalles y ordenar los Pokémon en orden ascendente por ID
        const detailedPokemons = await Promise.all(pokemonList.map(pokemon =>
            fetch(pokemon.url).then(response => response.json())
        ));
        detailedPokemons.sort((a, b) => a.id - b.id); // Ordenar en orden ascendente

        displayPokemons(detailedPokemons);

        // Actualizar el offset para la próxima carga
        offset += limit;

        // Mostrar el botón "Cargar Más" y ocultar el botón "Cargar"
        document.getElementById('loadButton').style.display = 'none';
        document.getElementById('loadMore').style.display = 'block';
    } catch (error) {
        console.error('Error cargando Pokémon:', error);
    } finally {
        isLoading = false;
    }
}

async function loadMorePokemons() {
    if (isLoading) return; // Prevenir múltiples solicitudes simultáneas
    isLoading = true;

    try {
        const response = await fetch(`${apiUrl}?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Error al cargar Pokémon');
        }
        const data = await response.json();
        const pokemonList = data.results;

        // Obtener detalles y ordenar los Pokémon en orden ascendente por ID
        const detailedPokemons = await Promise.all(pokemonList.map(pokemon =>
            fetch(pokemon.url).then(response => response.json())
        ));
        detailedPokemons.sort((a, b) => a.id - b.id); // Ordenar en orden ascendente

        displayPokemons(detailedPokemons);

        // Actualizar el offset para la próxima carga
        offset += limit;
    } catch (error) {
        console.error('Error cargando Pokémon:', error);
    } finally {
        isLoading = false;
    }
}

function displayPokemons(pokemons) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML += pokemons.map(pokemon => {
        // Obtener los tipos elementales
        const types = pokemon.types.map(typeInfo => typeInfo.type.name);
        const primaryType = types[0];
        const typeColor = typeColors[primaryType] || '#ffffff'; // Color por defecto

        return `
            <div class="col-md-4 mb-4">
                <div class="card" style="background-color: ${typeColor};">
                    <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">Numero de pokedex: ${pokemon.id}</p>
                        <p class="card-text"><strong>Tipos:</strong> ${types.join(', ')}</p>
                        <button class="btn btn-primary" onclick="showPokemonModal(${pokemon.id})">Ver detalles</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showPokemonModal(pokemonId) {
    fetch(`${apiUrl}/${pokemonId}`)
        .then(response => response.json())
        .then(pokemon => {
            const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            const pokemonTypes = pokemon.types.map(typeInfo => typeInfo.type.name);
            const pokemonAbilities = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name);

            // Llenar el contenido del modal
            document.getElementById('pokemonModalLabel').textContent = `Detalles de ${pokemonName}`;
            document.getElementById('pokemonDescription').textContent = `
                Tipo(s): ${pokemonTypes.join(', ')}
                Habilidad(es): ${pokemonAbilities.join(', ')}
            `;

            // Configurar el gráfico de torta
            const ctx = document.getElementById('pokemonChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: pokemonAbilities,
                    datasets: [{
                        data: new Array(pokemonAbilities.length).fill(1), // Dummy data, replace with actual stats if needed
                        backgroundColor: pokemonAbilities.map((_, i) => `hsl(${i * 360 / pokemonAbilities.length}, 70%, 70%)`)
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                }
                            }
                        }
                    }
                }
            });

            // Mostrar el modal
            $('#pokemonModal').modal('show');
        })
        .catch(error => console.error('Error cargando detalles del Pokémon:', error));
}

function clearPokemons() {
    // Reiniciar el offset y limpiar la lista de Pokémon
    offset = 0;
    document.getElementById('pokemonContainer').innerHTML = '';
    document.getElementById('loadMore').style.display = 'none'; // Ocultar el botón "Cargar Más"
    document.getElementById('loadButton').style.display = 'block'; // Mostrar el botón "Cargar"
}
