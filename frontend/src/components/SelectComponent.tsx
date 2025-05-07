import React, { use, useEffect, useMemo, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import InputComponent from './InputComponent';
import GridComponent from './GridComponent';
import { set } from 'react-hook-form';

type ReturnValueType = string | number | boolean | object;

interface SelectComponentProps {
    options: Array<{ label: string; value: string } | object>;
    placeholder?: string;
    disabled?: boolean;
    maxDisplayItems?: number;
    allowMultiple?: boolean;
    className?: string;
    maxDropdownHeightInPX?: number;
    isComboBox?: boolean;
    comboBoxLabelField?: string;
    typeToSearch?: boolean;
    onChange: (value: ReturnValueType | Array<ReturnValueType>) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ options, placeholder, disabled, maxDisplayItems, allowMultiple, className, maxDropdownHeightInPX, isComboBox, comboBoxLabelField, typeToSearch, onChange }) => {
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

    const searchBoxRef = useRef<HTMLInputElement>(null);

    const setDisplayDropdownCore = (value: boolean) => {
        if (!disabled) {
            setDisplayDropdown(value);
        }
    };

    // Computed property for the labels of selected items
    const selectedItemLabels = useMemo(() => {
        if (isComboBox) {
            // Default to the first key of the first object in options
            const labelField = comboBoxLabelField && comboBoxLabelField in (options[0] as Record<string, any>) ?
                comboBoxLabelField :
                Object.keys(options[0])[0];
            return selectedItemIndexes.map((index) => ((options[index] as Record<string, any>)[labelField])).join(', ');
        } else {
            return selectedItemIndexes.map((index) => ('label' in options[index] ? options[index].label : '')).join(', ');
        }
    }, [selectedItemIndexes]);

    // Register handleClickOutside event listener to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (mainContainerRef.current &&
                !mainContainerRef.current.contains(event.target as Node)
            ) {
                setDisplayDropdownCore(false);
            }
        };

        if (searchBoxRef.current) {
            searchBoxRef.current.placeholder = 'Type to Search ...';
        }

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
            if (isComboBox) {
                onChange(updatedSelectedItemIndexes.map(index => options[index]));
            } else {
                onChange(updatedSelectedItemIndexes.map(index => {
                    const option = options[index];
                    return 'value' in option ? option.value : null;
                }));
            }

            // Update the checkbox state
            const _optionsChecked = [...optionsChecked];
            _optionsChecked[idx] = isChecked
            setOptionsChecked(_optionsChecked);
        } else {
            // Update the selectedItemIndexes state based on the checkbox state
            setSelectedItemIndexes([idx]);

            // Pass the value to the parent component
            if (isComboBox) {
                onChange(options[idx]);
            } else {
                onChange('value' in options[idx] ? options[idx].value : '');
            }

            // Update the checkbox state, set the selected item to true and others to false
            setOptionsChecked(options.map((_, index) => index === idx));

            setDisplayDropdownCore(false);
        }
    };

    const selectAllHandler = (isChecked: boolean) => {
        setSelectedAll(isChecked);
        // Update the selectedItemIndexes state based on the checkbox state
        setSelectedItemIndexes(isChecked ? options.map((_, index) => index) : []);
        // Pass the value to the parent component
        if (isComboBox) {
            onChange(isChecked ? options : []);
        } else {
            onChange(isChecked ? options.map((obj) => 'value' in obj ? obj.value : '') : []);
        }
        // Update the checkbox state
        setOptionsChecked(new Array(options.length).fill(isChecked));
    }

    // Update the selectedAll state based on the selectedItemIndexes state
    useEffect(() => {
        setSelectedAll(selectedItemIndexes.length === options.length)
    }, [selectedItemIndexes]);

    const [searchText, setSearchText] = React.useState<string>('');

    const updateSearchText = (value: string | number | boolean) => {
        const _val = String(value);
        setSearchText(_val);
    }

    return (
        <div
            className={`relative border rounded-md shadow-md h-10 min-w-50 p-2 w-full flex justify-between items-center bg-background text-left ${disabled ? 'cursor-not-allowed' : ''} ${disabled && 'border-gray-400  bg-gray-200'} ${className}`}
            onClick={(e) => e.stopPropagation()}
            ref={mainContainerRef}
        >
            <div className="hidden">
                <input type="text" name="" id="" />
            </div>
            <div className='flex-1 cursor-pointer' onClick={() => setDisplayDropdownCore(true)}>
                {
                    typeToSearch &&
                    <InputComponent type="text"
                        name='selectComponentSearchBox'
                        ref={searchBoxRef}
                        value={searchText}
                        displayLabel={false}
                        className={{ container: displayDropdown ? '' : 'h-0 w-0 opacity-0', input: '!border-none focus:border-none focus:outline-none' }}
                        onChange={updateSearchText} />
                }
                <div className={typeToSearch && displayDropdown ? 'hidden' : ''}>
                    {
                        selectedItemIndexes.length ?
                            <div className="unselectable max-h-lg overflow-hidden">{selectedItemIndexes.length > maxDisplayItemsState ? `${selectedItemIndexes.length} items selected` : selectedItemLabels}</div> :
                            <div className="unselectable text-secondary">{placeholder}</div>
                    }
                </div>
            </div>
            <div>
                {
                    selectedItemIndexes.length > 0 && allowMultiple &&
                    <XMarkIcon className='size-5 cursor-pointer' onClick={() => selectAllHandler(false)} />
                }
            </div>
            <div>
                <ChevronDownIcon className='size-5 cursor-pointer' onClick={() => setDisplayDropdownCore(!displayDropdown)} />
            </div>
            {
                displayDropdown &&
                <div className="absolute border rounded-md z-1001 top-10 left-0 w-full bg-background shadow-md">
                    {
                        allowMultiple &&
                        <div className="flex justify-between items-center border-b p-1">
                            <InputComponent type="checkbox" name="selectAll" className={{ container: 'px-2 py-1' }} displayLabel={false} value={selectedAll} onChange={(e) => selectAllHandler(Boolean(e))} />
                            <div className='p-1'>
                                <XMarkIcon className='size-5 cursor-pointer' onClick={() => setDisplayDropdownCore(false)} />
                            </div>
                        </div>
                    }
                    <div className={`max-h-${maxDropdownHeightInPX ?? '50'} ${!isComboBox && 'p-1'} overflow-y-auto`} >
                        {
                            !isComboBox ? (
                                <ul>
                                    {
                                        options.map((option, index) => {
                                            if ('label' in option && option.label.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                                                return null
                                            }

                                            return (
                                                <li key={index} className='w-full hover:bg-gray-200 rounded-md'>
                                                    <InputComponent type="checkbox"
                                                        name={'label' in option ? option.label : ''}
                                                        value={optionsChecked[index]}
                                                        layout='RowReverse'
                                                        className={{ container: 'px-2 py-1', label: 'text-[1rem] font-normal flex-1', input: (allowMultiple ? '' : 'hidden') }}
                                                        onChange={() => listItemSelectedHandler(index, !optionsChecked[index])} />
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            ) :
                                (
                                    <GridComponent
                                        headers={allowMultiple ? ['', ...Object.keys(options[0])] : Object.keys(options[0])}
                                        rows={options.map((option) => allowMultiple ? ['', ...Object.values(option)] : Object.values(option))}
                                        className={{
                                            container: `text-sm ${allowMultiple ? 'rounded-none' : 'rounded-md'} border-none`, cell: ''
                                        }}
                                        renderRow={(row, rowIndex) => {
                                            if (JSON.stringify(row).indexOf(searchText.toLowerCase()) === -1) {
                                                return false // skip the row
                                            }
                                            return null // fallback to use default settings
                                        }}
                                        renderCell={(cell, headerName, rowIndex) => {
                                            if (headerName === '') {
                                                return (
                                                    <InputComponent type="checkbox"
                                                        name={String(cell)}
                                                        value={optionsChecked[rowIndex]}
                                                        className={{ container: '' }}
                                                        onChange={() => listItemSelectedHandler(rowIndex, !optionsChecked[rowIndex])} />
                                                )
                                            } else {
                                                return (
                                                    <span className="text-sm font-normal cursor-pointer"
                                                        onClick={() => listItemSelectedHandler(rowIndex, !optionsChecked[rowIndex])}>
                                                        {cell}
                                                    </span>
                                                )
                                            }
                                        }} />
                                )}
                    </div>
                </div>
            }
        </div>
    );
}

export default SelectComponent;