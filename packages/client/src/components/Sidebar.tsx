import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
        },
        {
            name: 'About',
            path: '/about',
        },
        {
            name: 'Settings',
            path: '/settings',
        },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r">
            <div className="h-16 border-b flex items-center px-5">
                <h2 className="text-lg font-bold text-neutral-800">
                    Growth Tracker
                </h2>
            </div>

            <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg text-sm ${isActive
                                ? 'bg-neutral-100 text-neutral-900 font-medium'
                                : 'text-neutral-600 hover:bg-neutral-50'
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;