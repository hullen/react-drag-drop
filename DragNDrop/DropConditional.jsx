import React from 'react';
import { useDrag } from 'react-dnd';
import { FatTag } from '../components/Tag';
import { ItemTypes } from './ItemTypes';

export const DropConditional = ({ name, showCopyIcon = true }) => {
  const item = { name, type: ItemTypes.CONDITIONAL };
  const [{ opacity }, drag] = useDrag({
    item,
    options: {
      dropEffect: showCopyIcon ? 'copy' : 'move',
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });
  return (
    <div ref={drag} style={{ marginRight: 10, opacity }}>
      <FatTag style={{ cursor: 'move', marginRight: 0 }}>{name}</FatTag>
    </div>
  );
};
