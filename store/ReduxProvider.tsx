"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./index";

/**
 * Wrap your root layout with this component.
 *
 * Usage in app/layout.tsx:
 *
 *   import { ReduxProvider } from "@/store/ReduxProvider";
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html><body>
 *         <ReduxProvider>{children}</ReduxProvider>
 *       </body></html>
 *     );
 *   }
 *
 * PersistGate delays rendering until the persisted state has been rehydrated
 * from localStorage, preventing hydration mismatches.
 *
 * The `loading={null}` means nothing is rendered while rehydrating —
 * swap for a <Spinner /> or skeleton if you prefer.
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}