import React from 'react';

export const AppBar = ({ user }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        // A full page reload is a simple way to reset state and navigate to signin
        window.location.reload();
    };

    return (
        <div className="shadow h-14 flex justify-between items-center px-4 md:px-6">
            <div className="flex flex-col justify-center h-full text-lg font-bold">
                PayTM App
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello, {user}
                </div>
                 <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
                    <div className="text-xl">
                        {user ? user[0].toUpperCase() : 'U'}
                    </div>
                </div>
                <button onClick={handleLogout} className="text-sm text-white bg-slate-800 hover:bg-slate-900 rounded-md px-3 py-1.5">
                    Logout
                </button>
            </div>
        </div>
    );
};
