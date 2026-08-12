import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Sidebar />

            <div className="ml-64">
                <Navbar />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;