/* eslint-disable */
export const getProfile = (user_id) => {
  const info = { user_id: user_id };
  return fetch('/getProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(info),
  })
    .then((response) => response.json())
    .then((data) => data);
};

export const updateProfile = (user_id, name, img, bio) => {
  const info = { user_id: user_id, name: name, img: img, bio: bio };
  fetch('/updateProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(info),
  })
    .then((response) => response.json())
    // Ignore eslint for this line because we will likely use this data for something (response) in the future
    // eslint-disable-next-line no-unused-vars
    .then((data) => {});
};

export const getPokemonReviews = (id) => {
  return fetch('/getPokemonReviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pokemonid: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
};

export const getUserReview = (user_id, id) => {
  return fetch('/getUserReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: user_id, pokemonid: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getReviews = (user_id) => {
  const data = { user_id: user_id };
  return fetch('/getReviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getTopReviews = () => {
  return fetch('/getTopReviews', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const newReview = () => {};

export const addReview = (user_id, id, rating, title, body) =>
  fetch('/addReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: user_id,
      pokemonid: id,
      rating: rating,
      title: title,
      body: body,
    }),
  }).then((response) => response.json());

export const editReview = (user_id, id, rating, title, body) =>
  fetch('/editReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: user_id,
      pokemonid: id,
      rating: rating,
      title: title,
      body: body,
    }),
  }).then((response) => response.json());

export const deleteReview = (user_id, id) =>
  fetch('/deleteReview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: user_id, pokemonid: id }),
  }).then((response) => response.json());
