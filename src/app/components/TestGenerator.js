import 'codemirror/mode/javascript/javascript';
import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Button from './Button';
import AddButton from 'react-icons/lib/md/add';
import EditButton from 'react-icons/lib/md/edit';
import TestGenerator from 'redux-devtools-test-generator';
import mochaTemplate from 'redux-devtools-test-generator/lib/redux/mocha/template';
import tapeTemplate from 'redux-devtools-test-generator/lib/redux/tape/template';
import TestForm from './TestForm';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import styles from '../styles';

let testTemplates;
let selected;

export default class TestGen extends Component {
  constructor(props) {
    super(props);
    if (!testTemplates) {
      testTemplates = props.testTemplates || getFromStorage('test-templates');
      selected = props.selectedTemplate || getFromStorage('test-templates-sel') || 0;
    }
    if (typeof testTemplates === 'string') {
      testTemplates = JSON.parse(testTemplates);
    }
    if (!testTemplates || testTemplates.length === 0) {
      testTemplates = this.getDefaultTemplates();
    }
    if (typeof selected === 'string') {
      selected = Number(selected);
    }

    this.state = { testTemplates, selected, dialogStatus: 0 };
  }

  onSelect = (event, index, value) => {
    selected = saveToStorage('test-templates-sel', value);
    this.setState({ selected });
  };

  getDefaultTemplates() {
    return [
      { name: 'Mocha template', ...mochaTemplate },
      { name: 'Tape template', ...tapeTemplate }
    ];
  }

  editTemplate = () => {
    this.setState({ dialogStatus: 1 });
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 2 });
  };

  handleSave = (template) => {
    testTemplates = [...this.state.testTemplates];
    selected = this.state.selected;

    if (this.state.dialogStatus === 1) {
      testTemplates[this.state.selected] = template;
    } else {
      testTemplates.push(template);
      selected = testTemplates.length - 1;
      saveToStorage('test-templates-sel', selected);
    }

    saveToStorage('test-templates', testTemplates);
    this.setState({ testTemplates, selected, dialogStatus: 0 });
  };

  handleRemove = () => {
    // Todo: add snackbar with undo
    selected = 0;
    testTemplates = [...this.state.testTemplates];
    testTemplates.splice(this.state.selected, 1);
    if (testTemplates.length === 0) testTemplates = this.getDefaultTemplates();
    saveToStorage('test-templates-sel', selected);
    saveToStorage('test-templates', testTemplates);
    this.setState({ testTemplates, selected, dialogStatus: 0 });
  };

  handleCloseDialog = () => {
    this.setState({ dialogStatus: 0 });
  };

  render() {
    const { dialogStatus, selected, testTemplates } = this.state; // eslint-disable-line
    const template = testTemplates[selected];
    const { assertion, wrap } = template;

    return (
      <TestGenerator
        assertion={assertion} wrap={wrap}
        theme="night" useCodemirror={this.props.useCodemirror}
        header={
          <div style={{ height: '2.5em', display: 'flex' }}>
            <SelectField
              style={styles.select}
              labelStyle={styles.selectLabel}
              iconStyle={styles.selectIcon}
              onChange={this.onSelect}
              value={selected}
            >
              {testTemplates.map((item, i) =>
                <MenuItem key={i} value={i} primaryText={item.name} />
              )}
            </SelectField>
            <Button Icon={EditButton} onClick={this.editTemplate} />
            <Button Icon={AddButton} onClick={this.addTemplate} />
            <TestForm { ...{
              template, dialogStatus,
              onSave: this.handleSave,
              onRemove: this.handleRemove,
              onClose: this.handleCloseDialog
            } }
            />
          </div>
        }
        {...this.props}
      />
    );
  }
}

TestGen.propTypes = {
  testTemplates: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  selectedTemplate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  useCodemirror: PropTypes.bool
};
