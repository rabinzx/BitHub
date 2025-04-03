import { useEffect, useState, } from 'react'


interface ButtonProps {
    inputType: string;
    inputValue: string | number;
    onChange: (value: string | number) => void;
}


const InputComponent: React.FC<ButtonProps> = (props) => {
    const [inputValue, setInputValue] = useState(props.inputValue || '');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        props.onChange(event.target.value); // Call the onChange prop with the new value        
    };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     console.log('Submitted value:', inputValue);
    //     // Here you can add logic to send the input value to the server or perform any other action
    // };

    return (
        // <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4"></form>
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-2 mb-4"
            placeholder="Type something..."
        />
    );
}

export default InputComponent