import React from 'react';
import './App.css';

function Pokemon() {
  return (
    <div>
      <h1>Pokemon Name</h1>
      <h2>Pokemon doesn't have any reviews yet</h2>
      <h2>Leave a Review</h2>
      <form>
        <label for="rating">Rating:</label>
        <div>
        <input type="number" name="rating" id="rating" min="0" max="10" step="1"></input>
        </div>
      
        <label for="title">Review Title:</label>
        <div>
          <input type="text" name="title" id="title"></input>
        </div>

        <label for="review">Review:</label>
        <div>
          <textarea name="review" id="review" rows="4" cols="50"></textarea>
        </div>
        <input type="submit" value="Submit Review"></input>
      </form>
    </div>
  );
}

export default Pokemon;
