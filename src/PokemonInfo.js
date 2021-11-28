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
  data.forEach((stat) => {
    PokemonStats = [
      ...PokemonStats,
      { name: stat.stat.name, value: stat.base_stat, valueovermax: (stat.base_stat / 120) * 100 },
    ];
  });
  return PokemonStats;
};
