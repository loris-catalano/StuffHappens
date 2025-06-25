import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar'  
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import UserPage from './pages/UserPage'
import InstructionsPage from './pages/InstructionsPage'

function AppLayout() {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';
  
  return (
    <>
      {!isGamePage && <NavBar />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
        </Routes>
    </AuthProvider>
  )
}

export default App
