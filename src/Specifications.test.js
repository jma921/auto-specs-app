import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import Clipboard from 'clipboard';
jest.unmock('Tooltip');
import { Tooltip } from 'reactstrap';
import Specifications from './Specifications';

const specs = {
    "oilCap": "5.3",    
};

const wrapper = mount(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);

it('renders without crashing', () => {
  shallow(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);
});

it('make should be Acura', () => {
//   const wrapper = mount(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);
  expect(wrapper.props().make).toBe("Acura");
});

it('model should be ILX', () => {
//   const wrapper = mount(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);
  expect(wrapper.props().model).toBe("ILX");
});

it('year should be 2013', () => {  
  expect(wrapper.props().year).toBe("2013");
});

it('engine should be 2.0', () => {  
  expect(wrapper.props().engine).toBe("2.0");
});

it('data.oilCap should be 5.3', () => {  
  expect(wrapper.props().data.oilCap).toBe("5.3");
});
