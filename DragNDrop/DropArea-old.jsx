import React, { useCallback, useState, useMemo } from 'react';
import update from 'immutability-helper';
import { notification, Button } from 'antd';
import { DropBox } from './DropBox';
import { DropItem } from './DropItem';
import { DropConditional } from './DropConditional';
import { ItemTypes } from './ItemTypes';

const itensMock = [
  { id: 1, name: 'Item 01', type: ItemTypes.ITEM },
  { id: 2, name: 'Item 02', type: ItemTypes.ITEM },
  { id: 3, name: 'Item 03', type: ItemTypes.ITEM },
  { id: 4, name: 'Item 04', type: ItemTypes.ITEM },
  { id: 5, name: 'Item 05', type: ItemTypes.ITEM },
  { id: 6, name: 'Item 06', type: ItemTypes.ITEM },
];

const regrasMock = [{ accepts: [ItemTypes.ITEM], itens: [], cond: null }];

export default function DropArea() {
  const [regras, setRegras] = useState(regrasMock);

  const [itens] = useState(itensMock);

  console.log('regras', regras);

  const itensMemo = useMemo(
    () =>
      itens.map(({ name, type }, index) => (
        <DropItem name={name} key={index} />
      )),
    [itens]
  );

  const regrasMemo = useMemo(
    () =>
      regras.map((regra, index) => (
        <DropBox
          onRemove={itemIndex => handleRemove(index, itemIndex)}
          onDrop={item => handleDrop(index, item)}
          itens={regra.itens}
          cond={regra.cond}
        />
      )),
    [regras]
  );

  const handleDrop = useCallback(
    (index, item) => {
      const { name, type } = item;
      if (type === ItemTypes.ITEM) {
        const itemExists =
          regras[index] &&
          regras[index].itens &&
          regras[index].itens.find(it => it.name === item.name);

        if (!itemExists) {
          setRegras(
            update(regras, {
              [index]: {
                itens: { $push: [item] },
              },
            })
          );
        } else {
          notification.error({ message: `Item ${item.name} já adicionado` });
        }
      } else if (type === ItemTypes.CONDITIONAL) {
        setRegras(
          update(regras, {
            [index]: {
              cond: { $set: item.name },
            },
          })
        );
      }
    },
    [regras]
  );

  const handleRemove = useCallback(
    (index, itemIndex) => {
      let newRegras;
      if (itemIndex >= 0) {
        newRegras = update(regras, {
          [index]: {
            itens: { $splice: [[itemIndex, 1]] },
          },
        });
      } else {
        newRegras = update(regras, {
          [index]: {
            cond: { $set: null },
          },
        });
      }
      setRegras(newRegras);
    },
    [regras]
  );

  const handleAddRegra = useCallback(() => {
    setRegras(update(regras, { $push: regrasMock }));
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          overflow: 'hidden',
          clear: 'both',
          marginBottom: 10,
        }}>
        {itensMemo}
      </div>
      <div
        style={{
          display: 'flex',
          overflow: 'hidden',
          clear: 'both',
          marginBottom: 10,
        }}>
        <DropConditional name="E" />
        <DropConditional name="OU" />
      </div>
      <div style={{ overflow: 'hidden', clear: 'both' }}>{regrasMemo}</div>
      <div>
        <Button size="small" onClick={handleAddRegra}>
          Adicionar novo grupo de condições
        </Button>
      </div>
    </div>
  );
}
