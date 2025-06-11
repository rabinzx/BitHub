import React, { useEffect, useMemo, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ViewSize } from '@/types';
import { createPortal } from 'react-dom';

interface ModalComponentProps {
    displayModal: boolean;
    modalSize: ViewSize;
    hasBackdrop?: boolean;
    displayXmark?: boolean;
    title?: string;
    children: React.ReactNode;
    renderHeader?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
    submitHandler?: () => void;
    cancelHandler?: () => void;
    modalCloseHandler?: () => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ displayModal, modalSize, hasBackdrop, displayXmark, title, children, renderHeader, renderFooter, cancelHandler, submitHandler, modalCloseHandler }) => {
    const modalRoot = document.getElementById('modal-root');

    const getViewportCenter = (): { x: number, y: number } => {
        return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    };

    const modalSizes: Record<string, { width: number; height: number }> = {
        sm: { width: 300, height: 300 },
        md: { width: 500, height: 500 },
        lg: { width: 700, height: 700 },
        xl: { width: 900, height: 900 },
    };

    // default 50% dvh, dvw
    const [position, setPosition] = useState(getViewportCenter());
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const [displayModalState, setDisplayModalState] = useState(displayModal);
    useEffect(() => {
        setDisplayModalState(displayModal);
    }, [displayModal])

    const displayXmarkState = useMemo(() => displayXmark ?? true, [displayXmark]);
    const modalSizeState = useMemo(() => modalSizes[modalSize], [modalSize]);

    // record the offset x and y in pixels
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    // add windows event to update position x and y when the modal is being dragged
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        // cleanup function
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);

    // reset modal to viewport center when the window is resized
    useEffect(() => {
        window.addEventListener("resize", () => { setPosition(getViewportCenter()) });

        return () => {
            window.removeEventListener("resize", () => { setPosition(getViewportCenter()) });
        };
    }, []);

    const closeModal = () => {
        setDisplayModalState(false);
        modalCloseHandler && modalCloseHandler();
    };

    return (
        createPortal(
            <>
                {
                    displayModalState &&
                    <div className={`fixed inset-0 ${hasBackdrop && 'bg-[rgba(0,0,0,0.2)]'} z-50 overflow-hidden`}>
                        <div
                            className={`flex flex-col shadow-md rounded-md overflow-hidden bg-background`}
                            style={{
                                width: `${modalSizeState.width}px`,
                                height: `${modalSizeState.height}px`,
                                position: 'absolute',
                                top: position.y,
                                left: position.x,
                                transform: 'translateX(-50%) translateY(-50%)',
                            }}
                        >
                            <div className='basis-10 border-b unselectable p-2 flex justify-between'
                                style={{
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                {
                                    renderHeader ?
                                        renderHeader() :
                                        <>
                                            <span>{title}</span>
                                            {
                                                displayXmarkState &&
                                                <XMarkIcon className='size-5 cursor-pointer' onClick={closeModal} />
                                            }
                                        </>
                                }
                            </div>
                            <div className='flex-1 flex px-2'>
                                {children}
                            </div>
                            <div className='basis-10 border-t flex justify-end items-center gap-4 p-2'>
                                {
                                    renderFooter ?
                                        renderFooter() :
                                        <>
                                            <button type='button' onClick={() => { cancelHandler ? cancelHandler() : closeModal() }}>Cancel</button>
                                            <button type='button' onClick={submitHandler}>Submit</button>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                }
            </>, modalRoot!
        )
    );
};

export default ModalComponent;