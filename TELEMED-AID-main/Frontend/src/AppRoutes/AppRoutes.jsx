import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as DefaultRoutes from "../AppRoutes/DefaultRoutes";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import AddArticle from "../Pages/Article/AddArticle";
import ShowArticles from "../Pages/Article/ShowArticles";
import AddQuestion from "../Pages/Question/AddQuestion";
import ShowQuestions from "../Pages/Question/ShowQuestions";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import HomePage from "../Pages/HomePage/HomePage";    // Like this
import UpdateInfo from "../Pages/UpdateInfo/UpdateInfo";
import UpdatePassword from "../Pages/UpdatePassword/UpdatePassword";
import Availability from "../Pages/Availability/Availability";
import MyAppointments from "../Pages/MyAppointments/MyAppointments";
import Appointment from "../Pages/Appointment/Appointment";
import PageNotFound from "../Pages/PageNotFound/PageNotFound";
import ChatPage from "../Pages/ChatPage/ChatPage";
import Unauthorized from "../Pages/Unauthorized/Unauthorized.jsx";
import Chatbot from "../Pages/Chatbot/Chatbot"
import { sampleAppointments } from "../Utils/HelperObjects";

export default function Paths() {
    const { role, isLogged } = useSelector((state) => state.user);

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />
                <Route path={DefaultRoutes.Login} element={<Login />} />
                <Route path={DefaultRoutes.Signup} element={<Signup />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes */}
                <Route
                    path={DefaultRoutes.profile}
                    element={isLogged ? <ProfilePage /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.home}
                    element={isLogged ? <HomePage /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.updateInfo}
                    element={isLogged ? <UpdateInfo /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.updatePassword}
                    element={isLogged ? <UpdatePassword role={role} /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.myAppointments}
                    element={isLogged ? <MyAppointments appointments={sampleAppointments} /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.bookAppointment}
                    element={isLogged ? <Appointment /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.chat}
                    element={isLogged ? <ChatPage /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.ShowArticles}
                    element={isLogged ? <ShowArticles /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.AddQuestion}
                    element={isLogged ? <AddQuestion /> : <Navigate to={DefaultRoutes.Login} replace />}
                />
                <Route
                    path={DefaultRoutes.ShowQuestions}
                    element={isLogged ? <ShowQuestions /> : <Navigate to={DefaultRoutes.Login} replace />}
                />

                {/* Doctor-only routes */}
                <Route
                    path={DefaultRoutes.availability}
                    element={
                        isLogged && role === "DOCTOR" ?
                            <Availability /> :
                            <Navigate to="/unauthorized" replace />
                    }
                />
                <Route
                    path={DefaultRoutes.AddArticle}
                    element={
                        isLogged && role === "DOCTOR" ?
                            <AddArticle /> :
                            <Navigate to="/unauthorized" replace />
                    }
                />
                <Route
                    path={DefaultRoutes.chat}
                    element={<ChatPage />}
                />

                <Route path={DefaultRoutes.chatbot} element={<Chatbot />} />
                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
}