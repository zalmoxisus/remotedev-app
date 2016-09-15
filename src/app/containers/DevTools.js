import React, { Component, PropTypes, createElement } from 'react';
import getMonitor from '../utils/getMonitor';

export default class DevTools extends Component {
  constructor(props) {
    super(props);
    this.monitorElement = getMonitor(props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.monitor !== this.props.monitor ||
      nextProps.testComponent !== this.props.testComponent
    ) {
      this.monitorElement = getMonitor(nextProps);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.testComponent !== this.props.testComponent
    );
  }

  render() {
    const { liftedState, dispatch } = this.props;
    const monitorProps = this.monitorElement.props;
    const Monitor = this.monitorElement.type;
    return <Monitor dispatch={dispatch} {...liftedState} {...monitorProps} />;
  }
}

DevTools.propTypes = {
  liftedState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  monitor: PropTypes.string,
  testComponent: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ])
};
