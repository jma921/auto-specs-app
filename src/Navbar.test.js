import React from 'react';
import { shallow, mount } from 'enzyme';
import Navbar from './Navbar';

it('renders without crashing', () => {
  shallow(<Navbar />);
});

