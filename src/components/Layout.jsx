import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-8 md:pl-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
