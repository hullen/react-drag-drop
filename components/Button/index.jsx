import React from 'react';
import { Button as AButton } from 'antd';

export function ButtonTransparent({ style, children, ...props }) {
  return (
    <AButton
      type="primary"
      size="small"
      ghost
      style={{ border: 'none', boxShadow: 'none', ...style }}
      {...props}>
      {children}
    </AButton>
  );
}
