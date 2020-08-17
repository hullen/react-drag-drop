import React, { useState, useCallback, useMemo } from 'react';
import update from 'immutability-helper';
import { Button, notification } from 'antd';
import { DropBox } from './DropBox';
import { DropItem } from './DropItem';
import { DropConditional } from './DropConditional';
import { ItemTypes } from './ItemTypes';
import { DropAreaTag } from '../components/Tag';
import { ButtonTransparent } from '../components/Button';
import { range } from '../utils';

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

const regrasGroupMock = {
  type: ItemTypes.GROUP,
  accepts: [],
  items: [],
  cond: null,
  checked: false,
};

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

const regrasComGrupoMock = [
  subRegrasMock,
  {
    type: ItemTypes.CONDITIONAL,
    accepts: [ItemTypes.CONDITIONAL],
    items: [],
    cond: 'OU',
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
  ...regrasCondMock,
];

const itemsMock = Array.from(Array(10).keys(), k => ({
  id: k,
  name: `Item ${k}`,
  type: ItemTypes.ITEM,
}));

export default function DropArea() {
  const [regras, setRegras] = useState(regrasComGrupoMock);
  const [tags] = useState(itemsMock);
  const [enableCheck, setEnableCheck] = useState(false);
  console.log('regras', regras);
  const handleDrop = useCallback(
    (index, item, regraType) => {
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
        const condDropped = item.name;
        const condPrev = regras[index - 2] || {};
        const condNext = regras[index + 2] || {};

        if (regraType === ItemTypes.CONDITIONAL && condPrev.cond && condPrev.cond !== condDropped) {
          console.log('regra anterior diferente');
          notification.error({
            message: 'Não é possível adicionar operador',
            description: `O operador (${condDropped}) é diferente do operador da regra anterior (${
              condPrev.cond
            }).`,
          });
        } else if (regraType === ItemTypes.CONDITIONAL &&condNext.cond && condNext.cond !== condDropped) {
          console.log('regra proxima diferente');
          notification.error({
            message: 'Não é possível adicionar operador',
            description: `O operador (${condDropped}) é diferente do operador da próxima regra (${
              condNext.cond
            }).`,
          });
        } else {
          setRegras(prev =>
            update(prev, {
              [index]: {
                cond: {
                  $set: condDropped,
                },
              },
            })
          );
        }
      }
    },
    [regras]
  );

  const handleRemove = useCallback((index, itemIndex) => {
    // if is a item type
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
      // if is a conditional type
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
          $toggle: ['checked'],
        },
      })
    );
  }, []);

  const handleRemoveRegraGroup = useCallback(
    index => {
      const regraGrupoItems = regras[index].items;
      const regraGrupoCond = regraGrupoItems[1];
      const condPrev = regras[index - 1] || {};
      const condNext = regras[index + 1] || {};

      if (condPrev.cond && condPrev.cond !== regraGrupoCond.cond) {
        notification.error({
          message: 'Não é possível desagrupar',
          description: `O operador do grupo (${
            regraGrupoCond.cond
          }) é diferente do operador da regra anterior (${condPrev.cond})`,
        });
      } else if (condNext.cond && condNext.cond !== regraGrupoCond.cond) {
        notification.error({
          message: 'Não é possível desagrupar',
          description: `O operador do grupo (${
            regraGrupoCond.cond
          }) é diferente do operador da próxima regra (${condNext.cond})`,
        });
      } else {
        const newRegras = update(regras, {
          $splice: [[index, 1], [index, 0, ...regraGrupoItems]],
        });
        setRegras(newRegras);
      }
    },
    [regras]
  );

  const regrasMemo = useMemo(
    () =>
      regras.map((regra, index) => {
        if (regra.type === ItemTypes.GROUP) {
          return (
            <DropAreaTag key={index} style={{ marginBottom: 10 }}>
              <ButtonTransparent onClick={() => handleRemoveRegraGroup(index)}>
                Desagrupar regra
              </ButtonTransparent>
              <div style={{ width: '100%' }}>
                {regra.items.map((subregra, idx) => (
                  <DropBox
                    accept={[]}
                    type={subregra.type}
                    cond={subregra.cond}
                    itens={subregra.items}
                    group
                  />
                ))}
              </div>
            </DropAreaTag>
          );
        } else {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              {enableCheck &&
                regra.type === ItemTypes.ITEM &&
                regra.items.length > 0 && (
                  <Button
                    size="small"
                    icon="check"
                    shape="circle"
                    type={regra.checked ? 'primary' : 'default'}
                    onClick={() => handleToggleCheck(index)}
                    style={{ marginRight: 10 }}
                  />
                )}
              <DropBox
                onDrop={item => handleDrop(index, item, regra.type)}
                onRemove={itemIndex => handleRemove(index, itemIndex)}
                accept={regra.accepts}
                selected={regra.checked && enableCheck ? 'true' : undefined}
                type={regra.type}
                cond={regra.cond}
                itens={regra.items}
              />
            </div>
          );
        }
        return null;
      }),
    [
      regras,
      enableCheck,
      handleDrop,
      handleRemove,
      handleToggleCheck,
      handleRemoveRegraGroup,
    ]
  );

  const itemsMemo = useMemo(
    () => tags.map(({ name, id }) => <DropItem key={id} id={id} name={name} />),
    [tags]
  );

  // Necessario para contar apenas as regras principais do tipo item, excluindo os grupos
  const regrasItemLength = useMemo(
    () =>
      regras.filter(
        ({ type, items }) => type === ItemTypes.ITEM && items.length > 1
      ).length,
    [regras]
  );
  const podeCriarGrupo = useMemo(() => regrasItemLength > 1, [
    regrasItemLength,
  ]);

  // Necessario para validar se pode adicionar uma nova secao de regras
  const regrasLength = regras.length;
  const podeAddRegra = useMemo(() => {
    const ultimaRegra = regras[regrasLength - 1];
    if (
      (ultimaRegra && ultimaRegra.cond && ultimaRegra.items.length > 1) ||
      regrasItemLength === 0
    ) {
      return true;
    }
    return false;
  }, [regras, regrasLength, regrasItemLength]);

  const createGroup = useCallback(() => {
    const checkedItems = regras
      .map((r, idx) => (r.checked ? idx : undefined))
      .filter(f => f >= 0);
    const checkLength = checkedItems.length;
    if (checkLength > 1) {
      const min = checkedItems[0] || 0;
      const max = checkLength > 0 ? checkedItems[checkLength - 1] : 0;
      const indexes = range(min, max);
      const indexesLength = indexes.length;
      const regrasParaMover = regras
        .filter((_, idx) => indexes.includes(idx))
        .map(r => ({ ...r, checked: false }));
      const newGroup = { ...regrasGroupMock, items: regrasParaMover };
      const newRegras = update(regras, {
        $splice: [[min, indexesLength], [min, 0, newGroup]],
      });
      setRegras(newRegras);
    }
  }, [regras]);

  const handleToggleGroup = useCallback(() => {
    if (enableCheck) {
      createGroup();
    }
    setEnableCheck(prev => !prev);
  }, [enableCheck, createGroup]);

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
        <ButtonTransparent
          size="small"
          onClick={handleToggleGroup}
          disabled={!podeCriarGrupo}>
          {enableCheck ? 'Concluir condicionais' : 'Agrupar condicionais'}
        </ButtonTransparent>
      </div>
      <div>{regrasMemo}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ButtonTransparent
          size="small"
          onClick={handleAddRegra}
          disabled={!podeAddRegra}>
          Adicionar novo grupo de condições
        </ButtonTransparent>
        {regrasLength >= 3 && (
          <ButtonTransparent
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
