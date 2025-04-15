import { useEffect, useState, } from 'react'
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
    matchValue?: string;
    multipleOptions?: Dictionary;
    fileType?: string;
}

interface maskState {
    nextState: {
        value: string;
        selection: { start: number; end: number };
    }
}

const InputComponent: React.FC<InputProps> = (props) => {
    const maxFileSizeMB = 1; // in MB
    const [inputValue, setInputValue] = useState(props.value);
    const [dragActive, setDragActive] = useState(false);

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
        <div>
            {
                props.type === 'text' &&
                <input type="text" value={inputValue as string} onChange={inputChangeHandler} />
            }

            {
                props.type === 'integer' &&
                <input type="number" {...props.register!(props.name, rules.integer)}
                    step="1" value={inputValue as number} onChange={inputChangeHandler} />
            }

            {
                props.type === 'decimal' &&
                <input type="number" {...props.register!(props.name, rules.decimal)}
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
                    <input type="text" placeholder='99999-9999' />
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
                    <input type="tel" placeholder='MM/dd/yyyy' />
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
                    <input type="tel" placeholder='(999) 999-9999' />
                </InputMask>
            }

            {
                props.type === 'checkbox' &&
                <input type="checkbox" checked={inputValue as boolean} onChange={inputChangeHandler} />
            }

            {
                props.type === 'password' &&
                <input type="password" {...props.register!(props.name, props.matchValue ? rules.passwordMatch(props.matchValue!) : rules.password)}
                    placeholder='*********' value={inputValue as string} onChange={inputChangeHandler} />
            }

            {
                props.type === 'radio' &&
                <div>
                    {Object.entries(props.multipleOptions!).map(([key, value]) => (
                        <label key={key} className='mr-2'>
                            <input
                                type="radio"
                                value={key}
                                {...props.register!(props.name, rules.radio)}
                                checked={inputValue === key}
                                onChange={inputChangeHandler}
                            />
                            {value}
                        </label>
                    ))}
                </div>
            }

            {props.type === 'file' &&
                <div
                    onClick={() => document.querySelector(`input[name="${props.name}"]`)?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex justify-center items-center h-48 border-2 border-dashed rounded-md p-6 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                    style={{ position: 'relative' }}
                >
                    <input type="file" className='w-[300px]' style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }} accept={props.fileType || 'image/*'}
                        {...props.register!(props.name, rules.file(maxFileSizeMB))} onChange={inputChangeHandler} />
                    <p className="text-gray-700 className='flex-1'">
                        Drag & drop a file here, or click to select.
                    </p>
                </div>
            }

            {props.errors &&
                props.errors[props.name] &&
                <div className='mt-2'>{String(props.errors[props.name]!.message)}</div>
            }

        </div>
    );
}

export default InputComponent