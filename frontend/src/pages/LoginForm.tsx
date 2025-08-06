import react from 'react';
import { set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../components/InputComponent';
import { useState } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import CardComponent from '@/components/CardComponent';
import axiosInstance from '@/api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, clearUserInfo } from '@/store/authSlice';
import { RootState } from '@/store/store';
import dayjs from 'dayjs';

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [authMessage, setAuthMessage] = useState("");

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const loginHandler = () => {
        return axiosInstance.post('/auth/login', loginData)
            .then(r => {
                if (r.data) {
                    const data = r.data;
                    if (data.result === 'success') {
                        const { access_token, expires_in } = data.resultData;
                        const _userInfo = {
                            access_token: access_token,
                            expires_in: dayjs().add(expires_in, 'seconds').toISOString(),
                        };
                        dispatch(setUserInfo(_userInfo));
                        setAuthMessage(""); // Clear any previous error message
                        // Optionally redirect to home page or dashboard
                        navigate('/main'); // Redirect to home page on success
                    } else {
                        setAuthMessage(data.externalMessage || "Login failed"); // Show error message from API
                    }
                }
            });
    }

    const registerHandler = () => {
        axiosInstance.get('/auth/logintest').then(r => {
            console.log("Test login successful:", r.data);
        })

    }

    const onSubmit = () => {
        setLoading(true);
        loginHandler().then(() => {
            setLoading(false);
        });
    };

    return (
        <CardComponent className="max-w-96 mx-auto mt-10 p-6 shadow-md rounded-lg" title={<span className="text-2xl font-bold mb-6">Login</span>} >
            <LoadingComponent visibility={loading} />
            <form onSubmit={handleSubmit(onSubmit)} className=''>
                <InputComponent
                    name="Username"
                    type="text"
                    register={register}
                    rules={{ required: 'Username is required', minLength: { value: 6, message: 'Username must be at least 6 characters' } }}
                    errors={errors}
                    value={loginData.username}
                    onChange={(val) => { setLoginData({ ...loginData, username: val as string }) }}
                    className={{ container: 'mb-4 justify-end' }}
                />
                <InputComponent
                    name="Password"
                    type="password"
                    register={register}
                    rules={{ required: 'Password is required', minLength: { value: 12, message: 'Password must be at least 12 characters' } }}
                    errors={errors}
                    value={loginData.password}
                    onChange={(val) => { setLoginData({ ...loginData, password: val as string }) }}
                    className={{ container: 'mb-4 justify-end' }}
                />
                <div className='my-2'>
                    <button
                        type="submit"
                        className={`w-full py-2 text-white bg-primary rounded hover:bg-hover! ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        Login
                    </button>
                </div>
                <div className='my-2'>
                    <button
                        type="button"
                        className={`w-full py-2 text-white bg-primary rounded hover:bg-hover! ${'opacity-50 cursor-not-allowed'}`}
                        disabled
                        onClick={registerHandler}
                    >
                        New User? Register
                    </button>
                </div>
                {authMessage.length > 0 &&
                    <div className='mt-4'>
                        <label className='py-2 bg-warning p-2 rounded-md'>
                            {authMessage}
                        </label>
                    </div>
                }

            </form>
        </CardComponent>
    );
}

export default LoginForm;