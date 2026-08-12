import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import Settings from "./pages/Settings";
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <div className="w-full bg-neutral-50">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />

            {/* Add more protected routes here */}
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
