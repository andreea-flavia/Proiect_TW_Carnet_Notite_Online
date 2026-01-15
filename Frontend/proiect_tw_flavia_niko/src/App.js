import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashBoard';


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LoginPage />} />
	                <Route path="/dashboard" element={<DashBoard />} />
			</Routes>
		</Router>
	);
}

export default App;