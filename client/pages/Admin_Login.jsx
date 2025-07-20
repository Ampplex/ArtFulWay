import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

function Admin_Login(props) {
    const [username, setUsername] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Hardcoded credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_SECRET_KEY = 'Admin@087';

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate loading delay
        setTimeout(() => {
            if (username === ADMIN_USERNAME && secretKey === ADMIN_SECRET_KEY) {
                setTimeout(() => {
                    navigate('/admin_dashboard'); 
                }, 200);
                localStorage.setItem('adminToken', '@1234*65gfgd');
            } else {
                setError('Invalid username or secret key');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header Card */}
                <div className="bg-gray-900 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full text-sm">
                            <Shield className="w-4 h-4" />
                            <span>ADMIN ACCESS</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2">Admin Portal</h1>
                    <p className="text-gray-300 text-center text-sm">
                        Secure access to administrative functions
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-6 rounded-b-2xl shadow-xl">
                    <div className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter admin username"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Secret Key Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Secret Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder="Enter secret key"
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    <span>Access Admin Panel</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Authorized personnel only. All access attempts are logged.
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
}

export default Admin_Login;