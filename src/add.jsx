import React, { useState, useEffect } from 'react';
import { User, Plus, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const UsernameAdder = ({ onAddUser = () => {} }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear success message after 3 seconds
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const validateUsername = async (username) => {
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.status === 'OK';
    } catch (error) {
      console.error("Error validating username:", error);
      return false;
    }
  };

  const addUsername = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate the username with Codeforces API
      const isValid = await validateUsername(username.trim());
      
      if (!isValid) {
        setError('Invalid Codeforces username');
        setLoading(false);
        return;
      }
      
      // Call parent component handler with the new username
      onAddUser({ codeforcesUsername: username.trim() });
      
      // Show success message
      setSuccess(`Username "${username.trim()}" added successfully!`);
      
      // Reset input field
      setUsername('');
    } catch (err) {
      setError('Failed to verify username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 mt-6 w-full max-w-md">
      <h2 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
        <User size={18} />
        Add Competitor
      </h2>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Codeforces username"
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && !loading && addUsername()}
          disabled={loading}
        />
        <button
          onClick={addUsername}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 focus:outline-none transition-colors flex items-center gap-1 disabled:opacity-70 disabled:hover:bg-blue-600"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>{loading ? "Verifying..." : "Add"}</span>
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-2 text-green-400 text-sm flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}
    </div>
  );
};

export default UsernameAdder;