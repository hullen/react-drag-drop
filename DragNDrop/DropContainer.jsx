import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropArea from './DropArea';

export default function DropContainer() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DropArea />
    </DndProvider>
  );
}
