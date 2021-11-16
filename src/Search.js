import React, { useState, useRef } from 'react';
import { Form, FormControl, Button, Container } from 'react-bootstrap/'
import './Search.css';
import { Link } from 'react-router-dom';
import { getPokemon, getPokemonList } from './Frontend'

function Search() {
  const NameRef = useRef();
  const [Pokemon, setPokemon] = useState({});
  const [PokemonList, setPokemonList] = useState([]);
  const [PokemonId, setPokemonId] = useState();
  const [Offset, setOffset] = useState(0);

  function ClickToSearch(id) {

    getPokemon(id).then((data) => {
      setPokemon({
        name: data['name'],
        pic: data['sprites']['other']['dream_world']['front_default'],
      });
      setPokemonId(data["id"]);
      console.log(data);
    });

    NameRef.current.value = null;
  }

  function ClickToLoad() {
    setPokemonList([]);
    getPokemonList(Offset).then((data) => {
      console.log(data);
      data['results'].forEach((pokemon) => {
        getPokemon(pokemon['name']).then((data) => {
          setPokemonList((prevPokemonList) => [
            ...prevPokemonList,
            {
              name: data['name'] + '(' + data['id'] + ')',
              pic: data['sprites']['front_default'],
            },
          ]);
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
              <p>{Pokemon['name']}</p>
              <img src={Pokemon['pic']} width={100} height={100} />
            </div>
          </Link>
        </div>
        <div className="text-center">
          Reviews : 0
          Attributes : ...
        </div>
      </>
    );
  }

  function ListResult() {
    const pokemonlist = PokemonList.map((pokemonname) => (
      <li style={{ color: 'red' }} key={pokemonname.id}>
        {pokemonname.name}
        <img src={pokemonname.pic} width={50} height={50} />
      </li>
    ));
    return <>{pokemonlist}</>;
  }

  return (
    <Container fluid>
      <h4 className="text-center">Enter Id or Name :</h4>
      <Form className="d-flex search">
        <FormControl
          type="search"
          ref={NameRef}
          placeholder="Enter Pokemon"
          aria-label="Search"
        />
        <Button variant="outline-success" onClick={() => ClickToSearch(NameRef.current.value)}>Search</Button>
        <Button variant="outline-success" onClick={() => ClickToLoad(setOffset(Offset + 20))}>Load</Button>
      </Form>
      {Object.keys(Pokemon).length !== 0 ? (
        <div>
          <Result />
          <ul className="listresult text-center">
            <ListResult />
          </ul>
        </div>
      ) : (
        <ul className="listresult text-center">
          <ListResult />
        </ul>
      )}
    </Container>
  );
}

export default Search;