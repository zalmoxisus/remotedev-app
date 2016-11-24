import React, { Component, PropTypes, createElement } from 'react';
import getMonitor from '../utils/getMonitor';

export default class DevTools extends Component {
  constructor(props) {
    super(props);
    this.getMonitor(props);
  }

  getMonitor(props) {
    const monitorElement = getMonitor(props);
    this.monitorProps = monitorElement.props;
    this.Monitor = monitorElement.type;

    const update = this.Monitor.update;
    if (update) {
      let newMonitorState;
      const monitorState = props.monitorState;
      if (monitorState && monitorState.__overwritten__ === props.monitor) {
        newMonitorState = monitorState;
      } else {
        newMonitorState = update(this.monitorProps, undefined, {});
        if (newMonitorState !== monitorState) {
          this.preventRender = true;
        }
      }
      this.dispatch({
        type: '@@INIT_MONITOR',
        newMonitorState,
        update,
        monitorProps: this.monitorProps
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (
      nextProps.monitor !== this.props.monitor ||
      nextProps.lib !== this.props.lib
    ) this.getMonitor(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.monitorState !== this.props.liftedState ||
      nextProps.lib !== this.props.lib
    );
  }

  dispatch = action => {
    this.props.dispatch(action);
  };

  render() {
    if (this.preventRender) {
      this.preventRender = false;
      return null;
    }

    const liftedState = {
      ...this.props.liftedState,
      monitorState: this.props.monitorState
    };
    return (
      <this.Monitor
        dispatch={this.dispatch}
        {...liftedState}
        {...this.monitorProps}
      />
    );
  }
}

DevTools.propTypes = {
  liftedState: PropTypes.object,
  monitorState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  monitor: PropTypes.string,
  lib: PropTypes.string
};
