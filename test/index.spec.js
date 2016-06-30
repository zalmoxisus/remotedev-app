import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import createDevStore from '../src/app/store/createDevStore';
import App from '../src/app';

const component = mount(<App />);

describe('App container', () => {
  it('should render inspector monitor\'s component', () => {
    expect(component.find('div.inspector--jss-0-0').html()).toExist();
  });

  it('should contain an empty action list', () => {
    expect(
      component.find('div.actionListRows--jss-0-4').html()
    ).toBe('<div class=" actionListRows--jss-0-4"></div>');
  });
});
