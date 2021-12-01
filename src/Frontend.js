/* eslint-disable */

export const getPokemon = (id) => {
  return fetch('https://pokeapi.co/api/v2/pokemon/' + id)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getPokemonList = (offset) => {
  return fetch('https://pokeapi.co/api/v2/pokemon/?limit=15&offset=' + offset)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getPokemonFlavorText = (id) =>
  fetch('https://pokeapi.co/api/v2/pokemon-species/' + id).then((response) => response.json());

export const getAbilityFlavorText = (name) =>
  fetch('https://pokeapi.co/api/v2/ability/' + name).then((response) => response.json());
