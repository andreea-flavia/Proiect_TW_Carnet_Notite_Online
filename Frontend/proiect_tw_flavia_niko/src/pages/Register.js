import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
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
		<div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-slate-50 antialiased">
			<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

				{/* Header Section */}
				<header className="w-full px-6 py-6 md:px-12 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-xl font-bold tracking-tight text-[#0d141b] dark:text-slate-50">StudioTeca</h2>
					</div>
					<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
						Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">Log in</Link>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 flex items-center justify-center px-4 py-8 md:px-6">
					<div className="w-full max-w-lg mx-auto bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl overflow-hidden flex flex-col justify-center">
						<div className="flex-1 flex flex-col justify-center p-8 md:p-12 relative">
							<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>

							<div className="w-full flex flex-col gap-8">
								<div className="text-center">
									<h1 className="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white mb-2">
										Create an account
									</h1>
									<p className="text-slate-500 dark:text-slate-400">
										Join StudioTeca to start your learning journey
									</p>
								</div>

								<form onSubmit={handleSubmit} className="flex flex-col gap-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="relative">
											<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
											<input
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												placeholder="First name"
												className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 focus:ring-primary"
											/>
										</div>
										<div className="relative">
											<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
											<input
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
												placeholder="Last name"
												className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 focus:ring-primary"
											/>
										</div>
									</div>

									<div className="relative">
										<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
										<input
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="you@stud.ase.ro"
											type="email"
											className={`w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 ${error && error.includes('@stud.ase.ro') ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-primary'}`}
										/>
									</div>

									<div className="relative">
										<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Password"
											type={showPassword ? "text" : "password"}
											className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-10 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 focus:ring-primary"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
										>
											<span className="material-symbols-outlined text-sm">
												{showPassword ? 'visibility_off' : 'visibility'}
											</span>
										</button>
									</div>

									{error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

									<button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 mt-2">
										Create Account
									</button>
								</form>
							</div>
						</div>
					</div>
				</main>

				{/* Footer */}
				<footer className="w-full py-8 text-center px-4">
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-sm text-slate-400">© 2026 StudioTeca. Designed for students.</p>
					</div>
				</footer>
			</div>
		</div>
	);
};

export default RegisterPage;

