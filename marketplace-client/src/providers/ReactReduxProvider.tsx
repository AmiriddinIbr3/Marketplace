'use client';
import { store } from "@/redux";
import { Provider } from "react-redux";

export default function ReactReduxProvider({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  );
}