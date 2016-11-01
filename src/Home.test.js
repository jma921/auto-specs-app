jest.unmock('./utils/base');
import React from 'react';
import { shallow } from 'enzyme';
import Home from './Home';

const base = jest.fn();

it('renders without crashing', () => {
  shallow(<Home />);
});
