import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { RecoverPassword } from "./pages/RecoverPassword/RecoverPassword";
import { Home } from "./pages/Home/Home";
import { SelectClient } from "./pages/SelectClient/SelectClient";
import { RequireAuth } from "./contexts/Auth/RequireAuth";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Profile } from "./pages/Profile/Profile";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import { Clients } from "./pages/Clients/Clients";
import { Constructions } from "./pages/Constructions/Constructions";
import { Geometries } from "./pages/Geometries/Geometries";
import { Shapes } from "./pages/Shapes/Shapes";
import { Sheds } from "./pages/Sheds/Sheds";
import { Transportators } from "./pages/Transportator/Transportators";
import { TransportatorVehicles } from "./pages/TransportatorVehicles/TransportatorVehicles";
import { TransportatorDrivers } from "./pages/TransportatorDrivers/TransportatorDrivers";
import { Elements } from "./pages/Elements/Elements";
import { Checklists } from "./pages/Checklist/Checklists";
import { Romaneios } from "./pages/Romaneio/Romaneios";
import { ReportInspection } from "./pages/ReportInspection/ReportInspection";
import { ReportGeneral } from "./pages/ReportGeneral/ReportGeneral";
import { UserAccess } from "./pages/Users/UserAccess";
import { PdfsConstruction } from "./pages/PdfConstruction/PdfsConstruction";
import { PdfsElement } from "./pages/PdfElement/PdfsElement";
import { BIM } from "./pages/BIM/BIM";
import { Planning } from "./pages/Planning/Planning";
import { ReportMonting } from "./pages/ReportMonting/ReportMonting";

interface AppState {
    isLoaded: boolean;
}

export class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }

    componentWillUnmount() {
        this.setState({
            isLoaded: false,
        });
    }

    componentDidMount() {
        this.setState({
            isLoaded: true,
        });

        console.log("ComponentDidMout");
    }

    routes = () => {
        return (
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route
                    path="/recover_password"
                    element={<RecoverPassword />}
                ></Route>
                <Route
                    path="/selecionar_cliente"
                    element={
                        <RequireAuth>
                            <SelectClient />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/home"
                    element={
                        <RequireAuth>
                            <Home />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/profile"
                    element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                    }
                ></Route>

                <Route
                    path="/gerenciar_acesso/:page"
                    element={
                        <RequireAuth>
                            <UserAccess />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/clientes/:page"
                    element={
                        <RequireAuth>
                            <Clients />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/obras/:page"
                    element={
                        <RequireAuth>
                            <Constructions />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/geometrias/:page"
                    element={
                        <RequireAuth>
                            <Geometries />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/formas/:page"
                    element={
                        <RequireAuth>
                            <Shapes />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/galpoes/:page"
                    element={
                        <RequireAuth>
                            <Sheds />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/transportadoras/:page"
                    element={
                        <RequireAuth>
                            <Transportators />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/transportadoras/veiculos/:page"
                    element={
                        <RequireAuth>
                            <TransportatorVehicles />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/transportadoras/motoristas/:page"
                    element={
                        <RequireAuth>
                            <TransportatorDrivers />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/elementos/:page"
                    element={
                        <RequireAuth>
                            <Elements />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/checklists/:page"
                    element={
                        <RequireAuth>
                            <Checklists />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/romaneio/:page"
                    element={
                        <RequireAuth>
                            <Romaneios />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/relatorios/inspecao"
                    element={
                        <RequireAuth>
                            <ReportInspection />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/relatorios/geral"
                    element={
                        <RequireAuth>
                            <ReportGeneral />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/PDF/obras"
                    element={
                        <RequireAuth>
                            <PdfsConstruction />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/PDF/elementos"
                    element={
                        <RequireAuth>
                            <PdfsElement />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/BIM/:page"
                    element={
                        <RequireAuth>
                            <BIM />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/programacao/:planejamento"
                    element={
                        <RequireAuth>
                            <Planning />
                        </RequireAuth>
                    }
                ></Route>
                <Route
                    path="/relatorios/montagem"
                    element={
                        <RequireAuth>
                            <ReportMonting />
                        </RequireAuth>
                    }
                ></Route>
                {/* <Route path="*" element={<RequireAuth><NotFound/></RequireAuth>}></Route> */}
            </Routes>
        );
    };

    render() {
        return !this.state.isLoaded ? <LoadingPage /> : this.routes();
    }
}
