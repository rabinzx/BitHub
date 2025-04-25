import React, { useEffect, useState } from 'react';

interface GridComponentProps {
    headers: string[];
    rows: Array<Array<string | number>>;
    children?: React.ReactNode;
    renderCell?: (cell: string | number, rowIndex: number, cellIndex: number) => React.ReactNode;
}

const GridComponent: React.FC<GridComponentProps> = ({ headers, rows, children, renderCell }) => {
    const [colLength, setColLength] = useState(rows[0]?.length || 0);

    useEffect(() => {
        if (rows.length > 0) {
            setColLength(rows[0].length);
        }
    }, [rows]);

    return (
        <div className='shadow-md'>
            <table className='border-collapse w-full'>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className='border p-2 bg-primary-light text-text'>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className='bg-secondary hover:bg-blue-100 cursor-pointer transition-colors duration-200'>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className='border p-2  text-text '>
                                    {renderCell ? renderCell(cell, rowIndex, cellIndex) : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GridComponent;