import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Code, ChevronRight, ArrowRight } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { login,register } from './utils/auth';
import { useNavigate } from 'react-router-dom';
export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate=useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
        const response = await login(email, password);
        alert(response.message);
        if(response.success){
            navigate(`/Homepage/${email}`);
        }
    } else {
        const response = await register(email, password);
        if(response.success){
            alert(response.message);
            toggleAuthMode;
        }else{
          alert(response.message);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
        <Outlet/>
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
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 font-medium text-sm ${
              isLogin ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 font-medium text-sm ${
              !isLogin ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-gray-400'
            }`}
          >
            Register
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-white">
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Email Field */}
            <div className="mb-4">
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 flex items-center justify-center"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
          
          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">
                Forgot your password?
              </a>
            </div>
          )}
          
          {/* Switch between login/register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleAuthMode}
                className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium"
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