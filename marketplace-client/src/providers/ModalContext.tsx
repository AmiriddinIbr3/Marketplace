import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isModalActive: boolean;
    isLoginMode: boolean;
    openModal: (mode: 'login' | 'register') => void;
    closeModal: (shouldClose: boolean) => void;
    switchMode: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isModalActive, setModalActive] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const openModal = (mode: 'login' | 'register') => {
        setIsLoginMode(mode === 'login');
        setModalActive(true);
    };

    const closeModal = (shouldClose: boolean) => {
        if (shouldClose) {
            setModalActive(false);
        }
    };

    const switchMode = () => {
        setIsLoginMode(prev => !prev);
    };

    return (
        <ModalContext.Provider value={{ isModalActive, openModal, closeModal, isLoginMode, switchMode }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
};