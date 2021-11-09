import React, { useState, useRef } from 'react';
import './Search.css';

function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [PokemonList, setPokemonList] = useState([])
  function ClickToSearch() {
    if (NameRef.current.value === '') {
      return alert("Type something!");
    }
    fetch("https://pokeapi.co/api/v2/pokemon/" + NameRef.current.value)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPokemon({ name: data["name"], pic: data["sprites"]["other"]["dream_world"]["front_default"] });
      });

    NameRef.current.value = null;
  }

  function ClickToLoad() {
    fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data["results"].forEach((pokemon) => {

          setPokemonList((prevPokemonList) => [
            ...prevPokemonList, pokemon["name"]]);
        });
      });
  }

  function Result() {
    return (
      <>
        <div className="frame">
          <a href="/top" className="link">
            <div className="result">
              <p>{Pokemon["name"]}</p>
              <img src={Pokemon["pic"]} width={100} height={100} />
            </div>
          </a>
        </div>

        <div>
          Review : 0
          Attributes : ...
        </div>
      </>

    )
  }

  function ListResult() {
    const pokemonlist = PokemonList.map((pokemonname) => (
      <li style={{ color: 'red' }}>
        {pokemonname}
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
        <button id="search" type="button" onClick={ClickToSearch}>Search</button>
        <button id="load" type="button" onClick={ClickToLoad}>Load</button>
      </form>
      {Object.keys(Pokemon).length !== 0 ? (

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
      )}
    </div>
  );
}

export default Search;
