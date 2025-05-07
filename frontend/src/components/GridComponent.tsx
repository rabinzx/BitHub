import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, Bars3Icon, BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/24/solid'

interface GridComponentProps {
    headers: string[];
    rows: Array<Array<string | number>>;
    columnSorting?: { [header: string]: boolean };
    columnWidth?: { [header: string]: string };
    allowPaginaton?: boolean;
    allowPageSizeChange?: boolean;
    pageSize?: number | Array<number>;
    className?: { container?: string, header?: string, cell?: string, footer?: string };
    renderHeaderCell?: (header: string, headerIndex: number) => React.ReactNode;
    renderRow?: (row: Array<string | number>, rowIndex: number) => React.ReactNode;
    renderCell?: (cell: string | number, headerName: string, rowIndex: number, cellIndex: number, row: Array<string | number>) => React.ReactNode;
}

type SortOrder = 'asc' | 'desc' | '';
type SortOrderDict = { [idx: number]: SortOrder };

const GridComponent: React.FC<GridComponentProps> = ({ headers, rows, columnSorting, columnWidth, allowPaginaton, allowPageSizeChange, pageSize, className, renderHeaderCell, renderRow, renderCell }) => {
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
    const pageSizeOptions = useMemo(() => {
        // default array plus user defined page size if it exists.
        // Use Set constructor to remove duplicates, and then sort by the ascending order.
        let defaultPageSize = [10, 20, 50];
        if (Array.isArray(pageSize)) {
            defaultPageSize = [...pageSize]
        } else {
            defaultPageSize = defaultPageSize.concat(pageSize || []);
        }
        return [... new Set(defaultPageSize)].sort((a, b) => a - b);
    }, [pageSize]);

    // Set the current page size based on the provided pageSize prop or default to the first option
    const [currentPageSize, setCurrentPageSize] = useState(
        allowPaginaton ?
            (pageSize && !Array.isArray(pageSize) ? pageSize : pageSizeOptions[0]) :
            rows.length
    );

    // Effect to update the current page size when the pageSize prop or pageSizeOptions change
    useEffect(() => {
        if (allowPaginaton) {
            setCurrentPageSize(pageSize && !Array.isArray(pageSize) ? pageSize : pageSizeOptions[0]);
        } else {
            setCurrentPageSize(rows.length);
        }
    }, [pageSize, pageSizeOptions, allowPaginaton]);

    // State to manage the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages based on the number of rows and page size
    const totalPages = useMemo(() => {
        return Math.ceil(tableRows.length / currentPageSize)
    }, [currentPageSize, tableRows]);

    // Store the default sort order for each column
    const sortOrderDictDefault = useMemo((): SortOrderDict => {
        return Object.fromEntries(tableHeaders.map((_, idx) => [idx, '']))
    }, []);

    // State to manage the sort order of each column
    const [sortOrderDict, setSortOrderDict] = useState<SortOrderDict>(sortOrderDictDefault);

    // Effect to reset the current page when the table rows change
    const currentRows = useMemo(() => {
        return tableRows.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize);
    }, [currentPageSize, currentPage, tableRows]);

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
        setCurrentPageSize(newPageSize);
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
                return <BarsArrowUpIcon className='size-5 inline cursor-pointer' title="Ascending" onClick={() => sortColumn(headerIndex, "desc")} />
            case 'desc':
                return <BarsArrowDownIcon className='size-5 inline cursor-pointer' title='Descending' onClick={() => sortColumn(headerIndex, "")} />
            default:
                return <Bars3Icon className='size-5 inline cursor-pointer' title='Default' onClick={() => sortColumn(headerIndex, "asc")} />
        }
    };


    return (
        <div className={`overflow-x-auto shadow-md rounded-md border bg-background ${className?.container}`} >
            <table className='border-collapse min-w-50 w-full '>
                <colgroup>
                    {tableHeaders.map((header, headerIndex) => (
                        <col key={headerIndex} span={1} className={`${Object.keys(columnWidth || {}).length ? columnWidth![header] : ''}`} />
                    ))}
                </colgroup>
                <thead>
                    <tr className={`bg-background ${className?.header}`}>
                        {tableHeaders.map((header, headerIndex) => (
                            <th key={headerIndex} className={`border rounded-lg p-2`}>
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
                        // allow the parent to use default settings if renderRow(row, rowIndex) returns null
                        (renderRow && renderRow(row, rowIndex)) ??
                        <tr key={rowIndex} className={`bg-background text-text hover:bg-blue-100 transition-colors duration-200 ${className?.cell}`}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className='border p-2 overflow-x-auto'>
                                    {renderCell ? renderCell(cell, tableHeaders[cellIndex], rowIndex, cellIndex, row) : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                {allowPaginaton &&
                    <tfoot className='text-sm'>
                        <tr className={`bg-blue-100 ${className?.footer}`}>
                            <td className='border p-2' colSpan={columnCount}>
                                <div className='flex justify-end items-center gap-4'>
                                    {allowPageSizeChange &&
                                        <div>
                                            <label htmlFor="pageSize" className='mr-2'>rows per page:</label>
                                            <select value={currentPageSize} onChange={pageSizeHandler} className='border p-1 rounded'>
                                                {pageSizeOptions.map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                    }
                                    <div>
                                        {(currentPage - 1) * currentPageSize + 1} to {Math.min(currentPage * currentPageSize, tableRows.length)} of {tableRows.length} items
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
                }
            </table>
        </div>
    );
};

export default GridComponent;