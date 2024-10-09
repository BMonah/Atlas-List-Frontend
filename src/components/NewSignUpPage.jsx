import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignUpPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [responseType, setResponseType] = useState(''); // State to manage alert type
    const [role, setRole] = useState('client'); // Default role set to "client"

    const submitForm = (data) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
                role: role // Add the selected role to the request body
            })
        };

        fetch('http://127.0.0.1:8080/auth/signup', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.message === "User created Successfully") {
                    setServerResponse("Signup successful!");
                    setResponseType("success"); // Set response type to success
                    reset(); // Resets the form after successful submission
                } else {
                    setServerResponse(result.message || "Something went wrong!");
                    setResponseType("error"); // Set response type to error
                }
                setShow(true); // Show the message
            })
            .catch(error => {
                console.error("Signup error:", error);
                setServerResponse("An error occurred during signup.");
                setResponseType("error"); // Set response type to error
                setShow(true); // Show the error message
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>
                
                {show && (
                    <div className={`border px-4 py-3 rounded relative mb-4 ${responseType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
                        <strong className="font-bold">{responseType === 'success' ? "Success!" : "Oh snap!"} </strong>
                        <span className="block sm:inline">{serverResponse}</span>
                        <button onClick={() => setShow(false)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path d="M10 9l-1-1-4 4-1-1 4-4-1-1 1-1 4 4-1 1 4 4-1 1-4-4z"/>
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit(submitForm)}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="username">Username</label>
                        <input
                            type="text"
                            placeholder="Your username"
                            {...register("username", { required: true, maxLength: 25 })}
                            className={`mt-1 block w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.username && <small className="text-red-500">Username is required (max 25 characters)</small>}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="Your email"
                            {...register("email", { required: true, maxLength: 80 })}
                            className={`mt-1 block w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <small className="text-red-500">Email is required (max 80 characters)</small>}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="Your password"
                            {...register("password", { required: true, minLength: 8, maxLength: 80 })}
                            className={`mt-1 block w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <small className="text-red-500">Password must be 8-80 characters</small>}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", { required: true, minLength: 8, maxLength: 80 })}
                            className={`mt-1 block w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.confirmPassword && <small className="text-red-500">Please confirm your password (8-80 characters)</small>}
                    </div>

                    {/* Radio buttons to select role */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Sign up as</label>
                        <div className="flex">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    value="client"
                                    checked={role === "client"}
                                    onChange={() => setRole("client")}
                                    className="mr-1"
                                />
                                Client
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="freelancer"
                                    checked={role === "freelancer"}
                                    onChange={() => setRole("freelancer")}
                                    className="mr-1"
                                />
                                Freelancer
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2 mt-4 bg-green-500 text-white rounded hover:bg-blue-600 transition duration-200">
                        Sign Up
                    </button>

                    <div className="mt-4 text-center">
                        <small>Already have an account? <Link to='/login' className="text-green-500 hover:underline">Login instead</Link></small>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;