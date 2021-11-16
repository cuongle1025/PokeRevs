/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import Profile from './Profile';

it('checkSignedInAsNavBar', () => {
  const username = 'BobRoss';
  const name = 'Bob Ross';
  const prop = { username: username, name: name };
  const { queryByTitle } = render(<Profile userdata={prop} />);
  const header = queryByTitle('UserName');
  expect(header).toHaveTextContent(username);
});
