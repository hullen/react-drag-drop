import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, getListStyle } from "react-beautiful-dnd";
import { BigTag } from './components/Tag';

const initial = Array.from({ length: 10 }, (v, k) => k).map(k => {
  const custom = {
    id: `id-${k}`,
    content: `Tag ${k}`
  };

  return custom;
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Tag({ tag, index }) {
  return (
    <Draggable draggableId={tag.id} index={index}>
      {(provided,snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
        <BigTag>
          {tag.content}
        </BigTag>
        </div>
      )}
    </Draggable>
  );
}

const TagList = React.memo(function TagList({ tags }) {
  return tags.map((tag, index) => (
    <Tag tag={tag} index={index} key={tag.id} />
  ));
});

export default function DragAndDrop() {
  const [state, setState] = useState({ tags: initial });

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const tags = reorder(
      state.tags,
      result.source.index,
      result.destination.index
    );

    setState({ tags });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TagList tags={state.tags} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}