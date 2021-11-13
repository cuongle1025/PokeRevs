
export const getProfile = () => { };

export const updateProfile = (username, img, bio) => {
  const data = { username: username, img: img, bio: bio };
  fetch('/updateProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('update profile: ');
      console.log(data);
    });
};

export const getPokemonReviews = (id) =>
  fetch('/getPokemonReviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pokemonid: id }),
  })
    .then((response) => response.json())

export const getUserReview = (username, id) =>
  fetch('/getUserReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username, pokemonid: id }),
  })
    .then((response) => response.json())

export const getReviews = (username) => {
  const data = { username: username };
  return fetch('/getReviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('get user reviews: ');
      console.log(data);
      return data;
    });
};

export const addReview = (username, id, rating, title, body) =>
  fetch('/addReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username, pokemonid: id, rating: rating, title: title, body: body }),
  })
    .then((response) => response.json())

export const editReview = () => { };

export const deleteReview = () => { };
