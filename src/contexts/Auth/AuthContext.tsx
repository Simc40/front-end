import { createContext, Dispatch } from "react";
import { Client, ClientForm } from "../../types/Client";
import { User } from "../../types/User";

export type AuthContextType = {
    path: string;
    setPath: Dispatch<React.SetStateAction<string>>;
    loggedIn: boolean;
    user: User | null;
    createClient: (form: ClientForm) => Promise<any>;
    updateClient: (params:any) => Promise<any>;
    editClient: (params:any) => Promise<any>;
    getProfile: () => Promise<User>;
    getClients: () => Promise<any>;
    setUserClient: (client: Client) => Promise<number | null>;
    signin: (email: string, password: string) => Promise<number>;
    signout: () => Promise<any>;
    usersNameMap: (string | undefined)[][] | [];
    usersMap : Map<string, User>
    getUsers: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>(null!);