import { useState } from "react";
import InputComponent from "../components/InputComponent";
import { useForm } from "react-hook-form";

const MainCanvas = () => {
    const [person, setPerson] = useState({
        firstName: 'John',
        age: 30,
        heightInFeet: 5.9,
        zip: '12345-6789',
        dob: '01/01/1990',
        phone: '(123) 456-7890',
    });

    const updatePerson = (key: string, value: string | number) => {
        setPerson((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    }

    const onSubmit = (data: any) => {
        console.log("Form data:", data);
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    return (
        <div className="flex flex-col items-center justify-center g-gray-100">
            <h1 className="text-3xl font-bold mb-4">Main Canvas</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="mt-2">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: Text</label>
                    <div>
                        <InputComponent type="text" value={person.firstName} onChange={(_firstName) => updatePerson('firstName', _firstName)} />
                        <p className="text-xl">First Name: {person.firstName}</p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: Integer</label>
                    <div>
                        <InputComponent type="integer" value={String(person.age)} onChange={(_age) => updatePerson('age', _age)} />
                        <p className="text-xl">Age: {person.age}</p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: decimal</label>
                    <div>
                        <InputComponent type="decimal" value={person.heightInFeet} onChange={(_heightInFeet) => updatePerson('heightInFeet', _heightInFeet)} />
                        <p className="text-xl">Height (ft): {person.heightInFeet}</p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: zip</label>
                    <div>
                        <InputComponent type="zip" value={person.zip} onChange={(_zip) => updatePerson('zip', _zip)} />
                        <p className="text-xl">Zip: {person.zip}</p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: date</label>
                    <div>
                        <InputComponent type="date" register={register} error={errors.date?.message} name="date" value={person.dob} onChange={(_dob) => updatePerson('dob', _dob)} />
                        <p className="text-xl">DOB: {person.dob}</p>
                    </div>
                </div>

                <div className="mt-4">
                    {/* Input Component */}
                    <label htmlFor="" className="text-xl font-bold">Input Type: phone</label>
                    <div>
                        <InputComponent type="phone" register={register} error={errors.phone?.message} name="phone" value={person.phone} onChange={(_phone) => updatePerson('phone', _phone)} />
                        <p className="text-xl">Phone: {person.phone}</p>
                    </div>
                </div>

                <button type="submit">Submit</button>
            </form>

        </div>
    );
};

export default MainCanvas;