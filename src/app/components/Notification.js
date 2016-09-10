import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as themes from 'redux-devtools-themes';
import { clearNotification } from '../actions';

class Notification extends Component {
  static propTypes = {
    notification: PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string
    }),
    clearNotification: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.notification !== this.props.notification;
  }

  render() {
    if (!this.props.notification) return null;
    const theme = themes.nicinabox;
    const buttonStyle = {
      color: theme.base06, backgroundColor: theme.base00,
      margin: '0', background: '#DC2424'
    };
    const containerStyle = {
      color: theme.base06, background: '#FC2424',
      padding: '5px 10px', minHeight: '20px', display: 'flex'
    };
    return (
      <div style={containerStyle}>
        <div style={{ flex: '1', alignItems: 'center' }}>
          <p style={{ margin: '0px' }}>{this.props.notification.message}</p>
        </div>
        <div style={{ alignItems: 'center' }}>
          <button
            onClick={this.props.clearNotification}
            style={buttonStyle}
          >&times;</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearNotification: bindActionCreators(clearNotification, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
