import { useEffect, useState, } from 'react'
import InputMask from "@mona-health/react-input-mask";
import { FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormRegister } from "react-hook-form";

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

    const phoneRule = {
        required: "Phone number is required",
        pattern: {
            value: /^\(\d{3}\)\s\d{3}-\d{4}$/,
            message: "Invalid phone format",
        },
    }

    const dateRule = {
        required: "Date is required",
        pattern: {
            value: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/,
            message: "Invalid date format (MM/dd/yyyy)",
        }
    }


    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);

        if (typeof props.value === "number") {
            if (props.type === 'integer') {
                props.onChange(parseInt(event.target.value, 10));
            } else if (props.type === 'decimal') {
                props.onChange(parseFloat(event.target.value));
            }
            return;
        }

        props.onChange(event.target.value); // Call the onChange prop with the new value        
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
                <InputMask
                    mask="999"
                    value={inputValue}
                    onChange={inputChangeHandler}
                />
            }

            {
                props.type === 'decimal' &&
                <input type='number' value={inputValue} onChange={inputChangeHandler} step="any" />
            }

            {
                props.type === 'zip' &&
                <InputMask
                    mask="99999-9999"
                    value={inputValue}
                    onChange={inputChangeHandler}
                    beforeMaskedStateChange={beforeMaskedStateChange}
                />
            }

            {
                props.type === 'date' &&
                <div>
                    <InputMask
                        mask="99/99/9999"
                        {...props.register!(props.name!, dateRule)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    />
                    {props.error && <p>{String(props.error)}</p>}
                </div>
            }

            {
                props.type === 'phone' &&
                <div>
                    <InputMask
                        mask="(999) 999-9999"
                        {...props.register!(props.name!, phoneRule)}
                        value={inputValue}
                        onChange={inputChangeHandler}
                    />
                    {props.error && <p>{String(props.error)}</p>}
                </div>

            }
        </>
    );
}

export default InputComponent