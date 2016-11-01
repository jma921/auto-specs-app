import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const wrapper = shallow(<App />);  
  console.log(wrapper.children);
});





