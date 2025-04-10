import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  ArrowRight, 
  Share2, 
  FileText, 
  Code, 
  User, 
  Star, 
  ExternalLink,
  RefreshCw, 
  ArrowLeft, 
  CheckCircle, 
  MessageSquare
} from 'lucide-react';
import { useNavigate,useParams } from 'react-router-dom';

// CodeMetrics Logo Component
const CodeMetricsLogo = () => (
  <div className="flex items-center">
    <div className="relative h-12 sm:h-16 w-16 sm:w-20">
      {/* Center logo image */}
      <div className="absolute left-2 right-2 sm:left-4 sm:right-4 top-1/2 -translate-y-1/2 flex justify-center">
        <img
          src="/logo2.png" // Make sure this exists in the public folder
          alt="Codemetrics Logo"
          className="h-8 sm:h-12 object-contain" // Small on mobile, original size on desktop
        />
      </div>
    </div>

    <span className="font-extrabold text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
      CodeMetrics
    </span>
  </div>
);

const CPDashboard = () => {
   const { email } = useParams();
  const navigate = useNavigate();
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  const feedbackFormUrl = "https://forms.gle/XqQ8CFTPYECdVLZ17";
  const shareUrl = "https://codemetrics-rosy.vercel.app/";
  const shareMessage = "Check out CodeMetrics - the ultimate tool for tracking competitive programming progress! Join me in improving our coding skills.";

  // Handle go back function
  const handleGoBack = () => {
    navigate(-1);
  };

  // Share functionality
  const handleShare = async () => {
    setShowSharePopup(true);
    
    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeMetrics',
          text: shareMessage,
          url: shareUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  // Close share popup
  const closeSharePopup = () => {
    setShowSharePopup(false);
    setShareSuccess(false);
  };

  // Dummy navigation functions
  const navigateToLeaderboard = () => {
    navigate(`/username-management/${email}`);
  };

  const navigateToCPSheets = () => {
    navigate('/cp-sheets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header section with logo */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-xl border border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={handleGoBack}
                className="bg-blue-600/80 hover:bg-blue-500 p-2 sm:p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-blue-500/20"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <CodeMetricsLogo />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 bg-green-600/80 hover:bg-green-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all shadow-lg hover:shadow-green-500/20 text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Share
              </button>
              
              <button 
                className="flex items-center gap-1 sm:gap-2 bg-blue-600/80 hover:bg-blue-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="mt-2 sm:mt-4">
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              CP Dashboard
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 sm:mt-2">
              Track your progress, compete with friends, and level up your competitive programming skills.
            </p>
          </div>
        </div>

        {/* Main content - Two cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Leaderboard Card */}
          <div className="group bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden hover:shadow-blue-500/10 transition-shadow">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:opacity-50 transition-opacity"></div>
              <div className="h-32 sm:h-40 flex items-center justify-center p-6 relative">
                <Award className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 opacity-80 group-hover:scale-110 transition-transform" />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-600/10 rounded-full blur-xl"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-700/30">
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-2">
                Your Leaderboard
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mb-4">
                Track your progress against friends and top competitors. See who's climbing the ranks fastest.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span>Compare with other coders</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span>Track rating changes</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span>Monitor problem-solving streak</span>
                </div>
              </div>
              
              <button 
                onClick={navigateToLeaderboard}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all group"
              >
                <span className="text-xs sm:text-sm font-medium">View Your Leaderboard</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* CP Sheets Card */}
          <div className="group bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 overflow-hidden hover:shadow-purple-500/10 transition-shadow">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:opacity-50 transition-opacity"></div>
              <div className="h-32 sm:h-40 flex items-center justify-center p-6 relative">
                <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-purple-400 opacity-80 group-hover:scale-110 transition-transform" />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-600/10 rounded-full blur-xl"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-pink-600/10 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-700/30">
              <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
                CP Sheets
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm mb-4">
                Access curated problem sets and practice sheets designed to level up your competitive programming skills.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                  <span>Structured learning paths</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span>Topic-wise problem sets</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-2">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span>Difficulty progression</span>
                </div>
              </div>
              
              <button 
                onClick={navigateToCPSheets}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all group"
              >
                <span className="text-xs sm:text-sm font-medium">Access CP Sheets</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-6 sm:mt-8 bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-3 sm:mb-4">
            Your CP Journey
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Problems Solved</p>
              <p className="text-blue-300 text-xl sm:text-2xl font-bold">247</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Current Rating</p>
              <p className="text-green-300 text-xl sm:text-2xl font-bold">1856</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Streak</p>
              <p className="text-yellow-300 text-xl sm:text-2xl font-bold">14 days</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Global Rank</p>
              <p className="text-purple-300 text-xl sm:text-2xl font-bold">#4,392</p>
            </div>
          </div>
        </div>
        
        {/* Featured Contest */}
        <div className="mt-6 sm:mt-8 bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Upcoming Contest
            </h2>
            
            <a 
              href="https://codeforces.com/contests" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
            >
              View All
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-3 sm:p-4 border border-blue-700/30">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h3 className="font-semibold text-blue-300 text-sm sm:text-base">Codeforces Round #999 (Div. 2)</h3>
                <p className="text-gray-400 text-xs mt-1">Duration: 2 hours</p>
              </div>
              
              <div className="flex items-center sm:items-start gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Starts In</p>
                  <p className="text-yellow-300 font-bold text-sm sm:text-base">2d 14h 32m</p>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer action buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <a 
            href="https://codeforces.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 overflow-hidden text-xs sm:text-sm"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Visit Codeforces</span>
            </span>
          </a>
          
          <a 
            href={feedbackFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 overflow-hidden text-xs sm:text-sm"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Give Feedback</span>
            </span>
          </a>
        </div>

        {/* Footer with logo */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-700/30 flex justify-center">
          <div className="text-center">
            <div className="scale-75 sm:scale-100">
              <CodeMetricsLogo />
            </div>
            <p className="text-gray-500 text-xs mt-1 sm:mt-2">
              Track your competitive programming progress
            </p>
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-4 sm:p-6 max-w-md w-full relative animate-fade-in">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-300 flex items-center gap-2">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Share CodeMetrics
            </h3>
            
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm">
              {shareMessage}
            </p>
            
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-gray-700 flex items-center">
              <p className="text-gray-400 text-xs sm:text-sm truncate flex-1">{shareUrl}</p>
              <button 
                onClick={async () => {
                  await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
                  setShareSuccess(true);
                  setTimeout(() => setShareSuccess(false), 3000);
                }}
                className="ml-2 sm:ml-3 bg-blue-600 hover:bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm flex-shrink-0"
              >
                Copy
              </button>
            </div>
            
            {shareSuccess && (
              <div className="mb-4 p-2 sm:p-3 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg text-green-300 flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>Link copied to clipboard!</span>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={closeSharePopup}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CPDashboard;