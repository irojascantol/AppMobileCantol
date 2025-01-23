import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { BsArrowLeftSquare, BsArrowRightSquare, BsZoomIn, BsZoomOut } from 'react-icons/bs';

function PDFVisualizer({pdfFile}) {
    const [scale, setScale] = useState(1); // Scale factor for resizing
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1)

    const handleZoomIn = () => setScale(prevScale => prevScale + 0.125);
    const handleZoomOut = () => setScale(prevScale => Math.max(0.125, prevScale - 0.125));

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
    }

    return (
    <div>
        <div className='tw-flex tw-justify-between tw-items-center'>
            <div className='tw-flex tw-gap-3'>
                <button className='button-14 tw-p-2 tw-h-fit' onClick={handleZoomIn}><BsZoomIn size={23}/></button>
                <button className='button-14 tw-p-2 tw-h-fit'  onClick={handleZoomOut}><BsZoomOut size={23}/></button>
            </div>
            <div className='tw-flex tw-items-center'>
                <p className='tw-font-medium tw-my-0'>Página: {pageNumber} de {numPages}</p>
            </div>
            <div className='tw-flex tw-gap-3'>
                <button className='button-14 tw-p-2 tw-h-fit' disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}><BsArrowLeftSquare size={23}/></button>
                <button className='button-14 tw-p-2 tw-h-fit' disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}><BsArrowRightSquare size={23}/></button>
            </div>
        </div>

        <div className='tw-overflow-x-scroll'>
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale} />
        </Document>
        </div>
    </div>
    );
}

export default PDFVisualizer;