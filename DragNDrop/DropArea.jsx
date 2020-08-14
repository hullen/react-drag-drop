import React, { useState, useCallback, useMemo } from 'react';
import update from 'immutability-helper';
import { Button, notification } from 'antd';
import { DropBox } from './DropBox';
import { DropItem } from './DropItem';
import { DropConditional } from './DropConditional';
import { ItemTypes } from './ItemTypes';
import { DropAreaTag } from '../components/Tag';

const subRegrasMock = {
  type: ItemTypes.GROUP,
  accepts: [],
  items: [
    {
      type: ItemTypes.ITEM,
      accepts: [ItemTypes.ITEM, ItemTypes.CONDITIONAL],
      items: [
        {
          id: 1,
          name: `Item 1`,
          type: ItemTypes.ITEM,
        },
        {
          id: 2,
          name: `Item 2`,
          type: ItemTypes.ITEM,
        },
      ],
      cond: 'OU',
    },
    {
      type: ItemTypes.CONDITIONAL,
      accepts: [ItemTypes.CONDITIONAL],
      items: [],
      cond: 'E',
    },
    {
      type: ItemTypes.ITEM,
      accepts: [ItemTypes.ITEM, ItemTypes.CONDITIONAL],
      items: [
        {
          id: 3,
          name: `Item 3`,
          type: ItemTypes.ITEM,
        },
        {
          id: 4,
          name: `Item 4`,
          type: ItemTypes.ITEM,
        },
      ],
      cond: 'E',
    },
  ],
  cond: null,
};

const regrasMock = [
  {
    type: ItemTypes.ITEM,
    accepts: [ItemTypes.ITEM, ItemTypes.CONDITIONAL],
    items: [],
    cond: null,
    checked: false,
  },
];

const regrasCondMock = [
  {
    type: ItemTypes.CONDITIONAL,
    accepts: [ItemTypes.CONDITIONAL],
    items: [],
    cond: null,
  },
  {
    type: ItemTypes.ITEM,
    accepts: [ItemTypes.ITEM, ItemTypes.CONDITIONAL],
    items: [],
    cond: null,
    checked: false,
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
  const [enableCheck, setEnableCheck] = useState(false);

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
    setRegras(prev => update(prev, { $push: regrasCondMock }));
  }, []);

  const handleRemoveRegra = useCallback(() => {
    setRegras(prev => update(prev, { $splice: [[-2, 2]] }));
  }, []);

  const handleToggleCheck = useCallback(index => {
    setRegras(prev =>
        update(prev, {
          [index]: {
            checked: {
              $set: !prev[index].checked,
            },
          },
        })
      );
  }, []);

  const regrasMemo = useMemo(
    () =>
      regras.map((regra, index) => {
        if (regra.type === ItemTypes.GROUP) {
          return (
            <DropAreaTag>
              <div style={{ width: '100%' }}>
                {regra.items.map((subregra, index) => (
                  <DropBox
                    key={index}
                    onDrop={item => handleDrop(index, item)}
                    onRemove={itemIndex => handleRemove(index, itemIndex)}
                    accept={subregra.accepts}
                    type={subregra.type}
                    cond={subregra.cond}
                    itens={subregra.items}
                  />
                ))}
              </div>
            </DropAreaTag>
          );
        } else {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              {enableCheck && <Button
                size="small"
                icon="check"
                shape="circle"
                type={regra.checked ? "primary" : "default"}
                onClick={() => handleToggleCheck(index)}
                style={{ marginRight: 10 }}
              />}
              <DropBox
                key={index}
                onDrop={item => handleDrop(index, item)}
                onRemove={itemIndex => handleRemove(index, itemIndex)}
                accept={regra.accepts}
                type={regra.type}
                cond={regra.cond}
                itens={regra.items}
              />
            </div>
          );
        }
        return null;
      }),
    [regras, enableCheck]
  );

  const itemsMemo = useMemo(
    () => tags.map(({ name, id }) => <DropItem id={id} name={name} key={id} />),
    [tags]
  );

  const regrasLength = regras.length;
  const podeAddRegra = useMemo(() => {
    if (
      regras[regrasLength - 1] &&
      regras[regrasLength - 1].cond &&
      regras[regrasLength - 1].items.length > 1
    ) {
      return true;
    }
    return false;
  }, [regras]);

  const handleToggleGroup = useCallback(() => {
    setEnableCheck(prev => !prev);
  }, []);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        {itemsMemo}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        <DropConditional name="E" />
        <DropConditional name="OU" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <Button size="small" onClick={handleToggleGroup}>
          {enableCheck ? "Concluir condicionais" : "Agrupar condicionais"}
        </Button>
      </div>
      <div>{regrasMemo}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" onClick={handleAddRegra} disabled={!podeAddRegra}>
          Adicionar novo grupo de condições
        </Button>
        {regrasLength >= 3 && (
          <Button
            size="small"
            type="danger"
            icon="delete"
            onClick={handleRemoveRegra}
          />
        )}
      </div>
    </>
  );
}
