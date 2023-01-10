import React, { useEffect, useState } from 'react'
import { authApi } from "../../apis/AuthApi";
import { Client, ClientForm } from '../../types/Client';
import { User } from "../../types/User";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({children}: {children: JSX.Element}) => {
    const [path, setPath] = useState('');
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const api = authApi();
    const [usersNameMap, setUsersNameMap] = useState<(string | undefined)[][]>([])
    const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map())

    useEffect(() => {
        validateToken()       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validateToken = async () => {
        const storageData:string|null = localStorage.getItem('authToken');
        if(storageData){
            api.getUser().then((success) => {
                if(success.data.token !== storageData) {
                    setLoggedIn(false)
                }
                else {
                    let user: User = {
                        uid: success.data.uid,
                        nome: success.data.user_name,
                        imgUrl: success.data.imgUrl,
                        acesso: success.data.acesso,
                        cliente: success.data.cliente,
                        clienteUid: success.data.clienteUid,
                        logoUrl: success.data.logoUrl,
                        token: success.data.token
                    }
                    setLoggedIn(true)
                    setUser(user)
                }
            }).then(getUsers)
        }
    }
    
    const setToken = (token: string) => {
        localStorage.setItem('authToken', token);
    }

    const signin = async(email: string, password: string) => {
        let status:number;
        return api.signIn(email, password)
        .then((success) => {
            if(success.status === 202 || success.status === 200) {
                setToken(success.data.token)
                setLoggedIn(true);
            }
            status =  success.status;
        })
        .then(() => {return status})
        .catch((error) => {
            return error.response.status;
        })
    }

    const createClient = async (form: ClientForm) => {
        if(!loggedIn) return null;
        return api.createClient(form).then((success) => {
            return success;
        }).catch(() => {
            return null;
        })
    }

    const getUsers = async () => {
        api.getUsers()
        .then((success: { [uid: string]: User; }) => {
            if(success != null){
                setUsersNameMap(Array.from(Object.entries(success)).map((userObject) => {return [userObject[0], userObject[1].nome]}))
                setUsersMap(new Map<string, User>(Array.from(Object.entries(success)).map((userObject) => {return [userObject[0], userObject[1]]})))
            }
        }).catch((error) => {
            console.log(error)
            return null;
        })
    }

    const updateClient = async(params:any) => {
        if(!loggedIn) return null;
        return api.updateClients(params).then((success) => {
            return success;
        }).catch(() => {
            return null;
        })
    }

    const editClient = async(params:any) => {
        if(!loggedIn) return null;
        return api.editClient(params).then((success) => {
            return success;
        }).catch(() => {
            return null;
        })
    }

    const getProfile = async () => {
        return api.getProfile()
        .then((success) => {
            console.log(success)
            return success;
        })
    }

    const signout = async () => {
        return api.signout().then(() => {
            console.log("signout")
            setLoggedIn(false);
            setUser(null); 
        }).catch((error) => {
            console.log(error);
        })
    }

    const getClients = async() => {
        if(!loggedIn) return null
        return api.getClients().then((success) => {
            return success;
        }).catch(() => {
            return null;
        })
    }

    const setUserClient = async(client: Client) => {
        if(!loggedIn) return null
        let response:number = 0;
        return api.setUserClient(client)
        .then((success) => {
            response = success;
        })
        .then(validateToken)
        .then(() => {
            return response;
        })
        .catch(() => {
            return null;
        })
    }

    return (
        <AuthContext.Provider value={{path, setPath, loggedIn, user, createClient, updateClient, editClient, getProfile, getClients, setUserClient, signin, signout, usersNameMap, usersMap, getUsers}}>
            {children}
        </AuthContext.Provider>
    );
}