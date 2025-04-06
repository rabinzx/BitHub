import { useState } from "react";
import InputComponent from "../components/InputComponent";

const MainCanvas = () => {
    const [firstName, setFirstName] = useState(0 as string | number);

    const [age, setAge] = useState(0 as string | number);

    return (
        <div className="flex flex-col items-center justify-center g-gray-100">
            <h1 className="text-3xl font-bold mb-4">Main Canvas</h1>

            <div className="mt-2">
                {/* Input Component */}
                <label htmlFor="" className="text-xl font-bold">Input Type: Text</label>
                <div>
                    <InputComponent type="text" value={firstName} onChange={(_firstName) => setFirstName(_firstName)} />
                    <p className="text-xl">You typed: {firstName}</p>
                </div>
            </div>

            <div className="mt-4">
                {/* Input Component */}
                <label htmlFor="" className="text-xl font-bold">Input Type: Integer</label>
                <div>
                    <InputComponent type="integer" value={age} onChange={(_age) => setAge(_age)} />
                    <p className="text-xl">You typed: {age}</p>
                </div>
            </div>

            <div className="mt-4">
                {/* Input Component */}
                <label htmlFor="" className="text-xl font-bold">Input Type: decimal</label>
                <div>
                    <InputComponent type="decimal" value={age} onChange={(_age) => setAge(_age)} />
                    <p className="text-xl">You typed: {age}</p>
                </div>
            </div>

            <div className="mt-4">
                {/* Input Component */}
                <label htmlFor="" className="text-xl font-bold">Input Type: zip</label>
                <div>
                    <InputComponent type="zip" value={age} onChange={(_age) => setAge(_age)} />
                    <p className="text-xl">You typed: {age}</p>
                </div>
            </div>


        </div>
    );
};

export default MainCanvas;