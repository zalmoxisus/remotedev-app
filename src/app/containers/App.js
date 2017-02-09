import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Container } from 'remotedev-ui';
import Header from '../components/Header';
import Actions from '../containers/Actions';
import Settings from '../components/Settings';

class App extends Component {
  render() {
    const { section } = this.props;
    let body;
    switch (section) {
      case 'Settings': body = <Settings />; break;
      default: body = <Actions />;
    }

    return (
      <Container themeData={{ theme: 'default', scheme: 'default', light: true }}>
        <Header section={section} />
        {body}
      </Container>
    );
  }
}

App.propTypes = {
  section: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    section: state.section
  };
}

export default connect(mapStateToProps, null)(App);
