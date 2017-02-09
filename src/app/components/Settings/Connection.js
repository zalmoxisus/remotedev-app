import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'remotedev-ui';
import { saveSocketSettings } from '../../actions';

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

class Connection extends Component {
  static propTypes = {
    saveSettings: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    connectionType: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = this.setFormData(props.connectionType);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  handleSave = data => {
    this.props.saveSettings(data.formData);
    this.setState({ changed: false });
  };

  setFormData = (connectionType, changed) => {
    let schema;
    if (connectionType !== 'custom') {
      schema = {
        type: 'object',
        properties: { connectionType: defaultSchema.properties.connectionType }
      };
    } else {
      schema = defaultSchema;
    }
    return {
      formData: {
        connectionType,
        ...this.props.options
      },
      connectionType, schema, changed
    };
  };

  handleChange = data => {
    const formData = data.formData;
    const connectionType = formData.connectionType;
    if (connectionType !== this.state.connectionType) {
      this.setState(this.setFormData(connectionType, true));
    } else if (!this.state.changed) {
      this.setState({ changed: true, formData });
    }
  };

  render() {
    const connectionType = this.state.connectionType || 'disabled';
    const changed = this.state.changed;
    const disabled = connectionType === 'disabled';

    return (
      <Container>
        <Form
          primaryButton={changed}
          noSubmit={disabled && !changed}
          submitText={disabled ? 'Disconnect' : 'Connect'}
          formData={this.state.formData}
          schema={this.state.schema}
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

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
