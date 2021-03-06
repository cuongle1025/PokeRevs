/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import NavBar from './Nav';

it('checkSignedInAsNavBar', () => {
  const name = 'Bob Ross 0';
  const prop = { name };
  const { queryByTitle } = render(<NavBar userdata={prop} />);
  const text = queryByTitle('dropdown');
  expect(text).toHaveTextContent(name);
});
