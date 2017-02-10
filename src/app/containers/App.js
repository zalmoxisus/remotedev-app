import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Container } from 'remotedev-ui';
import Header from '../components/Header';
import Actions from '../containers/Actions';
import Settings from '../components/Settings';

class App extends Component {
  render() {
    const { section, theme } = this.props;
    let body;
    switch (section) {
      case 'Settings': body = <Settings />; break;
      default: body = <Actions />;
    }

    return (
      <Container themeData={theme}>
        <Header section={section} />
        {body}
      </Container>
    );
  }
}

App.propTypes = {
  section: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    section: state.section,
    theme: state.theme
  };
}

export default connect(mapStateToProps, null)(App);
