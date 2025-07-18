import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompleteProfile from './pages/CompleteProfile';
import Search from './pages/Search';
import Interests from './pages/Interests';
import Messages from './pages/Messages';

// Inside <Routes>


<div className="bg-purple-600 text-white p-4 rounded-xl text-center">
  ✅ Tailwind v4 is working!
</div>


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/messages/:userId" element={<Messages />} />


      </Routes>
    </Router>
  );
}

export default App;
