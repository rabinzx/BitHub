import React from 'react';

interface CardComponentProps {
    title: string | React.ReactNode;
    children: React.ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({ title, children }) => {
    return (
        <div className="flex flex-col border border-border rounded-lg shadow-lg bg-background hover:shadow-xl transition-shadow duration-300">
            <h2 className="border-b-2 p-2 border-border">{title}</h2>
            <div className="p-2">{children}</div>
        </div>
    );
};

export default CardComponent;