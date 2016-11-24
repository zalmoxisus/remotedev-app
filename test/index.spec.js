import React from 'react';
import { mount } from 'enzyme';
// import { mountToJson } from 'enzyme-to-json';
import 'mock-local-storage';
import App from '../src/app';
let wrapper;

describe('App container', () => {
  beforeAll(() => {
    wrapper = mount(<App />);
  });

/*
  it('should render the App', () => {
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
*/
  
  it('should render inspector monitor\'s wrapper', () => {
    expect(wrapper.find('DevtoolsInspector').html()).toBeDefined();
  });

  it('should contain an empty action list', () => {
    expect(
      wrapper.find('ActionList').findWhere(n => {
        const { className } = n.props();
        return className && className.startsWith('actionListRows-');
      }).html()
    ).toMatch(/<div class="actionListRows-[0-9]+"><\/div>/);
  });
});
