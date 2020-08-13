import styled from 'styled-components';
import { Tag } from 'antd';

const FatTag = styled(Tag)`
  display: inline-block;
  min-width: 41px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-right: 10px;
  padding: 4px 9px;
  border: 1px solid ${({ color }) => color || '#3dd598'};
  border-radius: 10px;
  background-color: ${({ color }) => color || '#3dd598'};
`;

export default FatTag;
