import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Code, Award, User, Zap, ChevronRight, Info, AlertCircle, X, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { div_a, div_b, div_c, div_d, div_e, rating_1, rating_2, rating_3, rating_4, rating_5, rating_6, rating_7, rating_8, rating_9, rating_10, rating_11 } from '../../assets/a2oj_ladders';

// Custom dropdown component for reusability
const CustomDropdown = ({ label, icon: Icon, options, value, onChange, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="flex items-center text-sm font-medium text-gray-300">
        <Icon className="h-4 w-4 mr-2 text-blue-400" />
        {label}
        {description && (
          <div className="relative group ml-2">
            <Info className="h-4 w-4 text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 text-xs text-gray-300 p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
              {description}
            </div>
          </div>
        )}
      </label>
      <div 
        className="
          w-full 
          bg-gray-900/60 
          text-gray-100 
          px-4 
          py-3 
          rounded-lg 
          cursor-pointer 
          flex 
          items-center 
          justify-between 
          border 
          border-gray-700 
          hover:border-blue-500 
          transition-all 
          duration-200
        "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        {isOpen ? 
          <ChevronUp className="h-5 w-5 text-gray-400" /> : 
          <ChevronDown className="h-5 w-5 text-gray-400" />
        }
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-lg custom-scrollbar">
          {options.map((option, index) => (
            <div 
              key={index}
              className="
                px-4 
                py-3 
                text-gray-200 
                hover:bg-blue-900/40 
                cursor-pointer 
                transition-colors 
                duration-150
                flex items-center justify-between
              "
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span>{option}</span>
              {value === option && (
                <ChevronRight className="h-4 w-4 text-blue-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const A2oJ = () => {
  // Initialize state with localStorage values if available
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('a2oj_username') || '';
  });
  
  const [selectedLadderType, setSelectedLadderType] = useState(() => {
    return localStorage.getItem('a2oj_ladder_type') || 'Rating';
  });
  
  const [selectedRating, setSelectedRating] = useState(() => {
    return localStorage.getItem('a2oj_rating') || 'Codeforces Rating < 1300';
  });
  
  const [selectedDivision, setSelectedDivision] = useState(() => {
    return localStorage.getItem('a2oj_division') || 'Division A';
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const usernameInputRef = useRef(null);
  const navigate = useNavigate();

  const ladderTypes = ['Rating', 'Division'];

  const ratingOptions = [
    'Codeforces Rating < 1300',
    'Codeforces Rating: 1300-1399',
    'Codeforces Rating: 1400-1499',
    'Codeforces Rating: 1500-1599',
    'Codeforces Rating: 1600-1699',
    'Codeforces Rating: 1700-1799',
    'Codeforces Rating: 1800-1899',
    'Codeforces Rating: 1900-1999',
    'Codeforces Rating: 2000-2099',
    'Codeforces Rating: 2100-2199',
    'Codeforces Rating: 2200+'
  ];
  
  const divisionOptions = [
    'Division A',
    'Division B',
    'Division C',
    'Division D',
    'Division E'
  ];

  // Save to localStorage whenever values change
  useEffect(() => {
    if (username) {
      localStorage.setItem('a2oj_username', username);
    }
  }, [username]);

  useEffect(() => {
    localStorage.setItem('a2oj_ladder_type', selectedLadderType);
  }, [selectedLadderType]);

  useEffect(() => {
    localStorage.setItem('a2oj_rating', selectedRating);
  }, [selectedRating]);

  useEffect(() => {
    localStorage.setItem('a2oj_division', selectedDivision);
  }, [selectedDivision]);

  // Focus username input on initial load if it's empty
  useEffect(() => {
    if (usernameInputRef.current && !username) {
      usernameInputRef.current.focus();
    }
  }, [username]);

  const getCurrentSelection = () => {
    if (selectedLadderType === 'Rating') {
      return selectedRating;
    } else if (selectedLadderType === 'Division') {
      return selectedDivision;
    }
    return 'Select an option';
  };

  const handleViewLadder = () => {
    if (!username.trim()) {
      setErrorMessage("Please enter a valid Codeforces username");
      usernameInputRef.current.focus();
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call delay
    setTimeout(() => {
      let problems;
      if (selectedLadderType === 'Rating') {
        const ratingMap = {
          "Codeforces Rating < 1300": rating_1,
          "Codeforces Rating: 1300-1399": rating_2,
          "Codeforces Rating: 1400-1499": rating_3,
          "Codeforces Rating: 1500-1599": rating_4,
          "Codeforces Rating: 1600-1699": rating_5,
          "Codeforces Rating: 1700-1799": rating_6,
          "Codeforces Rating: 1800-1899": rating_7,
          "Codeforces Rating: 1900-1999": rating_8,
          "Codeforces Rating: 2000-2099": rating_9,
          "Codeforces Rating: 2100-2199": rating_10,
          "Codeforces Rating: 2200+": rating_11
        };
        problems = ratingMap[selectedRating] || rating_1;
        
        navigate('/Rating_ladder', { 
          state: { 
            receivedData: problems,
            handle: username,
          } 
        });
      } else {
        const divisionMap = {
          "Division A": div_a,
          "Division B": div_b,
          "Division C": div_c,
          "Division D": div_d,
          "Division E": div_e
        };
        problems = divisionMap[selectedDivision] || div_a;
        
        navigate('/Division_ladder', { 
          state: { 
            receivedData: problems,
            handle: username,
          } 
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const clearUsername = () => {
    setUsername('');
    localStorage.removeItem('a2oj_username');
    usernameInputRef.current.focus();
  };

  const clearAllSavedData = () => {
    if (window.confirm('Are you sure you want to clear your saved preferences?')) {
      localStorage.removeItem('a2oj_username');
      localStorage.removeItem('a2oj_ladder_type');
      localStorage.removeItem('a2oj_rating');
      localStorage.removeItem('a2oj_division');
      
      setUsername('');
      setSelectedLadderType('Rating');
      setSelectedRating('Codeforces Rating < 1300');
      setSelectedDivision('Division A');
      
      usernameInputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleViewLadder();
    }
  };

  return (
    <div className="min-h-full text-white">
      <div className="backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 transform hover:shadow-blue-500/10 hover:border-blue-500/30">
        <div className="relative">
          {/* Shiny top border effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-center text-blue-100">A2OJ Ladder Selection</h2>
            
            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-200 flex items-center animate-fade-in">
                <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-300">
                    <User className="h-4 w-4 mr-2 text-blue-400" />
                    Codeforces Username
                    <span className="ml-1 text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      ref={usernameInputRef}
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      onKeyPress={handleKeyPress}
                      className="
                        w-full 
                        bg-gray-900/60 
                        text-gray-100 
                        px-4 
                        py-3 
                        rounded-lg 
                        border 
                        border-gray-700 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-blue-500 
                        focus:border-transparent 
                        transition-all 
                        duration-200
                        placeholder-gray-500
                      "
                      placeholder="Enter your username"
                    />
                    {username && (
                      <button
                        onClick={clearUsername}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Clear username"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {username && (
                    <p className="text-xs text-blue-400 mt-1 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Username saved locally
                    </p>
                  )}
                </div>

                {/* Ladder Type Dropdown */}
                <CustomDropdown
                  label="Ladder Type"
                  icon={Award}
                  options={ladderTypes}
                  value={selectedLadderType}
                  onChange={setSelectedLadderType}
                  description="Choose how problems are organized"
                />
              </div>
              
              <div className="space-y-6">
                {/* Rating/Division Selection */}
                <CustomDropdown
                  label={selectedLadderType === 'Rating' ? 'By Rating' : 'By Division'}
                  icon={Award}
                  options={selectedLadderType === 'Rating' ? ratingOptions : divisionOptions}
                  value={getCurrentSelection()}
                  onChange={(option) => {
                    if (selectedLadderType === 'Rating') {
                      setSelectedRating(option);
                    } else {
                      setSelectedDivision(option);
                    }
                  }}
                  description={selectedLadderType === 'Rating' ? 
                    "Problems filtered by Codeforces rating" : 
                    "Problems organized by division difficulty"
                  }
                />
      
                {/* View Ladder Button */}
                <div className="pt-4">
                  <button 
                    onClick={handleViewLadder}
                    disabled={isLoading} 
                    className={`
                      w-full 
                      bg-gradient-to-r 
                      from-blue-600 
                      to-indigo-700 
                      text-white 
                      font-medium 
                      px-6 
                      py-3 
                      rounded-lg 
                      transition-all 
                      duration-300 
                      transform 
                      ${isLoading ? 'opacity-80' : 'hover:scale-[1.02] hover:shadow-blue-500/20'} 
                      shadow-lg
                      flex 
                      items-center 
                      justify-center
                      border border-blue-500/30
                      relative
                      overflow-hidden
                    `}
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
                        <ChevronRight className="h-5 w-5 ml-2" />
                        
                        {/* Button shine effect */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full duration-1000 transform"></div>
                        </div>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-400 mt-3">
                  {selectedLadderType === 'Rating' ? 
                    <div className="flex items-center justify-center">
                      <Zap className="h-4 w-4 mr-1 text-blue-400" />
                      <span>Problems suitable for your current rating level</span>
                    </div> :
                    <div className="flex items-center justify-center">
                      <Zap className="h-4 w-4 mr-1 text-blue-400" />
                      <span>Problems grouped by Codeforces division level</span>
                    </div>
                  }
                </div>
              </div>
            </div>
            
            {/* Help information */}
            <div className="mt-6 text-sm text-gray-400 border-t border-gray-700/50 pt-4">
              <div className="flex justify-between items-center">
                <p>
                  The A2OJ Ladder provides a collection of problems organized by difficulty to help you improve your
                  competitive programming skills systematically.
                </p>
                {(username || selectedLadderType !== 'Rating' || selectedRating !== 'Codeforces Rating < 1300' || selectedDivision !== 'Division A') && (
                  <button 
                    onClick={clearAllSavedData}
                    className="text-xs text-red-400 hover:text-red-300 ml-4 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear saved data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default A2oJ;