/* eslint-disable prefer-const */
export const getPokemonTypes = (data) => {
  let PokemonTypes = [];
  for (let i = 0; i < data.length; i += 1) {
    PokemonTypes.push(data[i].type.name);
  }
  return PokemonTypes;
};

export const getPokemonAbilities = (data) => {
  let PokemonAbilities = [];
  for (let i = 0; i < data.length; i += 1) {
    PokemonAbilities.push(data[i].ability.name);
  }
  return PokemonAbilities;
};

export const getPokemonStats = (data) => {
  let PokemonStats = [];
  PokemonStats.push(`Hp: ${data[0].base_stat.toString()}`);
  PokemonStats.push(`Attack: ${data[1].base_stat.toString()}`);
  PokemonStats.push(`Defense: ${data[2].base_stat.toString()}`);
  PokemonStats.push(`Special Attack: ${data[3].base_stat.toString()}`);
  PokemonStats.push(`Special Defense: ${data[4].base_stat.toString()}`);
  PokemonStats.push(`Speed: ${data[5].base_stat.toString()}`);
  return PokemonStats;
};

export const getPokemonMoves = (data) => {
  let PokemonMoves = [];
  for (let i = 0; i < data.length; i += 1) {
    PokemonMoves.push(data[i].move.name);
  }
  return PokemonMoves;
};
