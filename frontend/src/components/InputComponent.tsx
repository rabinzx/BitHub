import { useEffect, useState, } from 'react'
import InputMask from "@mona-health/react-input-mask";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Use customParseFormat plugin to parse "02/29/2023" as a invalid date
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

interface Dictionary {
    [key: string]: string | number;
}

interface InputProps {
    type: string;
    value: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
    register?: UseFormRegister<FieldValues>;
    errors?: FieldErrors<FieldValues>;
    name: string;
    matchValue?: string;
    multipleOptions?: Dictionary;
}

interface maskState {
    nextState: {
        value: string;
        selection: { start: number; end: number };
    }
}
const InputComponent: React.FC<InputProps> = (props) => {
    const [inputValue, setInputValue] = useState(props.value);

    const formRuleInteger = {
        required: "This field is required",
        pattern: {
            value: /^-?\d+$/, // matches positive or negative integers
            message: "Must be a valid integer",
        },
    }

    const formRuleDecimal = {
        required: "This field is required",
        validate: (value: string) => {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
                return "Must be a valid number";
            }
        }
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

    const formPasswordRule = {
        required: "This field is required",
        validate: (value: string) => {
            if (props.matchValue && value !== props.matchValue) {
                return "Password does not match";
            }
        }
    };

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

        setInputValue(tempVal);
        props.onChange(tempVal);
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
                <input type="number" {...props.register!(props.name, formRuleInteger)}
                    step="1" value={inputValue as number} onChange={inputChangeHandler} />
            }

            {
                props.type === 'decimal' &&
                <input type="number" {...props.register!(props.name, formRuleDecimal)}
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
                    {...props.register!(props.name, formRuleDate)}
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
                    {...props.register!(props.name, formRulePhone)}
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
                <input type="password" {...props.register!(props.name, formPasswordRule)}
                    placeholder='*********' value={inputValue as string} onChange={inputChangeHandler} />
            }

            {
                props.type === 'radio' &&
                <div>
                    {Object.entries(props.multipleOptions!).map(([key, value]) => (
                        <label key={key}>
                            <input
                                type="radio"
                                value={key}
                                name={props.name}
                                checked={inputValue === key}
                                onChange={inputChangeHandler}
                            />
                            {value}
                        </label>
                    ))}

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