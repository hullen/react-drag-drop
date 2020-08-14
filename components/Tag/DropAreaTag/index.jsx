import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Tag } from 'antd';

const StyledDropAreaTag = styled(Tag).attrs(
  props => props.size === 'half' && { className: 'tag-half' }
)`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${({justify}) => justify};
  width: 100%;
  color: #171725;
  font-size: 14px;
  font-weight: 500;
  margin-right: 0;
  margin-bottom: 0;
  padding: 8px;
  border: 1px dashed #0062ff;
  border-radius: 10px;
  background-color: rgba(198, 219, 253, 0.5);

  &.tag-half {
    width: 50%;
  }

  .placeholder {
    display: inline-block;
    width: 100%;
    padding: 10px;
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
