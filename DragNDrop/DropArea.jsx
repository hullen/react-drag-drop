import React, { useState, useCallback, useMemo } from 'react';
import update from 'immutability-helper';
import { Button, notification } from 'antd';
import { DropBox } from './DropBox';
import { DropItem } from './DropItem';
import { DropConditional } from './DropConditional';
import { ItemTypes } from './ItemTypes';
import { DropAreaTag } from '../components/Tag';

const regrasMock = [
  {
    type: ItemTypes.ITEM,
    accepts: [ItemTypes.ITEM, ItemTypes.CONDITIONAL],
    items: [],
    cond: null,
  },
];

const regrasCondMock = [
  {
    type: ItemTypes.CONDITIONAL,
    accepts: [ItemTypes.CONDITIONAL],
    items: [],
    cond: null,
  },
];

const itemsMock = Array.from(Array(10).keys(), k => ({
  id: k,
  name: `Item ${k}`,
  type: ItemTypes.ITEM,
}));

export default function DropArea() {
  const [regras, setRegras] = useState(regrasMock);
  const [tags] = useState(itemsMock);

  const handleDrop = useCallback(
    (index, item) => {
      if (item.type === ItemTypes.ITEM) {
        const itemExists = regras[index].items.find(it => it.id === item.id);
        if (!itemExists) {
          setRegras(prev =>
            update(prev, {
              [index]: {
                items: {
                  $push: [item],
                },
              },
            })
          );
        } else {
          notification.error({ message: `O ${item.name} já existe!` });
        }
      } else if (item.type === ItemTypes.CONDITIONAL) {
        setRegras(prev =>
          update(prev, {
            [index]: {
              cond: {
                $set: item.name,
              },
            },
          })
        );
      }
    },
    [regras]
  );

  const handleRemove = useCallback((index, itemIndex) => {
    if (itemIndex >= 0) {
      setRegras(prev =>
        update(prev, {
          [index]: {
            items: {
              $splice: [[itemIndex, 1]],
            },
          },
        })
      );
    } else {
      setRegras(prev =>
        update(prev, {
          [index]: {
            cond: {
              $set: null,
            },
          },
        })
      );
    }
  }, []);

  const handleAddRegra = useCallback(() => {
    setRegras(prev =>
      update(prev, { $push: [...regrasCondMock, ...regrasMock] })
    );
  }, []);

  const handleRemoveRegra = useCallback(() => {
    setRegras(prev => update(prev, { $splice: [[-2, 2]] }));
  }, []);

  const regrasMemo = useMemo(
    () =>
      regras.map(({ type, accepts, items, cond }, index) => (
        <DropBox
          key={index}
          onDrop={item => handleDrop(index, item)}
          onRemove={itemIndex => handleRemove(index, itemIndex)}
          accept={accepts}
          type={type}
          cond={cond}
          itens={items}
        />
      )),
    [regras]
  );

  const itemsMemo = useMemo(
    () => tags.map(({ name, id }) => <DropItem id={id} name={name} key={id} />),
    [tags]
  );

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        {itemsMemo}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        <DropConditional name="E" />
        <DropConditional name="OU" />
      </div>
      <div>
        {regrasMemo}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size="small" onClick={handleAddRegra}>
            Adicionar novo grupo de condições
          </Button>
          {regras.length >= 3 && (
            <Button
              size="small"
              type="danger"
              icon="delete"
              onClick={handleRemoveRegra}
            />
          )}
        </div>
      </div>
    </>
  );
}
