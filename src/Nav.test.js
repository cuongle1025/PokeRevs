/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import NavBar from './Nav';

it('checkSignedInAsNavBar', () => {
  const username = 'BobRoss';
  const prop = { username: username };
  const { queryByTitle } = render(<NavBar userdata={prop} />);
  const text = queryByTitle('SignedInAs');
  expect(text).toHaveTextContent('Signed in as: ' + username);
});
