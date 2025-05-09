import { useState } from "react";
import InputComponent from "../components/InputComponent";
import CardComponent from "../components/CardComponent";
import { useForm } from "react-hook-form";
import GridComponent from "../components/GridComponent";
import SelectComponent from "../components/SelectComponent";
import rules from "../InputRules";


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

    const cityOptions = [
        { label: 'New York', value: 'newYork' },
        { label: 'Rome', value: 'rome' },
        { label: 'London', value: 'london' },
        { label: 'Paris', value: 'paris' },
        { label: 'Tokyo', value: 'tokyo' },
        { label: 'Sydney', value: 'sydney' },
    ];


    const cityOptions2 = [
        { CityName: 'New York', CityKey: 'newYork', Population: 8_336_817 },
        { CityName: 'Rome', CityKey: 'rome', Population: 2_837_216 },
        { CityName: 'London', CityKey: 'london', Population: 8_982_965 },
        { CityName: 'Paris', CityKey: 'paris', Population: 2_165_423 },
        { CityName: 'Tokyo', CityKey: 'tokyo', Population: 37_393_128 },
        { CityName: 'Sydney', CityKey: 'sydney', Population: 5_312_163 },
    ];

    const [selectedCities, setSelectedCities] = useState<Array<string>>([]);

    const updateCity = (value: any) => {
        if (Array.isArray(value)) {
            console.log("multiple values:", value);
        } else {
            console.log("single value:", value);
        }
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

    const headerTest = ['EmpId', 'EmpName', 'Age', 'Salary'];
    const getRandomIntInclusive = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const rowsTest = Array(35).fill(0).map((_, index) => {
        return [index + 1, 'John', getRandomIntInclusive(20, 60), 100_000];
    });



    return (
        <div className="flex flex-col items-center justify-center g-gray-100">
            <h1 className="text-3xl font-bold mb-4">Main Canvas</h1>
            <SelectComponent options={cityOptions} isComboBox={false} allowMultiple={true} typeToSearch={false}
                comboBoxLabelField="CityName" className="md:w-[25rem] mb-4" maxDropdownHeightInPX={150}
                placeholder="Select Cities" onChange={updateCity} />

            <GridComponent headers={headerTest} rows={rowsTest} allowPageSizeChange={true}
                className={{ container: 'mb-4 w-130', cell: 'even:bg-green-50 odd:bg-blue-50' }}
                columnWidth={{ 'Salary': 'w-[150px]' }}
                allowPaginaton={true}
                renderHeaderCell={(header, headerIndex) => {
                    return <span className="text-blue-500">{header}</span>;
                }}

                columnSorting={{ 'EmpId': true, 'Age': true, 'Salary': true, }}
                renderCell={(cell, headerName) => {
                    switch (headerName) {
                        case 'EmpId':
                            return <span className="text-blue-500">{String(cell)}</span>;
                        case 'EmpName':
                            return <span className="text-green-500">{String(cell)}</span>;
                        case 'Age':
                            return <span className="text-red-500">{Number(cell)}</span>;
                        case 'Salary':
                            return <span className="text-primary">{
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(Number(cell))
                            }</span>;
                        default:
                            return <span>{String(cell)}</span>
                    }
                }}
            />

            <CardComponent title={<div className="text-green-600">Card Title</div>} className="mb-4" >
                <p>This is the content of the card.</p>
                <p className="text-red-600">It can contain any JSX elements.</p>
            </CardComponent>

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
                        <InputComponent type="integer" register={register} rules={rules.integer} errors={errors} name="age"
                            value={person.age} onChange={(_age) => updatePerson('age', _age)} />
                        <p className="text-xl">Age: {person.age}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="decimal" register={register} rules={rules.decimal} errors={errors} name="height"
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
                        <InputComponent type="date" register={register} rules={rules.date} errors={errors} name="date"
                            value={person.dob} onChange={(_dob) => updatePerson('dob', _dob)} />
                        <p className="text-xl">DOB: {person.dob}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="phone" register={register} rules={rules.phone} errors={errors} name="phone"
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
                        <InputComponent type="password" register={register} rules={person.secret ? rules.passwordMatch(person.secret!) : rules.password} errors={errors} name="confirmSecret" matchValue={person.secret}
                            value={person.confirmSecret} onChange={(val) => updatePerson('confirmSecret', val)} />
                        <p className="text-xl">Confirm Secret: {person.confirmSecret}</p>
                    </div>

                    <div className="mt-4">
                        {/* Input Component */}
                        <InputComponent type="radio" register={register} rules={rules.radio} errors={errors} name="gender" multipleOptions={genderOptions}
                            value={person.gender} onChange={(val) => updatePerson('gender', val)} />
                        <p className="text-xl">Gender: {person.gender}</p>
                    </div>

                    <div className="mt-4">
                        {/* create input file upload component */}
                        <InputComponent type="file" register={register} rules={rules.file(5)} errors={errors} name="file" displayLabel={false} value={person.file} onChange={(val) => updatePerson('file', val)} />
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