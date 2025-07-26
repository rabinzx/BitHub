import React from 'react';

interface LoadingComponentProps {
    visibility?: boolean;
    title?: string;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ visibility = true, title }) => {

    return (
        <>
            {visibility &&
                <div className={`fixed inset-0 bg-[rgba(0,0,0,0.1)] z-50 overflow-hidden`}>
                    <div className='flex flex-col justify-center items-center h-screen '>
                        <div className="w-16 h-16 border-4 border-blue-500!
                        border-t-transparent! rounded-full 
                        animate-spin" />
                        {title ?? <span>Loading...</span>}
                    </div>
                </div>}
        </>
    );
}

export default LoadingComponent;