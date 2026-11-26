import {useState, type FormEvent} from "react";
import Link, useNavigate from "react-router-dom";
import {api, errorMessage} from "../api"; 
import {Button, Field, InputClass} from "../components";
import { useNavigate } from "react-router-dom";
type Errors  = {name ? : string, email ? : string, password ? : string, confirmPassword ? : string}

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const next : errors = {};
        if (!name.trim()) next.name = "Name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email is invalid";
        if(password.length < 8 ||  ) next.password = "Password must be at least 6 characters";