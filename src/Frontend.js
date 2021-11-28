/* eslint-disable */

export const getPokemon = (id) =>
  fetch('https://pokeapi.co/api/v2/pokemon/' + id).then((response) => response.json());

export const getPokemonFlavorText = (id) =>
  fetch('https://pokeapi.co/api/v2/pokemon-species/' + id).then((response) => response.json());

export const getAbilityFlavorText = (name) =>
  fetch('https://pokeapi.co/api/v2/ability/' + name).then((response) => response.json());
