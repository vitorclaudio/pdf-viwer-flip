import React from 'react';
import FlipBook from './FlipBook';

function App() {
  return (
      <div>
        <h1>Visualizador de PDF com Animação</h1>
        <FlipBook pdfPath="/sample.pdf" />
      </div>
  );
}

export default App;
