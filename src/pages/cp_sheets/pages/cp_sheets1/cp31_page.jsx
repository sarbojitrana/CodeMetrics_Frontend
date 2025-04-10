import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Code, Award, User, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  rating_800,
  rating_900,
  rating_1000,
  rating_1100,
  rating_1200,
  rating_1300,
  rating_1400,
  rating_1500,
  rating_1600
} from '../../assets/cp31';

const CP31 = () => {
  // Load username from localStorage on component mount
  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem('cp31_username');
    return savedUsername || '';
  });
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isLadderTypeOpen, setIsLadderTypeOpen] = useState(false);
  const [selectedLadderType, setSelectedLadderType] = useState('Rating');
  const [selectedRating, setSelectedRating] = useState(() => {
    const savedRating = localStorage.getItem('cp31_rating');
    return savedRating || 'Codeforces Rating : 800';
  });
  const [isLoading, setIsLoading] = useState(false);

  const ratingDropdownRef = useRef(null);
  const ladderTypeDropdownRef = useRef(null);
  const usernameInputRef = useRef(null);
  const navigate = useNavigate();

  const ladderTypes = ['Rating'];

  const ratingOptions = [
    'Codeforces Rating : 800',
    'Codeforces Rating : 900',
    'Codeforces Rating : 1000',
    'Codeforces Rating : 1100',
    'Codeforces Rating : 1200',
    'Codeforces Rating : 1300',
    'Codeforces Rating : 1400',
    'Codeforces Rating : 1500',
    'Codeforces Rating : 1600',
  ];

  // Save username to localStorage whenever it changes
  useEffect(() => {
    if (username) {
      localStorage.setItem('cp31_username', username);
    }
  }, [username]);

  // Save selected rating to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cp31_rating', selectedRating);
  }, [selectedRating]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target)) {
        setIsRatingDropdownOpen(false);
      }
      if (ladderTypeDropdownRef.current && !ladderTypeDropdownRef.current.contains(event.target)) {
        setIsLadderTypeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Focus on username input only if it's empty
    if (usernameInputRef.current && !username) {
      usernameInputRef.current.focus();
    }
  }, [username]);

  const handleViewLadder = () => {
    if (!username.trim()) {
      alert('Please enter your Codeforces username');
      usernameInputRef.current.focus();
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const rating = selectedRating.replace('Codeforces Rating : ', '');
      const key = `rating_${parseInt(rating)}`;
      const ratingMap = {
        rating_800,
        rating_900,
        rating_1000,
        rating_1100,
        rating_1200,
        rating_1300,
        rating_1400,
        rating_1500,
        rating_1600
      };

      const problems = ratingMap[key] || rating_800;
      setIsLoading(false);

      navigate('/CP31_ladder', {
        state: {
          data: problems,
          username: username,
          rating: selectedRating
        }
      });
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleViewLadder();
    }
  };

  const clearSavedData = () => {
    if (window.confirm('Are you sure you want to clear your saved username and settings?')) {
      localStorage.removeItem('cp31_username');
      localStorage.removeItem('cp31_rating');
      setUsername('');
      setSelectedRating('Codeforces Rating : 800');
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
      }
    }
  };

  return (
    <div className="min-h-full text-white">
      <div className="backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 transform hover:shadow-blue-500/10 hover:border-blue-500/30">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-center text-blue-100">CP31 Ladder Selection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-300">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Codeforces Username <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-gray-900/60 text-gray-100 px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                      placeholder="Enter your username"
                    />
                    {username && (
                      <button 
                        onClick={() => setUsername('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label="Clear username"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {username && (
                    <p className="text-xs text-blue-400 mt-1">
                      <Info className="h-3 w-3 inline mr-1" />
                      Username saved locally
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2" ref={ratingDropdownRef}>
                  <label className="flex items-center text-sm font-medium text-gray-300">
                    <Award className="h-4 w-4 mr-2 text-blue-400" />
                    By Rating <span className="text-gray-500 ml-1">ⓘ</span>
                  </label>
                  <div
                    className="w-full bg-gray-900/60 text-gray-100 px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between border border-gray-700 hover:border-blue-500 transition-all duration-200"
                    onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  >
                    <span>{selectedRating}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>

                  {isRatingDropdownOpen && (
                    <div className="absolute z-10 w-64 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-lg">
                      {ratingOptions.map((option, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 text-gray-200 hover:bg-blue-900/40 cursor-pointer transition-colors duration-150 flex items-center justify-between"
                          onClick={() => {
                            setSelectedRating(option);
                            setIsRatingDropdownOpen(false);
                          }}
                        >
                          <span>{option}</span>
                          {selectedRating === option && (
                            <ArrowRight className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Centered View Ladder button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleViewLadder}
                disabled={isLoading}
                className="w-3/4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-blue-500/20 shadow-lg flex items-center justify-center border border-blue-500/30 relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Code className="h-5 w-5 mr-2" />
                    View Ladder
                    <ArrowRight className="h-5 w-5 ml-2" />
                    
                    {/* Button shine effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full duration-1000 transform"></div>
                    </div>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Problems suitable for your current rating level
              </div>
            </div>
            
            {/* Help information */}
            <div className="mt-6 text-sm text-gray-400 border-t border-gray-700/50 pt-4">
              <div className="flex justify-between items-center">
                <p>
                  The CP31 Ladder provides a collection of problems organized by difficulty to help you improve your
                  competitive programming skills systematically.
                </p>
                {(username || selectedRating !== 'Codeforces Rating : 800') && (
                  <button 
                    onClick={clearSavedData}
                    className="text-xs text-red-400 hover:text-red-300 ml-4 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Clear saved data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CP31;