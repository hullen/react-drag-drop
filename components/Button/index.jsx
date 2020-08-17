import React from 'react';
import { Button as AButton } from 'antd';
import styled from 'styled-components';

const ButtonTransparent = styled(AButton).attrs(props => ({
  ghost: true,
  type: props.type || 'primary',
}))`
  border: none;
  background: transparent;
  box-shadow: unset;
`;

export { ButtonTransparent };
