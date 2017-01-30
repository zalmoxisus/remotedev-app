import React, { Component, PropTypes } from 'react';
import { Tabs, Toolbar } from 'remotedev-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeSection } from '../actions';

const tabs = [
  { name: 'Actions' },
  { name: 'Effects' },
  { name: 'Events' },
  { name: 'Reports' },
  { name: 'Settings' }
];

class Header extends Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    changeSection: PropTypes.func.isRequired
  };

  render() {
    return (
      <Toolbar compact borderPosition="bottom">
        <Tabs
          main
          tabs={tabs}
          onClick={this.props.changeSection}
          selected={this.props.section || 'Actions'}
        />
      </Toolbar>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeSection: bindActionCreators(changeSection, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Header);
