import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function FlipBook({ pdfPath }) {
    const [numPages, setNumPages] = useState(0);
    const [pageImages, setPageImages] = useState({});
    const pdfRef = useRef(null);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfPath);
                const pdf = await loadingTask.promise;
                pdfRef.current = pdf;

                setNumPages(pdf.numPages);

                // Carrega a primeira e segunda página
                renderPage(0);
                renderPage(1);
            } catch (error) {
                console.error("❌ Erro ao carregar o PDF:", error);
            }
        };

        loadPDF();
    }, [pdfPath]);

    const renderPage = async (index) => {
        if (pageImages[index] || !pdfRef.current) return;

        try {
            const page = await pdfRef.current.getPage(index + 1);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport,
                useOnlyCssZoom: true,
                renderInteractiveForms: true,
            }).promise;

            const imageData = canvas.toDataURL();
            setPageImages((prev) => ({ ...prev, [index]: imageData }));
        } catch (error) {
            console.error(`Erro ao renderizar página ${index + 1}:`, error);
        }
    };

    const handleFlip = (e) => {
        const currentPage = e.data;
        renderPage(currentPage);       // Página atual
        renderPage(currentPage + 1);   // Pré-carrega a próxima
        renderPage(currentPage + 2); // pré-carrega ainda mais
        renderPage(currentPage + 3); // pré-carrega ainda mais

    };

    const pages = Array.from({ length: numPages });

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HTMLFlipBook
                width={400}
                height={800}
                size="fixed"
                onFlip={handleFlip}
            >


            {pages.map((_, index) => (
                    <div key={index} className="page">
                        {pageImages[index] ? (
                            <img
                                src={pageImages[index]}
                                alt={`Página ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    background: '#f4f4f4'
                                }}
                            >
                                Carregando...
                            </div>
                        )}
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default FlipBook;
