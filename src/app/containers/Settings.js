import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Form } from 'remotedev-ui';
import { saveSocketSettings } from '../actions';

const defaultSchema = {
  type: 'object',
  required: [],
  properties: {
    connectionType: {
      title: 'Connection settings (for getting reports and remote debugging)',
      type: 'string',
      enum: ['disabled', 'remotedev', 'custom'],
      enumNames: ['no remote connection', 'connect via remotedev.io', 'use local (custom) server']
    },
    hostname: {
      type: 'string'
    },
    port: {
      type: 'number'
    },
    secure: {
      type: 'boolean'
    }
  }
};

const uiSchema = {
  connectionType: {
    'ui:widget': 'radio'
  }
};

class Settings extends Component {
  static propTypes = {
    saveSettings: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    connectionType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { connectionType: props.connectionType };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  handleSave = data => {
    this.props.saveSettings(data.formData);
  };

  handleChange = data => {
    let connectionType = data.formData.connectionType;
    if (connectionType !== this.state.connectionType) {
      this.setState({ connectionType });
    }
  };

  render() {
    const connectionType = this.state.connectionType || 'disabled';
    const formData = {
      connectionType,
      ...this.props.options
    };

    let schema = defaultSchema;
    if (connectionType !== 'custom') {
      schema = {
        type: 'object',
        properties: { connectionType: schema.properties.connectionType }
      };
    }

    return (
      <Container>
        <Form
          submitText="Apply"
          formData={formData}
          schema={schema}
          uiSchema={uiSchema}
          onChange={this.handleChange}
          onSubmit={this.handleSave}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const connectionType = state.socket.connectionType;
  let options;
  if (connectionType === 'custom') {
    options = state.socket.options;
  } else {
    options = {
      hostname: 'localhost',
      port: 8000,
      secure: false
    };
  }
  return { options, connectionType };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSettings: bindActionCreators(saveSocketSettings, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
