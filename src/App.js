import React from 'react';
import FlipBook from './FlipBook';

function App() {
    const pdfUrl = `${process.env.PUBLIC_URL}/sample.pdf`;

    return (
        <div>
            <FlipBook pdfPath={pdfUrl} />
        </div>
    );
}

export default App;
