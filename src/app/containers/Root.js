import React, { PropTypes, cloneElement } from 'react';
import enhance from '../hoc';

const Layout = (props) => {
  const { children, ...rest } = props;
  return (
    <div style={{ height: '100%' }}>{cloneElement(children, rest)}</div>
  );
};

Layout.propTypes = {
  children: PropTypes.any
};

export default enhance(Layout);
