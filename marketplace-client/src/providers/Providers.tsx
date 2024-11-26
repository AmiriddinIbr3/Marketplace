'use client';
import { ModalProvider } from "./ModalContext";
import ReactReduxProvider from "./ReactReduxProvider";

import { Provider as ReduxProvider } from 'react-redux';
import { store } from "@/redux";

export default function Providers({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider store={store}>
      <ModalProvider>
        <ReactReduxProvider>
          {children}
        </ReactReduxProvider>
      </ModalProvider>
    </ReduxProvider>
  );
}