import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "./contexts/Auth/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    // <React.StrictMode>
    //     <AuthProvider>
    //         <BrowserRouter>
    //             <App />
    //         </BrowserRouter>
    //     </AuthProvider>
    // </React.StrictMode>
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
);
reportWebVitals(undefined);
