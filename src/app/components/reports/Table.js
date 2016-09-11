import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Table, TableBody, TableRow, TableRowColumn
} from 'material-ui/Table';
import { getReport } from '../../actions';

const style = {
  error: { color: '#EF5350' },
  date: { textAlign: 'right', maxWidth: '150px' }
};

class Reports extends Component {
  onSelect = r => {
    const idx = r[0];
    if (typeof idx === 'undefined') return;
    this.props.getReport(this.props.reports[idx]);
  };

  render() {
    return (
      <Table onRowSelection={this.onSelect}>
        <TableBody displayRowCheckbox={false}>
          {this.props.reports.map((data) => (
            <TableRow key={data.id}>
              <TableRowColumn>{data.title}</TableRowColumn>
              <TableRowColumn style={style.date}>{data.added}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

Reports.propTypes = {
  reports: PropTypes.array.isRequired,
  getReport: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    reports: state.reports.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getReport: bindActionCreators(getReport, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
