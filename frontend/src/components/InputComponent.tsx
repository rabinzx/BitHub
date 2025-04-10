import { useEffect, useState, } from 'react'
import InputMask from "@mona-health/react-input-mask";
import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister } from "react-hook-form";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Use customParseFormat plugin to parse "02/29/2023" as a invalid date
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

interface ButtonProps {
    type: string;
    value: string | number;
    onChange: (value: string | number) => void;
    register?: UseFormRegister<FieldValues>;
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    name?: string;
}

interface maskState {
    nextState: {
        value: string;
        selection: { start: number; end: number };
    }
}
const InputComponent: React.FC<ButtonProps> = (props) => {
    const [inputValue, setInputValue] = useState(props.value || '');

    const formRuleInteger = {
        required: "This field is required",
        pattern: {
            value: /^-?\d+$/, // matches positive or negative integers
            message: "Must be a valid integer",
        },
    }

    const formRulePhone = {
        required: "Phone number is required",
        pattern: {
            value: /^\(\d{3}\)\s\d{3}-\d{4}$/,
            message: "Invalid phone format",
        },
    }

    const formRuleDate = {
        required: "Date is required",
        validate: (value: string) => {
            const format = "MM/DD/YYYY";
            const parsed = dayjs(value, format, true); // strict parsing

            if (!parsed.isValid()) {
                return "Invalid date format or value";
            }

            const minDate = dayjs("01/01/1900", format);
            const maxDate = dayjs("12/31/2200", format);

            if (!parsed.isBetween(minDate, maxDate, null, '[]')) {
                return "Date must be between 01/01/1900 and 12/31/2200";
            }

            return true;
        }
    };

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tempVal: number | string = event.target.value;

        if (typeof props.value === "number") {
            if (props.type === 'integer') {
                tempVal = parseInt(event.target.value, 10)
            } else if (props.type === 'decimal') {
                tempVal = Number(parseFloat(event.target.value).toFixed(2));
            }
        }
        setInputValue(tempVal);
        props.onChange(tempVal);
    };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     console.log('Submitted value:', inputValue);
    //     // Here you can add logic to send the input value to the server or perform any other action
    // };

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
        // <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4"></form>
        <>

            {
                props.type === 'text' &&
                <input type="text" value={inputValue} onChange={inputChangeHandler} />
            }

            {
                props.type === 'integer' &&
                <div>
                    <input type="number" {...props.register!(props.name!, formRuleInteger)} step="1" value={inputValue} onChange={inputChangeHandler} />
                    {props.error && <p>{String(props.error)}</p>}
                </div>
            }

            {
                props.type === 'decimal' &&
                <div>
                    <input type="number" {...props.register!(props.name!, formRuleInteger)} step="0.01" value={inputValue} onChange={inputChangeHandler} />
                    {props.error && <p>{String(props.error)}</p>}
                </div>
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
                <div>
                    <InputMask
                        mask="99/99/9999"
                        {...props.register!(props.name!, formRuleDate)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    >
                        <input type="tel" placeholder='MM/dd/yyyy' />
                    </InputMask>
                    {props.error && <p>{String(props.error)}</p>}
                </div>
            }

            {
                props.type === 'phone' &&
                <div>
                    <InputMask
                        mask="(999) 999-9999"
                        {...props.register!(props.name!, formRulePhone)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    >
                        <input type="tel" placeholder='(999) 999-9999' />
                    </InputMask>
                    {props.error && <p>{String(props.error)}</p>}
                </div>

            }
        </>
    );
}

export default InputComponent