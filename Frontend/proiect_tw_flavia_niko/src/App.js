import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashBoard';
import RegisterPage from './pages/Register';
import NewNotes from './pages/NewNotes';


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
					<Route path="/dashboard" element={<DashBoard />} />
					<Route path="/newnotes" element={<NewNotes />} />
			</Routes>
		</Router>
	);
}

export default App;