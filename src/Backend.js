export const getProfile = () => {};

export const updateProfile = () => {};

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
      console.log(data);
      return data;
    });
};

export const newReview = () => {};

export const editReview = () => {};

export const deleteReview = () => {};
