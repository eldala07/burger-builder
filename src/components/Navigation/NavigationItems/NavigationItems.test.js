import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

// shallow renders the component, but not deeply
// meaning we don't render the content of the children

configure({adapter: new Adapter()});

describe('<NavigationItems />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<NavigationItems />);
  });

  it('should render two <NavigationItem /> elements if not authenticated', () => {
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it('should render three <NavigationItem /> elements if authenticated', () => {
    // wrapper = shallow(<NavigationItems />);
    wrapper.setProps({isAuthenticated: true});
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it('should have <NavigationItem /> element for logout if authenticated', () => {
    // wrapper = shallow(<NavigationItems />);
    wrapper.setProps({isAuthenticated: true});
    expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
  });
});

// Mock functions for async functions