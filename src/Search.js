import React, { useState, useRef } from 'react';
import './Search.css';
import { Link } from 'react-router-dom';

function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [PokemonList, setPokemonList] = useState([]);
  const [PokemonId, setPokemonId] = useState();
  const [Offset, setOffset] = useState(0);

  function ClickToSearch(id) {
    if (id === '') {
      return alert("Type something!");
    }
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((data) => {
        setPokemon({ name: data["name"], pic: data["sprites"]["other"]["dream_world"]["front_default"] });
        setPokemonId(data["id"]);
      });

    NameRef.current.value = null;
  }

  function ClickToLoad() {
    setPokemonList([]);
    fetch("https://pokeapi.co/api/v2/pokemon/?offset=" + Offset + "&limit=20")
      .then((response) => response.json())
      .then((data) => {
        data["results"].forEach((pokemon) => {
          console.log(data);
          fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon["name"])
            .then((response) => response.json())
            .then((data) => {
              setPokemonList((prevPokemonList) => [
                ...prevPokemonList, { name: data["name"] + "(" + data["id"] + ")", pic: data["sprites"]["front_default"] }]);
            });
        });
      });
  }

  function Result() {
    return (
      <>
        <div className="frame">
          <Link to={`/pokemon/${PokemonId}`} className="link">
            <div className="result">
              <p>{Pokemon["name"]}</p>
              <img src={Pokemon["pic"]} width={100} height={100} />
            </div>
          </Link>
        </div>

        <div>
          Reviews : 0
          Attributes : ...
        </div>
      </>

    )
  }

  function ListResult() {
    const pokemonlist = PokemonList.map((pokemonname) => (
      <li style={{ color: 'red' }}>
        {pokemonname.name}
        <img src={pokemonname.pic} width={50} height={50} />
      </li>
    ));
    return (
      <>{pokemonlist}</>
    )
  }

  return (
    <div>
      <h3>Search Page</h3>
      <form>
        <input id="searchinput" type="text" ref={NameRef} placeholder="Enter Pokemon" />
        <button id="search" type="button" onClick={() => ClickToSearch(NameRef.current.value)}>Search</button>
        <button id="load" type="button" onClick={() => ClickToLoad(setOffset(Offset + 20))}>Load</button>
      </form>
      {
        Object.keys(Pokemon).length !== 0 ? (

          <div>
            <Result />
            <ul className="listresult">
              <ListResult />
            </ul>
          </div>

        ) : (
          <ul className="listresult">
            <ListResult />
          </ul>
        )
      }
    </div >
  );
}

export default Search;