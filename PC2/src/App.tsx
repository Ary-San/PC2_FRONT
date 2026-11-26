import {browserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ProtectedLayout} from "./components";
import Login from "./pages/Login";
import Register from "./pages/Home";
import {useAuth} from "./hooks/useAuth";