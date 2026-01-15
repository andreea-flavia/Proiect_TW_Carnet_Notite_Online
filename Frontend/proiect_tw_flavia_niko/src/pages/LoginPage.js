import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const validateEmail = (value) => {
		const v = value.trim().toLowerCase();
		return v.endsWith('@stud.ase.ro');
	};

	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setEmail(e.target.value);
		if (error && validateEmail(e.target.value)) setError('');
	};

	const handleSubmit = async (e) => {

		if(e) e.preventDefault();
		
		if (!validateEmail(email)) {
			setError('Please enter an institutional email ending with @stud.ase.ro');
			return;
		}
		try{
			setError('');
			const response = await axios.post('http://localhost:9000/api/login', {
				email: email//,
				//password: password
			});

			if(response.data.success){
				const id_primit = response.data.user.id;
				console.log("Id-ul salvat: ", id_primit);
				if(id_primit){
					localStorage.setItem('user_id', id_primit);
					navigate('/dashboard');
				}
			}
		} catch(e){
			const serverMessage = e.response?.data?.error || 'Error';
			setError(serverMessage);
			console.log("Server error:", serverMessage);
		}

		// navigate('/dashboard');

	};

	return (
		<div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-slate-50 antialiased">
			<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        
				{/* Header Section */}
				<header className="w-full px-6 py-6 md:px-12 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-xl font-bold tracking-tight text-[#0d141b] dark:text-slate-50">StudioTeca</h2>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 flex items-center justify-center px-4 py-8 md:px-6">
					<div className="w-full max-w-lg mx-auto bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px] justify-center">
						<div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
							<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
							<div className="w-full flex flex-col gap-8 text-center">
								<div className="flex flex-col items-center gap-4">
									<div className="flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
										<span className="material-symbols-outlined text-4xl">mark_email_read</span>
									</div>
									<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0d141b] dark:text-white">
										Log into StudioTeca
									</h1>
									<p className="text-slate-500 dark:text-slate-400 max-w-sm">
										Please enter your institutional email address to continue.
									</p>
								</div>
								<div className="flex flex-col gap-4 w-full">
									<div className="relative">
										<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
										<input
											value={email}
											onChange={handleChange}
											aria-invalid={error ? 'true' : 'false'}
											aria-describedby={error ? 'email-error' : undefined}
											className={`w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 ${error ? 'border border-red-500 focus:ring-red-500 dark:border-red-400' : 'border border-slate-300 dark:border-slate-700 focus:ring-primary'}`}
											placeholder="your-namexx@stud.ase.ro"
											type="email"
										/>
									</div>
									<div className="relative">
										<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className={`w-full rounded-lg bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-10 text-slate-800 dark:text-slate-200 focus:ring-2 placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 focus:ring-primary`}
											placeholder="••••••••"
											type={showPassword ? "text" : "password"} 
											required
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
									{error && (
										<p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400 text-left">{error}</p>
									)}
									<button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900">
										<span>Log in</span>
										<span className="material-symbols-outlined">arrow_forward</span>
									</button>
								</div>
								{/* <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 p-4 text-xs text-slate-600 dark:text-slate-400">
									<span className="material-symbols-outlined text-lg">lock</span>
									<p>We'll send a verification link to your institutional email. Your credentials will not be stored by StudioTeca.</p>
								</div> */}
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

export default LoginPage;
