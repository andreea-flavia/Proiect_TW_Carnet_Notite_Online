import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashBoard';
import RegisterPage from './pages/Register';
import NewNotes from './pages/NewNotes';
import EditNote from './pages/EditNote';


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
					<Route path="/dashboard" element={<DashBoard />} />
					<Route path="/newnotes" element={<NewNotes />} />
					<Route path="/editnote/:id" element={<EditNote />} />
			</Routes>
		</Router>
	);
}

export default App;