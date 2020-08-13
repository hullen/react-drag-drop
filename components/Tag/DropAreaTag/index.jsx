import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tag } from 'antd';

const StyledDropAreaTag = styled(Tag).attrs(
  props => props.size === 'half' && { className: 'tag-half' }
)`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  color: #171725;
  font-size: 14px;
  font-weight: 500;
  margin-right: 0;
  margin-bottom: 10px;
  padding: 17px 16px;
  border: 1px dashed #0062ff;
  border-radius: 10px;
  background-color: rgba(0, 98, 255, 0.01);

  &.tag-half {
    width: 50%;
  }

  .placeholder {
    display: inline-block;
    width: 100%;
    color: #696974;
    font-weight: normal;
    text-align: center;
    white-space: normal;
  }
`;

function DropAreaTag({
  placeholder = 'Arraste os itens para esta área',
  children,
  ...props
}) {
  const child = useMemo(() => {
    if (children) return children;
    return <span className="placeholder">{placeholder}</span>;
  }, [children, placeholder]);

  return <StyledDropAreaTag {...props}>{child}</StyledDropAreaTag>;
}

export default DropAreaTag;
