import React, { useMemo } from 'react';
import { Icon } from 'antd';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { FatTag, BigTag, DropAreaTag } from '../components/Tag';

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return 'lightgreen';
  } else if (canDrop) {
    return 'lightblue';
  } else {
    return 'rgba(198, 219, 253, 0.5)';
  }
}

export const DropBox = ({
  onRemove,
  onDrop,
  accept,
  type,
  cond,
  itens = [],
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  const backgroundColor = selectBackgroundColor(isActive, canDrop);

  const droppedCond = useMemo(() => {
    if (!cond) return null;
    return (
      <FatTag style={{ marginRight: 5 }}>
        {cond}{' '}
        <Icon
          type="close"
          onClick={() => onRemove(-1)}
          style={{ color: '#FFF', fontSize: 18 }}
        />
      </FatTag>
    );
  }, [cond, onRemove]);

  const droppedItens = useMemo(() => {
    if (Array.isArray(itens) && itens.length > 0) {
      return itens.map((it, index) => (
        <span key={index} style={{ marginTop: 5, marginBottom: 5 }}>
          <BigTag style={{ marginRight: 5 }}>
            {it.name}{' '}
            <Icon
              type="close"
              onClick={() => onRemove(index)}
              style={{ color: '#FC5A5A', fontSize: 18 }}
            />
          </BigTag>
          {droppedCond}
        </span>
      ));
    }
    return null;
  }, [itens, droppedCond, onRemove]);

  const labelPlaceholder = useMemo(() => {
    let label = isActive
      ? 'Solte os itens nesta área'
      : 'Arraste os itens para esta área';
    if (type === ItemTypes.CONDITIONAL) {
      label = isActive
        ? 'Solte o operador (E/OU) nesta área'
        : 'Arraste o operador (E/OU) para esta área';
    }
    return label;
  }, [isActive, type]);

  return (
    <div ref={drop} style={{ display: 'flex', justifyContent: 'center'  }}>
      <DropAreaTag size={type === ItemTypes.CONDITIONAL && 'half'} placeholder={labelPlaceholder} style={{ backgroundColor }}>
        {type === ItemTypes.CONDITIONAL ? droppedCond : droppedItens}
      </DropAreaTag>
    </div>
  );
};
