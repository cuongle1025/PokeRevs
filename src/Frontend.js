/* eslint-disable */

export const getPokemon = (id) =>
  fetch('https://pokeapi.co/api/v2/pokemon/' + id).then((response) => response.json());

export const getFlavorText = (id) =>
  fetch('https://pokeapi.co/api/v2/pokemon-species/' + id).then((response) => response.json());
