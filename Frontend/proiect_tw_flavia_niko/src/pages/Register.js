import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const validateEmail = (value) => {
		const v = value.trim().toLowerCase();
		return v.endsWith('@stud.ase.ro');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateEmail(email)) {
			setError('Please use an institutional email ending with @stud.ase.ro');
			return;
		}
		if (!password || !firstName || !lastName) {
			setError('Please complete all fields');
			return;
		}

		try {
			setError('');
			const payload = {
				user_mail: email,
				user_password: password,
				user_first_name: firstName,
				user_last_name: lastName
			};

			const response = await axios.post('http://localhost:9000/api/user', payload);
			if (response.status === 201) {
				navigate('/login');
			} else {
				setError('Registration failed');
			}
		} catch (err) {
			const serverMessage = err.response?.data?.error || err.message || 'Error';
			setError(serverMessage);
			console.error('Registration error:', serverMessage);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
			<div className="w-full max-w-md bg-white dark:bg-[#1a2632] rounded-lg shadow p-8">
				<h2 className="text-2xl font-bold mb-4 text-center">Create an account</h2>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="p-3 rounded border" />
					<input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="p-3 rounded border" />
					<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@stud.ase.ro" type="email" className="p-3 rounded border" />
					<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="p-3 rounded border" />
					{error && <p className="text-sm text-red-600">{error}</p>}
					<button type="submit" className="bg-primary text-white py-3 rounded font-bold">Register</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;

