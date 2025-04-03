import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Loader, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Award, ExternalLink } from 'lucide-react';
import { add, remove, fetchusernames } from './utils/user';
import { userid } from './utils/auth';
import { useParams, useNavigate } from 'react-router-dom';

const UsernameManagementPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState("");

  // Fetch user ID from email parameter
  useEffect(() => {
    let isMounted = true;

    const fetchUserId = async () => {
      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      try {
        const response = await userid(email);
        if (!isMounted) return;

        if (response.success) {
          setUserId(response.userid);
          // Once we have the userId, load usernames
          if (response.userid) {
            loadUsernames(response.userid);
          }
        } else {
          setError("User not found. Please check the email address.");
          setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to fetch user ID. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserId();

    return () => {
      isMounted = false;
    };
  }, [email]);
   
  
  const loadUsernames = async (id) => {
    const currentId = id || userId;
    
    if (!currentId) return; // Don't fetch if we don't have a userId yet
    
    try {
      setLoading(true);
      setError('');
      const data = await fetchusernames(currentId);
      
      if (data.success) {
        setUsernames(data.message || []);
      } else {
        setError(data.message || 'Failed to fetch usernames');
      }
    } catch (err) {
      console.error("Error loading usernames:", err);
      setError('Failed to load usernames. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh usernames list
  const refreshUsernames = async () => {
    if (!userId) {
      setError("No user ID available. Please try again.");
      return;
    }
    
    setRefreshing(true);
    await loadUsernames(userId);
    setRefreshing(false);
  };

  // Handle adding a new username
  const handleAddUser = (newUser) => {
    setUsernames(prev => [...prev, newUser.user]);
  };

  // Handle removing a username
  const handleRemoveUser = async (username) => {
    if (!userId) {
      setError("No user ID available. Cannot remove username.");
      return;
    }
    
    try {
      setDeleteLoading(prev => ({ ...prev, [username]: true }));
      
      const response = await remove(userId, username);
      
      if (response.success) {
        setUsernames(prev => prev.filter(name => name !== username));
      } else {
        setError(`Failed to remove ${username}: ${response.message}`);
      }
    } catch (err) {
      console.error("Error removing username:", err);
      setError(`Failed to remove ${username}`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [username]: false }));
    }
  };

  // Go back function
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleNavigateToManagement = () => {
    navigate(`/Homepage/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGoBack}
                className="bg-blue-600/80 hover:bg-blue-500 p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-blue-500/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                Competitor Management
              </h1>
            </div>
            
            <button 
              onClick={refreshUsernames}
              disabled={refreshing || loading || !userId}
              className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <p className="text-gray-300 text-sm">
            Manage your competitors and track their progress against yours. Add Codeforces usernames to compare performance.
          </p>
        </div>

        {/* Main content section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Username adder */}
          <div className="md:col-span-1">
            {userId ? (
              <UsernameAdder onAddUser={handleAddUser} userId={userId} />
            ) : (
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-5 text-yellow-400 flex items-center gap-2 shadow-lg border border-gray-700/50">
                <Loader className="w-5 h-5 animate-spin" />
                Loading user information...
              </div>
            )}
          </div>

          {/* Right column - Usernames list */}
          <div className="md:col-span-2">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Usernames list */}
            <div className="bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
              <div className="p-4 border-b border-gray-700/70 flex items-center justify-between">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 flex items-center gap-2">
                  <Award size={18} />
                  Competitors ({loading ? '...' : usernames.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="text-center">
                    <Loader className="w-10 h-10 animate-spin text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-400">Loading competitors...</p>
                  </div>
                </div>
              ) : usernames.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">No competitors added yet.</p>
                  <p className="text-gray-500 text-sm">Add your first competitor using the form on the left.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700/70 max-h-96 overflow-y-auto">
                  {usernames.map((username, index) => (
                    <li key={username} className={`flex items-center justify-between p-4 hover:bg-blue-600/10 transition-colors ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'}`}>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600/20 p-2 rounded-full">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <a 
                            href={`https://codeforces.com/profile/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 font-medium flex items-center gap-1 hover:underline"
                          >
                            {username}
                            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(username)}
                        disabled={deleteLoading[username]}
                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-900/30 transition-all"
                        title="Remove competitor"
                      >
                        {deleteLoading[username] ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer action button */}
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={handleNavigateToManagement}
            className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="font-medium">View Your Leaderboard</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// The UsernameAdder component
const UsernameAdder = ({ onAddUser = () => {}, userId }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    
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
    
    if (!userId) {
      setError('No user ID available. Cannot add username.');
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
      
      // Properly pass userId and username to the add function
      const response = await add(userId, username.trim());
      
      if (!response.success) {
        setError(response.message || 'Failed to add username');
      } else {
        // Notify parent component about successful addition
        onAddUser({
          user: username.trim(),
        });
        
        setSuccess(`"${username.trim()}" added successfully!`);
        // Reset input field
        setUsername('');
      }
    } catch (err) {
      console.error("Error adding username:", err);
      setError('Failed to verify or add username');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl shadow-xl p-5 w-full mx-auto border border-gray-700/50 h-full">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 flex items-center gap-2">
        <Plus size={18} />
        Add Competitor
      </h2>
      
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-4">
          Enter a valid Codeforces username to add to your tracking list.
        </p>
        
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Codeforces username"
            className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600/80 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && !loading && addUsername()}
            disabled={loading}
          />
        </div>
        
        <button
          onClick={addUsername}
          disabled={loading}
          className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-blue-600 font-medium"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>{loading ? "Verifying..." : "Add Competitor"}</span>
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg text-red-300 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg text-green-300 flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Tips:</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Usernames are case-sensitive</li>
          <li>• Only valid Codeforces users can be added</li>
          <li>• Track up to 20 competitors at once</li>
        </ul>
      </div>
    </div>
  );
};

export default UsernameManagementPage;