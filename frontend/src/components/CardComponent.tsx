import React from 'react';

interface CardComponentProps {
    title: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, children, className }) => {
    return (
        <div className={`flex flex-col border rounded-md shadow-md bg-background hover:shadow-xl transition-shadow duration-300 ${className}`}>
            <h2 className="border-b-2 p-2 ">{title}</h2>
            <div className="p-2">{children}</div>
        </div>
    );
};

export default CardComponent;