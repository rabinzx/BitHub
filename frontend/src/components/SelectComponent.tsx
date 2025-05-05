import React, { use, useEffect, useMemo, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import InputComponent from './InputComponent';

type ReturnValueType = string | number | boolean;

interface SelectComponentProps {
    // value: ReturnValueType | Array<ReturnValueType>;
    options: Array<{ label: string; value: string }>;
    placeholder?: string;
    disabled?: boolean;
    maxDisplayItems?: number;
    // error?: boolean;
    // errorMessage?: string;
    allowMultiple?: boolean;
    className?: string;
    onChange: (value: string | Array<string>) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ options, placeholder, disabled, maxDisplayItems, allowMultiple, className, onChange }) => {
    // state to manage select-all checkbox
    const [selectedAll, setSelectedAll] = React.useState(false);

    // state to manage a list of indexes of selected items
    const [selectedItemIndexes, setSelectedItemIndexes] = React.useState<Array<number>>([]);

    // Array of booleans to track checked state of each option
    const [optionsChecked, setOptionsChecked] = React.useState<Array<boolean>>(new Array(options.length).fill(false));

    // Default to 3 if not provided
    const [maxDisplayItemsState] = React.useState<number>(maxDisplayItems || 3);

    const [displayDropdown, setDisplayDropdown] = React.useState(false);

    const mainContainerRef = useRef<HTMLDivElement>(null);

    // Computed property for the labels of selected items
    const selectedItemLabels = useMemo(() => {
        return selectedItemIndexes.map((index) => (options[index].label)).join(', ');
    }, [selectedItemIndexes]);

    // Register handleClickOutside event listener to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (mainContainerRef.current && !mainContainerRef.current.contains(event.target as Node)) {
                setDisplayDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const listItemSelectedHandler = (idx: number, isChecked: boolean) => {
        if (allowMultiple) {
            // Update the selectedItemIndexes state based on the checkbox state
            let updatedSelectedItemIndexes = [...selectedItemIndexes];
            if (isChecked) {
                if (!selectedItemIndexes.includes(idx)) {
                    updatedSelectedItemIndexes = [...selectedItemIndexes, idx];
                }
            } else {
                updatedSelectedItemIndexes = selectedItemIndexes.filter(index => index !== idx);
            }
            setSelectedItemIndexes(updatedSelectedItemIndexes);

            // Pass the value to the parent component
            onChange(updatedSelectedItemIndexes.map(index => options[index].value));

            // Update the checkbox state
            const _optionsChecked = [...optionsChecked];
            _optionsChecked[idx] = isChecked
            setOptionsChecked(_optionsChecked);
        } else {
            // Update the selectedItemIndexes state based on the checkbox state
            setSelectedItemIndexes([idx]);

            // Pass the value to the parent component
            onChange(options[idx].value);

            // Update the checkbox state
            setOptionsChecked(options.map((_, index) => index === idx ? isChecked : false));
        }

    };

    const selectAllHandler = (isChecked: boolean) => {
        setSelectedAll(isChecked);
        // Update the selectedItemIndexes state based on the checkbox state
        setSelectedItemIndexes(isChecked ? options.map((_, index) => index) : []);
        // Pass the value to the parent component
        onChange(isChecked ? options.map((obj) => obj.value) : []);
        // Update the checkbox state
        setOptionsChecked(new Array(options.length).fill(isChecked));
    }

    // // Update the selectedAll state based on the selectedItemIndexes state
    // useEffect(() => {
    //     setSelectedAll(selectedItemIndexes.length === options.length)
    // }, [selectedItemIndexes]);


    return (
        <div
            className={`relative border rounded-md shadow-md h-10 min-w-50 p-2 w-full flex justify-between items-center bg-background text-left ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} `}
            onClick={(e) => e.stopPropagation()}
            ref={mainContainerRef}
        >
            <div className="hidden">
                <input type="text" name="" id="" />
            </div>
            <div className='flex-1' onClick={() => setDisplayDropdown(!displayDropdown)}>
                {
                    selectedItemIndexes.length ?
                        <div className="unselectable max-h-lg overflow-hidden">{selectedItemIndexes.length > maxDisplayItemsState ? `${selectedItemIndexes.length} items selected` : selectedItemLabels}</div> :
                        <div className="unselectable text-secondary">{placeholder}</div>
                }
            </div>
            <div>
                {
                    selectedItemIndexes.length > 0 && allowMultiple &&
                    <XMarkIcon className='size-5' onClick={() => selectAllHandler(false)} />
                }
            </div>
            <div>
                <ChevronDownIcon className='size-5' onClick={() => setDisplayDropdown(!displayDropdown)} />
            </div>
            {
                displayDropdown &&
                <div className="absolute border cursor-default rounded-md z-1001 top-10 left-0 w-full bg-background shadow-md">
                    {
                        allowMultiple &&
                        <div className="flex justify-between items-center border-b p-1">
                            <InputComponent type="checkbox" name="selectAll" className={{ container: 'px-2 py-1' }} displayLabel={false} value={selectedAll} onChange={(e) => selectAllHandler(Boolean(e))} />
                            <div className='p-1'>
                                <XMarkIcon className='size-5 cursor-pointer' onClick={() => setDisplayDropdown(false)} />
                            </div>
                        </div>
                    }
                    <div className='max-h-50 p-1 overflow-y-auto' >
                        <ul>
                            {
                                options.map((option, index) => {
                                    return (
                                        <li key={index} className='w-full hover:bg-gray-200 rounded-md'>
                                            <InputComponent type="checkbox"
                                                name={option.label}
                                                value={optionsChecked[index]}
                                                layout='RowReverse'
                                                className={{ container: 'px-2 py-1', label: 'text-[1rem] font-normal flex-1' }}
                                                onChange={(e) => listItemSelectedHandler(index, Boolean(e))} />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
}

export default SelectComponent;