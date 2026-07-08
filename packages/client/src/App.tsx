import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="w-full bg-neutral-50">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          {/* add more protected routes here */}
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
