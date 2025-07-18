import React, { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Define o worker corretamente
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function FlipBook({ pdfPath }) {
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                console.log("📄 Iniciando carregamento do PDF:", pdfPath);

                const loadingTask = pdfjsLib.getDocument(pdfPath);
                const pdf = await loadingTask.promise;

                console.log("✅ PDF carregado com sucesso.");
                console.log("📚 Total de páginas:", pdf.numPages);

                const renderedPages = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    console.log(`🔄 Renderizando página ${i}...`);

                    const page = await pdf.getPage(i);
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

                    console.log(`✅ Página ${i} renderizada com sucesso.`);
                    renderedPages.push(canvas.toDataURL());
                }

                console.log("✅ Todas as páginas renderizadas.");
                setPages(renderedPages);
            } catch (error) {
                console.error("❌ Erro ao carregar ou renderizar o PDF:", error);
            }
        };

        loadPDF();
    }, [pdfPath]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HTMLFlipBook width={600} height={800}>
                {pages.map((src, index) => (
                    <div key={index} className="page">
                        <img
                            src={src}
                            alt={`Página ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default FlipBook;
