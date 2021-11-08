import React, { useState, useRef } from 'react';
import './App.css';

function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});

  function ClickToSearch() {

    fetch("https://pokeapi.co/api/v2/pokemon/" + NameRef.current.value)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPokemon({ name: data["name"], pic: data["sprites"]["other"]["dream_world"]["front_default"] });
      });

    NameRef.current.value = null;
    alert("haha");
  }

  function Result() {
    return (<div>
      <h>{Pokemon["name"]}</h>
      <a>
        <img src={Pokemon["pic"]} width={100} height={100} />
      </a>
    </div>
    )
  }

  return (
    <div>
      <h3>Search Page</h3>

      <input id="search" type="text" ref={NameRef} placeholder="Enter Pokemon" />
      <button id="click" type="button" onClick={ClickToSearch}>Button</button>
      <Result />
    </div>
  );
}

export default Search;
