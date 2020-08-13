import styled from 'styled-components';
import { Tag } from 'antd';

const BigTag = styled(Tag).attrs(
  props => props.size === 'full' && { className: 'tag-full' }
)`
  color: #171725;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
  padding: 17px 16px;
  border: 1px solid #b1b1b7;
  border-radius: 10px;
  background-color: #ffffff;

  &.tag-full {
    display: block;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

export default BigTag;
