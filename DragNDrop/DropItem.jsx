import React from 'react';
import { useDrag } from 'react-dnd';
import { BigTag } from '../components/Tag';
import { ItemTypes } from './ItemTypes';

export const DropItem = ({ name, showCopyIcon = true }) => {
  const item = { name, type: ItemTypes.ITEM };
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
    <div ref={drag} style={{ cursor: 'move', marginRight: 10, marginTop: 5, marginBottom: 5, opacity }}>
      <BigTag style={{ marginRight: 0 }}>{name}</BigTag>
    </div>
  );
};
