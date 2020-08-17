import React, { useMemo } from 'react';
import { Icon } from 'antd';
import { useDrop } from 'react-dnd';
import { FatTag, BigTag, DropAreaTag } from '../components/Tag';
import { ItemTypes } from './ItemTypes';

function selectBackgroundColor(isActive, canDrop, selected) {
  if (isActive) {
    return 'lightgreen';
  } else if (canDrop) {
    return 'rgba(198, 219, 253, 0.8)';
  } else if (selected) {
    return 'rgba(198, 219, 253, 0.5)';
  } else {
    return 'rgba(198, 219, 253, 0.2)';
  }
}

export const DropBox = ({
  onRemove = () => {},
  onDrop = () => {},
  accept = [],
  selected = false,
  type,
  cond,
  itens = [],
  group = false,
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
  const backgroundColor = selectBackgroundColor(isActive, canDrop, selected);

  const droppedCond = useMemo(() => {
    if (!cond) return null;
    return (
      <FatTag style={{ marginRight: 5 }}>
        {cond}
        {!group && (
          <Icon
            type="close"
            onClick={() => onRemove(-1)}
            style={{ color: '#FFF', fontSize: 18 }}
          />
        )}
      </FatTag>
    );
  }, [cond, group, onRemove]);

  const droppedItens = useMemo(() => {
    const itensLenght = Array.isArray(itens) ? itens.length : 0;
    if (itensLenght > 0) {
      return itens.map((it, index) => (
        <span key={it.id} style={{ marginTop: 5, marginBottom: 5 }}>
          <BigTag style={{ marginRight: 5 }}>
            {it.name}
            {!group && <Icon
              type="close"
              onClick={() => onRemove(index)}
              style={{ color: '#FC5A5A', fontSize: 18 }}
            />}
          </BigTag>
           {(index+1 < itensLenght || itensLenght === 1) && droppedCond}
        </span>
      ));
    }
    return null;
  }, [itens, group, droppedCond, onRemove]);

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
    <div
      ref={drop}
      style={{
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        marginBottom: group ? 10 : undefined,
      }}>
      <DropAreaTag
        size={(type === ItemTypes.CONDITIONAL && 'half') || undefined}
        justify={(type === ItemTypes.CONDITIONAL && 'center') || undefined}
        placeholder={labelPlaceholder}
        style={{ backgroundColor }}>
        {type === ItemTypes.CONDITIONAL ? droppedCond : droppedItens}
      </DropAreaTag>
    </div>
  );
};
