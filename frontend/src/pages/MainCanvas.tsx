import { useState } from "react";
import InputComponent from "../components/InputComponent";
import CardComponent from "../components/CardComponent";
import { useForm } from "react-hook-form";
import GridComponent from "../components/GridComponent";


const MainCanvas = () => {
    const [person, setPerson] = useState({
        firstName: 'John',
        age: 30,
        heightInFeet: 5.9,
        zip: '12345-6789',
        dob: '01/01/1990',
        phone: '(123) 456-7890',
        married: false,
        secret: 'sdfj^hGjd&23#s!',
        confirmSecret: '',
        gender: 'male',
        file: null
    });

    const genderOptions = {
        male: 'Male',
        female: 'Female',
        other: 'Other',
    };

    const updatePerson = (key: string, value: string | number | boolean) => {
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

            <div className="mb-4 w-full">
                <GridComponent headers={['EmpId', 'EmpName', 'Age', 'Num']} rows={[[1, 'John sdfasd', 4, 6], [2, 'Jack', 4, 6], [3, 'James', 4, 6]]}
                    renderCell={(cell, rowIndex, cellIndex) => {
                        if (cellIndex === 0) {
                            return <span className="text-blue-500">{cell}</span>;
                        } else if (cellIndex === 1) {
                            return <span className="text-green-500">{cell}</span>;
                        } else if (cellIndex === 2) {
                            return <span className="text-red-500">{cell}</span>;
                        } else {
                            return cell;
                        }
                    }}
                />
            </div>

            <div className="mb-4">
                <CardComponent title={<div className="text-green-600">Card Title</div>}  >
                    <p>This is the content of the card.</p>
                    <p className="text-red-600">It can contain any JSX elements.</p>
                </CardComponent>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full">

                <div className="grid gap-4 justify-around grid-flow-row grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
                    <div className="mt-2">
                        {/* Input Component */}
                        <InputComponent type="text" name="text" value={person.firstName}
                            onChange={(_firstName) => updatePerson('firstName', _firstName)} />
                        <p className="text-xl">First Name: {person.firstName}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="integer" register={register} errors={errors} name="age"
                            value={person.age} onChange={(_age) => updatePerson('age', _age)} />
                        <p className="text-xl">Age: {person.age}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="decimal" register={register} errors={errors} name="height"
                            value={person.heightInFeet} onChange={(_heightInFeet) => updatePerson('heightInFeet', _heightInFeet)} />
                        <p className="text-xl">Height (ft): {person.heightInFeet}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="zip" name="zip" value={person.zip}
                            onChange={(_zip) => updatePerson('zip', _zip)} />
                        <p className="text-xl">Zip: {person.zip}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="date" register={register} errors={errors} name="date"
                            value={person.dob} onChange={(_dob) => updatePerson('dob', _dob)} />
                        <p className="text-xl">DOB: {person.dob}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="phone" register={register} errors={errors} name="phone"
                            value={person.phone} onChange={(_phone) => updatePerson('phone', _phone)} />
                        <p className="text-xl">Phone: {person.phone}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="checkbox" register={register} errors={errors} name="checkbox"
                            value={person.married} onChange={(_marrried) => updatePerson('married', _marrried)} />
                        <p className="text-xl">Married: {+person.married}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="password" register={register} errors={errors} name="secret"
                            value={person.secret} onChange={(val) => updatePerson('secret', val)} />
                        <p className="text-xl">Secret: {person.secret}</p>
                    </div>

                    <div className="mt-4">
                        <InputComponent type="password" register={register} errors={errors} name="confirmSecret" matchValue={person.secret}
                            value={person.confirmSecret} onChange={(val) => updatePerson('confirmSecret', val)} />
                        <p className="text-xl">Confirm Secret: {person.confirmSecret}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="radio" register={register} errors={errors} name="gender" multipleOptions={genderOptions}
                            value={person.gender} onChange={(val) => updatePerson('gender', val)} />
                        <p className="text-xl">Gender: {person.gender}</p>
                    </div>

                    <div className="mt-4">
                        {/* create input file upload component */}
                        <InputComponent type="file" register={register} errors={errors} name="file" displayLabel={false} value={person.file} onChange={(val) => updatePerson('file', val)} />
                        <img className="mt-2" src={person.file ?? undefined} style={{ 'maxHeight': '250px' }} />
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" >Submit</button>
                </div>
            </form>

        </div>
    );
};

export default MainCanvas;