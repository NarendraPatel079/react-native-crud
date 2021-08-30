import { createContext } from "react";

// Credentials Context
export const CredentialsContext = createContext({
    storeCredentials: {},
    setStoreCredentials: () => {}
});