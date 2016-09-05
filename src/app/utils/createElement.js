import React from 'react';

const createElement = (originalProps) => (ChildComponent, props) => (
  <ChildComponent {...props} {...originalProps} />
);

export default createElement;
