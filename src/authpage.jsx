import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Code, ArrowRight, Loader, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { login, register } from './utils/auth';
import { useNavigate } from 'react-router-dom';

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const response = await login(email, password);
        if (response.success) {
          showNotification('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            navigate(`/addusers/${email}`);
          }, 1000);
        } else {
          setError(response.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const response = await register(email, password);
        if (response.success) {
          showNotification('Account created successfully!', 'success');
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        } else {
          setError(response.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
      <Outlet />
      
      {/* Notification */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 flex items-center p-4 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-1 fade-in duration-300 ${
            notification.type === 'success' ? 'bg-emerald-900 border border-emerald-500 text-emerald-100' : 'bg-red-900 border border-red-500 text-red-100'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2 text-emerald-300" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 text-red-300" />
          )}
          <p className="flex-1">{notification.message}</p>
          <button 
            onClick={() => setNotification({ ...notification, show: false })}
            className="ml-4 p-1 rounded-full hover:bg-black/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Logo and Header */}
      <div className="flex items-center mb-6">
        <Code className="h-8 w-8 text-indigo-500 mr-2" />
        <h1 className="text-2xl font-bold text-white">CP Leaderboard</h1>
      </div>
      
      {/* Auth Container */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => !loading && setIsLogin(true)}
            disabled={loading}
            className={`flex-1 py-4 font-medium text-sm transition-colors duration-300 ${
              isLogin ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'}`}
          >
            Login
          </button>
          <button
            onClick={() => !loading && setIsLogin(false)}
            disabled={loading}
            className={`flex-1 py-4 font-medium text-sm transition-colors duration-300 ${
              !isLogin ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-200'}`}
          >
            Register
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-white">
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md text-sm flex items-start animate-in fade-in duration-300">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-red-300" />
              <p className="flex-1">{error}</p>
              <button 
                onClick={() => setError('')}
                className="ml-2 p-1 rounded-full hover:bg-black/20 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="mb-4 transition-opacity duration-300" style={{ opacity: loading ? 0.6 : 1 }}>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            
            {/* Email Field */}
            <div className="mb-4 transition-opacity duration-300" style={{ opacity: loading ? 0.6 : 1 }}>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-6 transition-opacity duration-300" style={{ opacity: loading ? 0.6 : 1 }}>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  required
                  disabled={loading}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => !loading && setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Login/Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 shadow-lg shadow-indigo-900/50'}`}
            >
              {loading ? (
                <div className="flex items-center space-x-2 relative">
                  <span className="loading-dots flex space-x-1">
                    <span className="animate-bounce h-2 w-2 bg-white rounded-full inline-block" style={{ animationDelay: "0ms" }}></span>
                    <span className="animate-bounce h-2 w-2 bg-white rounded-full inline-block" style={{ animationDelay: "150ms" }}></span>
                    <span className="animate-bounce h-2 w-2 bg-white rounded-full inline-block" style={{ animationDelay: "300ms" }}></span>
                  </span>
                  <span>{isLogin ? 'Signing In' : 'Creating Account'}</span>
                </div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
          
          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className={`text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                Forgot your password?
              </a>
            </div>
          )}
          
          {/* Switch between login/register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => !loading && toggleAuthMode()}
                disabled={loading}
                className={`ml-1 text-indigo-400 font-medium transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-indigo-300'}`}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500">
        <p>© 2025 CP Leaderboard. All rights reserved.</p>
      </div>
    </div>
  );
}