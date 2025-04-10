import React, { useState, useEffect } from "react";
import { CheckCircle, Award, ArrowLeft, Code, BarChart, Star, Users, ExternalLink, Trophy, Clock } from "lucide-react";
import { useLocation, Link } from 'react-router-dom';

const Rating_Ladder = () => {
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [problemsView, setProblemsView] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const location = useLocation();
  const { receivedData, handle } = location.state || {};

  useEffect(() => {
    if (Array.isArray(receivedData)) {
      setProblemsView(receivedData);
    }
  }, [receivedData]);

  useEffect(() => {
    if (handle) loadSolvedProblems(handle);
  }, [handle]);

  // Show confetti when the user has solved more than 75% of problems
  useEffect(() => {
    const solvedPercentage = (solvedCount / totalProblems) * 100;
    if (solvedPercentage >= 75 && solvedCount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [solvedProblems]);

  const loadSolvedProblems = async (handle) => {
    if (!handle) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle.trim()}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const solvedSet = new Set();
        data.result.forEach((submission) => {
          if (submission.verdict === "OK") {
            solvedSet.add(
              `${submission.problem.contestId}${submission.problem.index}`
            );
          }
        });
        setSolvedProblems(solvedSet);
      } else {
        alert("Could not find user. Please check the handle and try again.");
      }
    } catch (error) {
      alert("Failed to fetch solved problems. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating < 1200) return "text-gray-300 bg-gray-800/50 border-gray-700";
    if (rating < 1400) return "text-green-400 bg-green-900/30 border-green-700/50";
    if (rating < 1600) return "text-cyan-400 bg-cyan-900/30 border-cyan-700/50";
    if (rating < 1900) return "text-blue-400 bg-blue-900/30 border-blue-700/50";
    if (rating < 2100) return "text-purple-400 bg-purple-900/30 border-purple-700/50";
    if (rating < 2400) return "text-orange-400 bg-orange-900/30 border-orange-700/50";
    return "text-red-400 bg-red-900/30 border-red-700/50";
  };

  const getFilteredProblems = () => {
    if (activeFilter === 'solved') {
      return problemsView.filter(problem => {
        const id = `${problem[2]}${problem[3]}`;
        return solvedProblems.has(id);
      });
    } else if (activeFilter === 'unsolved') {
      return problemsView.filter(problem => {
        const id = `${problem[2]}${problem[3]}`;
        return !solvedProblems.has(id);
      });
    }
    return problemsView;
  };

  const totalProblems = problemsView.length;
  const solvedCount = problemsView.filter(problem =>
    solvedProblems.has(`${problem[2]}${problem[3]}`)
  ).length;
  const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;
  const filteredProblems = getFilteredProblems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-blue-900 py-8 px-4 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-indigo-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400 opacity-10 rounded-full blur-xl animate-pulse"></div>
      </div>

      {/* Confetti overlay - shown when achievement unlocked */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-blue-500/30 shadow-2xl max-w-md">
              <div className="text-center">
                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
                <p className="text-gray-300">You've solved over 75% of problems in this ladder!</p>
              </div>
            </div>
          </div>
          {/* Animated confetti particles */}
          {[...Array(50)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-pink-500', 'bg-purple-500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div 
                key={i}
                className={`absolute ${color} rounded-sm`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: '-20px',
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `confetti ${animationDuration}s linear forwards`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              ></div>
            );
          })}
        </div>
      )}

      <div className="mx-auto max-w-5xl relative">
        {/* Header */}
        <div className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700/50 transform transition-all hover:border-indigo-500/30 duration-500">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-indigo-400 mb-6 transition-all duration-300 group">
            <div className="p-2 rounded-full bg-gray-800/80 border border-gray-700/50 mr-2 group-hover:border-indigo-500/50 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </div>
            <span>Back to Ladder Selection</span>
          </Link>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                <Code className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400 text-transparent bg-clip-text">
              A2OJ Ladder
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Master competitive programming one problem at a time
            </p>
          </div>

          {/* User info and progress */}
          <div className="bg-gray-800/60 rounded-xl p-6 border border-gray-700/50 shadow-xl backdrop-blur-lg hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative">
                  <div className="p-3 rounded-full bg-gradient-to-br from-indigo-600/30 to-blue-700/30 border border-indigo-500/30 mr-4 shadow-lg shadow-indigo-900/20">
                    <Users className="h-6 w-6 text-indigo-400" />
                  </div>
                  {solvedCount > 0 && (
                    <div className="absolute -top-1 -right-1 p-1 rounded-full bg-green-500 border-2 border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-medium text-white flex items-center">
                    {handle || "Guest User"}
                    {progressPercentage > 50 && (
                      <Star className="h-4 w-4 text-yellow-400 ml-2" />
                    )}
                  </h2>
                  <p className="text-gray-400 flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>Solved {solvedCount} out of {totalProblems} problems</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/70 px-5 py-3 rounded-lg border border-gray-700/60 shadow-lg flex items-center gap-3 transform hover:translate-y-[-2px] transition-all">
                <BarChart className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="font-medium text-white text-lg">{Math.round(progressPercentage)}% Complete</div>
                  <div className="text-xs text-gray-400">{totalProblems - solvedCount} problems remaining</div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="w-full bg-gray-900/80 rounded-full h-5 mb-4 overflow-hidden border border-gray-800/80">
                <div
                  className="bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-400 h-5 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${Math.max(progressPercentage, 3)}%` }}
                >
                  {progressPercentage > 15 && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-full opacity-30 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-400 px-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
                  Beginner
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
                  Intermediate
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                  Advanced
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Problems list */}
        <div className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-2xl p-8 border border-gray-700/50 transform transition-all hover:border-indigo-500/30 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center text-white mb-4 md:mb-0">
              <Code className="h-6 w-6 mr-2 text-indigo-400" />
              Problems Collection
            </h2>
            
            {/* Filter buttons */}
            <div className="flex space-x-2 bg-gray-900/60 p-1 rounded-lg border border-gray-700/50">
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveFilter('all')}
              >
                All Problems
              </button>
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFilter === 'solved' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveFilter('solved')}
              >
                Solved
              </button>
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeFilter === 'unsolved' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveFilter('unsolved')}
              >
                Unsolved
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent relative">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-400/20"></div>
              </div>
              <p className="mt-4 text-gray-300 font-medium">Loading your progress...</p>
            </div>
          ) : (
            <>
              {filteredProblems.length === 0 ? (
                <div className="text-center py-10 bg-gray-800/60 rounded-xl border border-gray-700/50">
                  <Code className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium text-gray-300 mb-1">No problems found</h3>
                  <p className="text-gray-400">Try changing your filter or check back later</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProblems.map((problem, index) => {
                    const problemId = `${problem[2]}${problem[3]}`;
                    const isSolved = solvedProblems.has(problemId);

                    return (
                      <div
                        key={`${problemId}-${index}`}
                        className={`flex flex-col sm:flex-row sm:items-center p-5 rounded-xl border ${
                          isSolved 
                            ? "bg-gradient-to-r from-green-900/40 to-green-800/20 border-green-700/50" 
                            : "bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-700/50"
                        } hover:shadow-lg transition-all duration-300 group backdrop-blur-md transform hover:scale-[1.01] hover:border-indigo-500/30`}
                      >
                        <div className="flex items-center mb-3 sm:mb-0">
                          <div
                            className={`text-sm font-medium px-3 py-1 rounded-full border ${getRatingColor(
                              problem[0]
                            )}`}
                          >
                            {problem[0]}
                          </div>
                          
                          {isSolved && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-900/40 text-green-400 rounded-full text-sm border border-green-700/50 ml-3">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">Solved</span>
                            </div>
                          )}
                        </div>
                        
                        <a
                          href={`https://codeforces.com/problemset/problem/${problem[2]}/${problem[3]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow sm:ml-4 font-medium text-gray-200 group-hover:text-indigo-400 transition-colors flex items-center"
                        >
                          <span className="mr-2">{problem[1]}</span>
                          <span className="text-gray-500 text-sm">
                            ({problem[2]}{problem[3]})
                          </span>
                        </a>
                        
                        <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:ml-4">
                          <a
                            href={`https://codeforces.com/problemset/problem/${problem[2]}/${problem[3]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-indigo-900/40 text-indigo-400 rounded-lg text-sm border border-indigo-700/50 flex items-center hover:bg-indigo-800/40 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span className="font-medium">Solve</span>
                          </a>
                          
                          <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{(problem[0]/100).toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Bottom stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="backdrop-blur-lg bg-black/40 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-indigo-900/40 border border-indigo-700/50 mr-3">
                <Trophy className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{solvedCount} Solved</h3>
                <p className="text-gray-400 text-sm">Keep up the good work!</p>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-black/40 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-900/40 border border-purple-700/50 mr-3">
                <BarChart className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{Math.round(progressPercentage)}% Complete</h3>
                <p className="text-gray-400 text-sm">Progress tracking</p>
              </div>
            </div>
          </div>
          
          <div className="backdrop-blur-lg bg-black/40 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-900/40 border border-blue-700/50 mr-3">
                <Code className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{totalProblems - solvedCount} Remaining</h3>
                <p className="text-gray-400 text-sm">Challenges await!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS animation for confetti */}
      <style jsx>{`
        @keyframes confetti {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Rating_Ladder;