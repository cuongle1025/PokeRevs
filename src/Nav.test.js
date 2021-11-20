/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import NavBar from './Nav';

it('checkSignedInAsNavBar', () => {
  const name = 'Bob Ross 0';
  const prop = { name: name };
  const { queryByTitle } = render(<NavBar userdata={prop} />);
  const text = queryByTitle('SignedInAs');
  expect(text).toHaveTextContent('Signed in as: ' + name);
});
