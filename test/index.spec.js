import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import App from '../src/app';

const component = mount(<App />);

describe('App container', () => {
  it('should render inspector monitor\'s component', () => {
    expect(component.find('DevtoolsInspector').html()).toExist();
  });

  it('should contain an empty action list', () => {
    expect(
      component.find('ActionList').findWhere(n => {
        const { className } = n.props();
        return className && className.startsWith('actionListRows-');
      }).html()
    ).toMatch(/<div class="actionListRows-[0-9]+"><\/div>/);
  });
});
