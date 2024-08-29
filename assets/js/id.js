const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

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

// Cargar la navbar
document.getElementById('navbarContainer').innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Pokedex</a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Búsqueda Masiva</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link" href="search-by-id.html">Búsqueda por ID <span class="sr-only">(current)</span></a>
                </li>
            </ul>
        </div>
    </nav>
`;

// Función para buscar Pokémon por ID
function fetchPokemonById() {
    const pokemonId = document.getElementById('pokemonId').value;
    if (!pokemonId) {
        alert('Por favor, ingresa un ID válido.');
        return;
    }

    fetch(`${apiUrl}/${pokemonId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(pokemon => {
            displayPokemonCard(pokemon);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('pokemonCard').innerHTML = '<p class="text-danger">Pokémon no encontrado. Por favor, revisa el ID ingresado.</p>';
        });
}

// Función para mostrar la tarjeta del Pokémon
function displayPokemonCard(pokemon) {
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
    const primaryType = types[0];
    const typeColor = typeColors[primaryType] || '#ffffff'; // Color por defecto si no se encuentra el tipo

    document.getElementById('pokemonCard').innerHTML = `
        <div class="card" style="background-color: ${typeColor};">
            <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
            <div class="card-body">
                <h5 class="card-title">${pokemonName}</h5>
                <p class="card-text">Numero de pokedex: ${pokemon.id}</p>
                <p class="card-text"><strong>Tipo(s):</strong> ${types.join(', ')}</p>
                <button class="btn btn-primary" onclick="showPokemonModal(${pokemon.id})">Ver detalles</button>
            </div>
        </div>
    `;
}

// Función para mostrar el modal con detalles del Pokémon
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
