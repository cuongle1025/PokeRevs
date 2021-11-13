export const getPokemon = (id) => fetch('https://pokeapi.co/api/v2/pokemon/' + id)
    .then((response) => response.json())

export const getPokemonList = (Offset) => fetch('https://pokeapi.co/api/v2/pokemon/?offset=' + Offset + '&limit=20')
    .then((response) => response.json())