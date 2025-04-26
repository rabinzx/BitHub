import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid'

interface GridComponentProps {
    headers: string[];
    rows: Array<Array<string | number>>;
    children?: React.ReactNode;
    renderHeaderCell?: (header: string | number, headerIndex: number) => React.ReactNode;
    renderCell?: (cell: string | number, headerName: string, rowIndex: number, cellIndex: number,) => React.ReactNode;
}

const GridComponent: React.FC<GridComponentProps> = ({ headers, rows, children, renderHeaderCell, renderCell }) => {
    const [pageSize, setPageSize] = useState(10); // Number of rows per page
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.ceil(rows.length / pageSize)
    }, [pageSize, rows]);

    const currentRows = useMemo(() => {
        return rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [pageSize, currentPage, rows]);

    const colLength = useMemo(() => {
        return rows[0]?.length || 0;
    }, [rows]);

    const navigateToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const pageSizeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when page size changes
    }

    return (
        <table className='border-collapse min-w-100 w-full shadow-md'>
            <thead>
                <tr>
                    {headers.map((header, headerIndex) => (
                        <th key={headerIndex} className='border p-2 bg-gray-200'>
                            {renderHeaderCell ? renderHeaderCell(header, headerIndex) : header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {currentRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className='bg-background hover:bg-blue-100 cursor-pointer transition-colors duration-200'>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className='border p-2  text-text '>
                                {renderCell ? renderCell(cell, headers[cellIndex], rowIndex, cellIndex) : cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td className='border p-2 bg-[#DEECF9]' colSpan={colLength}>
                        <div className='flex justify-end items-center gap-4'>
                            <div>
                                <label htmlFor="pageSize" className='mr-2'>Rows per page:</label>
                                <select value={pageSize} onChange={pageSizeHandler} className='border p-1 rounded'>
                                    {[10, 20, 50].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, rows.length)} of {rows.length} items
                            </div>
                            <div>
                                <ChevronDoubleLeftIcon className="size-4 inline cursor-pointer" onClick={() => navigateToPage(1)} />
                                <ChevronLeftIcon className="size-4 inline cursor-pointer" onClick={() => navigateToPage(currentPage - 1)} />
                                <span className='px-2'>page {currentPage} of {totalPages}</span>
                                <ChevronRightIcon className="size-4 inline cursor-pointer" onClick={() => navigateToPage(currentPage + 1)} />
                                <ChevronDoubleRightIcon className="size-4 inline cursor-pointer" onClick={() => navigateToPage(totalPages)} />
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};

export default GridComponent;