import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import Clipboard from 'clipboard';
import Specifications from './Specifications';

const specs = {
    "oilCap": "5.3",    
};

const wrapper = shallow(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);

it('renders without crashing', () => {
  shallow(<Specifications make="Acura" model="ILX" year="2013" engine="2.0" data={specs} />);
});

it('make should be Acura', () => {
  expect(wrapper.instance().props.make).toBe("Acura");
});

it('model should be ILX', () => {
  expect(wrapper.instance().props.model).toBe("ILX");
});

it('year should be 2013', () => {  
  expect(wrapper.instance().props.year).toBe("2013");
});

it('engine should be 2.0', () => {  
  expect(wrapper.instance().props.engine).toBe("2.0");
});

it('data.oilCap should be 5.3', () => {  
  expect(wrapper.instance().props.data.oilCap).toBe("5.3");
});

it('print button should open print window', () => {  
  // const printWindow = sinon.spy();
  // const printButton = shallow(<button id="printSpecs" className="btn btn-success mr-1 hidden-print" onClick={printWindow}><i className="fa fa-print"></i> Print</button>);
  // wrapper.find('#printSpecs').simulate('click');
  // expect(printWindow.calledOnce).to.equal(true);  
});
