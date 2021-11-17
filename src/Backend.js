export const getProfile = () => {};

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

export const getReview = () => {};

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

export const getTopReviews = () => {
  return fetch('/getTopReviews', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('get top reviews: ');
      console.log(data);
      return data;
    });
};

export const newReview = () => {};

export const editReview = () => {};

export const deleteReview = () => {};
