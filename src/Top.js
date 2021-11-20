/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import './App.css';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getTopReviews } from './Backend';

const Top = function () {
  const [reviews, updateReviews] = useState('');
  return (
    <div>
      <h3>Top Pokemon</h3>
      <TopReviews reviews={reviews} update={updateReviews} />
    </div>
  );
};

// async function TopReviews(props) {
//   let promise = getTopReviews();

//   promise.then((data) => {
//     console.log(data);
//     props.update(JSON.stringify(data));
//   });
//   const data = JSON.parse(props.reviews);
//   return (
//     <div>
//       {/* {data['reviews'].map((review) => {
//         return (
//           <div key={review.pokedex_id}>
//             <span>
//               <h3>
//                 <Link to={'/pokemon/' + review.pokedex_id}>{review.title}</Link>
//               </h3>
//               <h5>{review.rating} out of 5</h5>
//             </span>
//             <span>Pokedex_id: {review.pokedex_id}</span>
//             <span> by {review.username}</span>
//             <div>{review.body}</div>
//           </div>
//         );
//       })} */}
//     </div>
//   );
// }

const TopReviews = function (props) {
  const promise = getTopReviews();
  promise.then((data) => props.update(JSON.stringify(data)));
  if (!props.reviews) {
    return <div />;
  }
  const data = JSON.parse(props.reviews);
  return (
    <div>
      {data.reviews.map((review) => (
        <div key={review.pokedex_id}>
          <span>
            <h3>
              <Link to={`/pokemon/${review.pokedex_id}`}>{review.title}</Link>
            </h3>
            <h5>
              {review.rating}
              out of 5
            </h5>
          </span>
          <span>
            Pokedex_id:
            {review.pokedex_id}
          </span>
          <span>
            by
            {review.name}
          </span>
          <div>{review.body}</div>
        </div>
      ))}
    </div>
  );
};

TopReviews.propTypes = {
  reviews: propTypes.string,
  update: propTypes.func,
};

export default Top;
