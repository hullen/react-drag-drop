import React, { Component } from 'react';
import { render } from 'react-dom';
// import DragAndDrop from './DragAndDrop';
import DropContainer from './DragNDrop/DropContainer';
import 'antd/dist/antd.css';
import './style.css';

function App() {
  return (
      <div style={{ margin: 10, maxWidth: 600 }}>
        <DropContainer />
      </div>
    );
}

render(<App />, document.getElementById('root'));
