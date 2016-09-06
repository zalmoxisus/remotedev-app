import React, { Component, PropTypes } from 'react';
import {
  Table, TableBody, TableRow, TableRowColumn
} from 'material-ui/Table';
import { getSettings } from '../../utils/localStorage';

const style = {
  error: { color: '#EF5350' },
  date: { textAlign: 'right', maxWidth: '150px' }
};

export default class LogsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    if (this.props.location.pathname !== pathname) this.list(pathname === '/logs');
  }

  componentWillMount() {
    this.list(this.props.location.pathname === '/logs');
  }

  list(isLog) {
    this.request('list', {
      query: { where: { isLog } },
      fields: ['id', 'title', 'added']
    });
  }

  request(op, query) {
    const options = getSettings() || this.props.socketOptions;
    const url = `${options.secure ? 'https' : 'http'}://${options.hostname}:${options.port}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ op, ...query })
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      console.log('data', data);
      this.setState({ [op]: data });
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <Table>
        <TableBody displayRowCheckbox={false}>
          {this.state.list.map((data) => (
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

LogsTable.propTypes = {
  socketOptions: PropTypes.shape({
    hostname: PropTypes.string,
    port: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    autoReconnect: PropTypes.bool,
    secure: PropTypes.bool
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};
