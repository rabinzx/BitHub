import { useEffect, useState, } from 'react'
import InputMask from "@mona-health/react-input-mask";


interface ButtonProps {
    type: string;
    value: string | number;
    onChange: (value: string | number) => void;
}

interface maskState {
    nextState: {
        value: string;
        selection: { start: number; end: number };
    }
}
const InputComponent: React.FC<ButtonProps> = (props) => {
    const [inputValue, setInputValue] = useState(props.value || '');

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
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
                    mask="99999999999"
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
        </>
    );
}

export default InputComponent