import { useEffect, useRef, useState, } from 'react'
import InputMask from "@mona-health/react-input-mask";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import rules, { getFileSizeMB } from '../InputRules';

// Use customParseFormat plugin to parse "02/29/2023" as a invalid date
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

interface Dictionary {
    [key: string]: string | number;
}

interface InputProps {
    type: string;
    value: string | number | boolean | File | null;
    onChange: (value: string | number | boolean) => void;
    register?: UseFormRegister<FieldValues>;
    errors?: FieldErrors<FieldValues>;
    name: string;
    displayLabel?: boolean;
    matchValue?: string;
    multipleOptions?: Dictionary;
    fileType?: string;
    layout?: string;
    containerClass?: string;
}

interface maskState {
    nextState: {
        value: string;
        selection: { start: number; end: number };
    }
}

enum LayoutDirections {
    Col = "flex-col",
    Row = "flex-row",
};

const InputComponent: React.FC<InputProps> = (props) => {
    const maxFileSizeMB = 1; // in MB
    const [inputValue, setInputValue] = useState(props.value);
    const [dragActive, setDragActive] = useState(false);
    const sanatizedName = props.name.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize name to be a valid HTML id
    const layout = props.layout && Object.keys(LayoutDirections).includes(props.layout as LayoutDirections)
        ? LayoutDirections[props.layout as keyof typeof LayoutDirections]
        : LayoutDirections.Row;

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tempVal: number | string | boolean = event.target.value;

        if (props.type === 'integer') {
            tempVal = parseInt(event.target.value, 10)
            if (isNaN(tempVal as number)) return;
        }
        else if (props.type === 'decimal') {
            tempVal = Number(parseFloat(event.target.value).toFixed(2));
            if (isNaN(tempVal as number)) return;
        }
        else if (props.type === 'checkbox') {
            tempVal = event.target.checked;
        }
        else if (props.type === 'file') {

            console.log('file input clicked');

            const file = event.target.files?.[0];
            if (!file) return;
            inputFileHandler(file);
            return;
        }

        setInputValue(tempVal);
        props.onChange(tempVal);
    };

    const inputFileHandler = (file: File) => {
        if (!file) return;

        if (getFileSizeMB(file.size) > maxFileSizeMB) {
            alert(`File size exceeds ${maxFileSizeMB} MB`);
            return;
        }

        const reader = new FileReader();
        // callback function 
        reader.onload = () => {
            setInputValue(reader.result as string);
            props.onChange(reader.result as string);
        };
        reader.onerror = () => {
            alert("File reading failed");
            reader.abort();
        };
        reader.readAsDataURL(file);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) inputFileHandler(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const beforeMaskedStateChange = ({ nextState }: maskState) => {
        let { value } = nextState;
        if (value.endsWith("-")) {
            value = value.slice(0, -1);
        }

        return {
            ...nextState,
            value,
        };
    }

    return (
        <div className={`flex items-center ${layout} ${props.containerClass}`}>
            {
                (props.displayLabel === undefined ? true : props.displayLabel) &&
                <label className={`text-xl font-bold ${layout === LayoutDirections.Col ? 'mb-2' : 'mr-2'}`} htmlFor={sanatizedName}>{props.name}</label>
            }

            <div className={"text-left"}>
                {
                    props.type === 'text' &&
                    <input type="text" id={sanatizedName} value={inputValue as string} onChange={inputChangeHandler} />
                }

                {
                    props.type === 'integer' &&
                    <input type="number" id={sanatizedName} {...props.register!(props.name, rules.integer)}
                        step="1" value={inputValue as number} onChange={inputChangeHandler} />
                }

                {
                    props.type === 'decimal' &&
                    <input type="number" id={sanatizedName} {...props.register!(props.name, rules.decimal)}
                        step="0.01" value={inputValue as number} onChange={inputChangeHandler} />
                }

                {
                    props.type === 'zip' &&
                    <InputMask
                        mask="99999-9999"
                        value={inputValue}
                        onChange={inputChangeHandler}
                        beforeMaskedStateChange={beforeMaskedStateChange}
                    >
                        <input type="text" id={sanatizedName} placeholder='99999-9999' />
                    </InputMask>
                }

                {
                    props.type === 'date' &&
                    <InputMask
                        mask="99/99/9999"
                        {...props.register!(props.name, rules.date)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    >
                        <input type="tel" id={sanatizedName} placeholder='MM/dd/yyyy' />
                    </InputMask>
                }

                {
                    props.type === 'phone' &&
                    <InputMask
                        mask="(999) 999-9999"
                        {...props.register!(props.name, rules.phone)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    >
                        <input type="tel" id={sanatizedName} placeholder='(999) 999-9999' />
                    </InputMask>
                }

                {
                    props.type === 'checkbox' &&
                    <div className="flex gap-2">
                        <input type="checkbox" id={sanatizedName} className="peer relative appearance-none shrink-0 w-4 h-4 border-2 border-blue-300 rounded-sm mt-1 bg-background
                        focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100
                        checked:bg-primary-light checked:border-0
                        disabled:border-steel-400 disabled:bg-steel-400"
                            checked={inputValue as boolean} onChange={inputChangeHandler} />
                        <svg
                            className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block stroke-white outline-none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>

                    </div>
                }

                {
                    props.type === 'password' &&
                    <input type="password" id={sanatizedName} {...props.register!(props.name, props.matchValue ? rules.passwordMatch(props.matchValue!) : rules.password)}
                        placeholder='*********' value={inputValue as string} onChange={inputChangeHandler} />
                }

                {
                    props.type === 'radio' &&
                    <div className='flex gap-2'>
                        {Object.entries(props.multipleOptions!).map(([key, value]) => (
                            <div key={key} className='flex gap-2 items-center'>
                                <input
                                    type="radio"
                                    id={`radio-${props.name}-${key}`}
                                    value={key}
                                    className='appearance-none w-4 h-4 rounded-full bg-background border-2 border-blue-300 checked:bg-primary-light'
                                    {...props.register!(props.name, rules.radio)}
                                    checked={inputValue === key}
                                    onChange={inputChangeHandler}
                                />
                                <label className='mr-2' htmlFor={`radio-${props.name}-${key}`} >
                                    {value}
                                </label>
                            </div>
                        ))}
                    </div>
                }

                {props.type === 'file' &&
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`flex justify-center items-center h-48 border-2 border-dashed rounded-md p-6 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                        style={{ position: 'relative' }}
                    >
                        <input type="file" id={sanatizedName} className='max-w-[90%]' style={{ position: 'absolute', top: '0.5rem' }} accept={props.fileType || 'image/*'}
                            {...props.register!(props.name, rules.file(maxFileSizeMB))} onChange={inputChangeHandler} />
                        <p className="text-secondary">
                            Drag & drop a file here, or click the button to select.
                        </p>
                    </div>
                }

                {props.errors &&
                    props.errors[props.name] &&
                    <div className='mt-2 text-error'>{String(props.errors[props.name]!.message)}</div>
                }
            </div>
        </div>
    );
}

export default InputComponent