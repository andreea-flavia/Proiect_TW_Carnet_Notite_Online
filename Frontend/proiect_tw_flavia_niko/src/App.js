import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import DashBoard from './pages/DashBoard';
import RegisterPage from './pages/Register';
import NewNotes from './pages/NewNotes';
import EditNote from './pages/EditNote';
import AllNotesPage from './pages/AllNotes';
import ViewNote from './pages/ViewNote';
import ShareNotes from './pages/ShareNotes';
import SharedNotesWithFriends from './pages/ShareNotesWithFriends';
import Favorites from './pages/Favorites';
import AllStudyGroups from './pages/AllStudyGroups';
import StudyGroupDetails from './pages/StudyGroupDetails';


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
					<Route path="/note/:id" element={<ViewNote />} />
					<Route path="/all-notes" element={<AllNotesPage />} />
					<Route path="/sharenotes" element={<ShareNotes />} />
					<Route path="/sharenoteswithfriends" element={<SharedNotesWithFriends />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/studygroups" element={<AllStudyGroups />} />
					<Route path="/group/:groupId" element={<StudyGroupDetails />} />
			</Routes>
		</Router>
	);
}

export default App;