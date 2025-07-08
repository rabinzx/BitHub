import react from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../components/InputComponent';
import { useState } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import CardComponent from '@/components/CardComponent';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Login data:", data);
            navigate('/'); // Redirect to home page on success
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CardComponent className="max-w-96 mx-auto mt-10 p-6 bg-white shadow-md rounded-lg" title={<span className="text-2xl font-bold mb-6">Login</span>} >
            <form onSubmit={handleSubmit(onSubmit)} className=''>
                <InputComponent
                    name="Username"
                    type="text"
                    register={register}
                    rules={{ required: 'Password is required' }}
                    errors={errors}
                    value="username"
                    onChange={() => { }}
                    className={{ container: 'mb-4 justify-end' }}
                />
                <InputComponent
                    name="Password"
                    type="password"
                    errors={errors}
                    value="username"
                    onChange={() => { }}
                    className={{ container: 'mb-4 justify-end' }}
                />
                <button
                    type="submit"
                    className={`w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? <LoadingComponent /> : 'Login'}
                </button>
            </form>
        </CardComponent>
    );
}

export default LoginForm;