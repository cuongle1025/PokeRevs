/* eslint-disable camelcase */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import Profile from './Profile';

it('checkSignedInAsProfile', () => {
  const user_id = '1';
  const name = 'Misc. Gary Cross, MD';
  const prop = { user_id: user_id, name: name };
  const { queryByTitle } = render(<Profile userdata={prop} />);
  const header = queryByTitle('TestName');
  expect(header).toHaveTextContent(name);
});
