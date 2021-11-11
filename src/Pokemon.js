import React, { useState } from 'react';
import './App.css';
import * as MUI from '@mui/material';
import { useParams } from 'react-router-dom';

function Pokemon() {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  return (
    <div>
      <h1>Pokemon Name</h1>
      {id}
      <h2>Pokemon doesn't have any reviews yet</h2>
      <details>
        <summary>
          <h2>Leave a Review</h2>
        </summary>
        <form>

          <label for="rating">Rating:</label>
          <div>
            <MUI.Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
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
      </details>
    </div>
  );
}

export default Pokemon;
