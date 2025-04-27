import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, Bars3Icon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/solid'

interface GridComponentProps {
    headers: string[];
    rows: Array<Array<string | number>>;
    children?: React.ReactNode;
    columnSorting?: { [header: string]: boolean };
    renderHeaderCell?: (header: string, headerIndex: number) => React.ReactNode;
    renderCell?: (cell: string | number, headerName: string, rowIndex: number, cellIndex: number,) => React.ReactNode;
}

type SortOrder = 'asc' | 'desc' | '';
type SortOrderDict = { [idx: number]: SortOrder };

const GridComponent: React.FC<GridComponentProps> = ({ headers, rows, children, columnSorting, renderHeaderCell, renderCell }) => {
    // State to manage the table headers and rows
    const [tableHeaders, setTableHeaders] = useState(headers);
    useEffect(() => {
        setTableHeaders(headers);
    }, [headers]);

    const [tableRows, setTableRows] = useState(rows);
    useEffect(() => {
        setTableRows(rows);
    }, [rows]);

    // Default page size
    const [pageSize, setPageSize] = useState(10);

    // State to manage the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages based on the number of rows and page size
    const totalPages = useMemo(() => {
        return Math.ceil(tableRows.length / pageSize)
    }, [pageSize, tableRows]);

    // Store the default sort order for each column
    const sortOrderDictDefault = useMemo((): SortOrderDict => {
        return Object.fromEntries(tableHeaders.map((_, idx) => [idx, '']))
    }, []);

    // State to manage the sort order of each column
    const [sortOrderDict, setSortOrderDict] = useState<SortOrderDict>(sortOrderDictDefault);

    // Effect to reset the current page when the table rows change
    const currentRows = useMemo(() => {
        return tableRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [pageSize, currentPage, tableRows]);

    // Get the number of columns in the table
    const columnCount = useMemo(() => {
        return tableRows[0]?.length || 0;
    }, [tableRows]);

    // Function to navigate to a specific page
    const navigateToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Function to handle page size changes
    const pageSizeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value, 10);
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when page size changes
    }

    const sortColumn = (columnIndex: number, newSortOrder: SortOrder) => {
        let sortedRows; // Create a copy of the rows to sort

        switch (newSortOrder) {
            case 'asc':
                sortedRows = [...tableRows].sort((a, b) => {
                    if (a[columnIndex] < b[columnIndex]) {
                        return -1;
                    } else if (a[columnIndex] > b[columnIndex]) {
                        return 1;
                    }
                    return 0;
                });
                break;
            case 'desc':
                sortedRows = [...tableRows].sort((a, b) => {
                    if (a[columnIndex] > b[columnIndex]) {
                        return -1;
                    } else if (a[columnIndex] < b[columnIndex]) {
                        return 1;
                    }
                    return 0;
                });
                break;
            default:
                sortedRows = [...rows]; // Reset to original order
                break;
        }

        // Update the rows with the sorted data
        setTableRows(sortedRows); // Uncomment this line if you want to update the original rows

        // Update the sort order dictionary
        setSortOrderDict({ ...sortOrderDictDefault, [columnIndex]: newSortOrder });

    };

    const displaySortIcon = (headerIndex: number) => {
        switch (sortOrderDict[headerIndex]) {
            case 'asc':
                return <BarsArrowUpIcon className='size-4 inline cursor-pointer' title="Ascending" onClick={() => sortColumn(headerIndex, "desc")} />
            case 'desc':
                return <BarsArrowDownIcon className='size-4 inline cursor-pointer' title='Descending' onClick={() => sortColumn(headerIndex, "")} />
            default:
                return <Bars3Icon className='size-4 inline cursor-pointer' title='Default' onClick={() => sortColumn(headerIndex, "asc")} />
        }
    };


    return (
        <table className='border-collapse min-w-100 w-full shadow-md'>
            <thead>
                <tr>
                    {tableHeaders.map((header, headerIndex) => (
                        <th key={headerIndex} className='border p-2 bg-gray-200'>
                            {renderHeaderCell ? renderHeaderCell(header, headerIndex) : <span>{header}</span>}
                            <span className='ml-2'>
                                {columnSorting && columnSorting[header] && displaySortIcon(headerIndex)}
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {currentRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className='bg-background hover:bg-blue-100 cursor-pointer transition-colors duration-200'>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className='border p-2  text-text '>
                                {renderCell ? renderCell(cell, tableHeaders[cellIndex], rowIndex, cellIndex) : cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot className='text-sm'>
                <tr>
                    <td className='border p-2 bg-[#DEECF9]' colSpan={columnCount}>
                        <div className='flex justify-end items-center gap-4'>
                            {/* <div>
                                {JSON.stringify(sortOrderDict)}
                            </div> */}
                            <div>
                                <label htmlFor="pageSize" className='mr-2'>rows per page:</label>
                                <select value={pageSize} onChange={pageSizeHandler} className='border p-1 rounded'>
                                    {[10, 20, 50].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, tableRows.length)} of {tableRows.length} items
                            </div>
                            <div>
                                <ChevronDoubleLeftIcon className="size-4 inline cursor-pointer" title='First Page' onClick={() => navigateToPage(1)} />
                                <ChevronLeftIcon className="size-4 inline cursor-pointer" title='Last Page' onClick={() => navigateToPage(currentPage - 1)} />
                                <span className='px-2'>page {currentPage} of {totalPages}</span>
                                <ChevronRightIcon className="size-4 inline cursor-pointer" title='Next Page' onClick={() => navigateToPage(currentPage + 1)} />
                                <ChevronDoubleRightIcon className="size-4 inline cursor-pointer" title='Last Page' onClick={() => navigateToPage(totalPages)} />
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};

export default GridComponent;