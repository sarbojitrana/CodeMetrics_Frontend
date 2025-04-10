import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  Share2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Code
} from "lucide-react";
import Cp_Sheets from "./cp_sheets1/cp_sheets";
import UpcomingContest from "./upcoming_contest/upcoming_contest";

// Enhanced Logo Component with subtle animation
const CodeMetricsLogo = () => (
  <div className="flex items-center group">
    <div className="relative h-12 sm:h-16 w-16 sm:w-20">
      <div className="absolute left-2 right-2 sm:left-4 sm:right-4 top-1/2 -translate-y-1/2 flex justify-center">
        <img
          src="/logo2.png"
          alt="Codemetrics Logo"
          className="h-8 sm:h-12 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
    <div className="relative">
      <span className="font-extrabold text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
        CodeMetrics
      </span>
      <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"></div>
    </div>
  </div>
);

// Footer Logo Component - smaller version for footer
const FooterLogo = () => (
  <div className="flex items-center justify-center group scale-75 sm:scale-100">
    <div className="relative h-16 w-20">
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-center">
        <img
          src="/logo2.png"
          alt="Codemetrics Logo"
          className="h-12 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
    <div className="relative">
      <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
        CodeMetrics
      </span>
    </div>
  </div>
);

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
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
      } finally {
        setTimeout(() => setShowSharePopup(false), 3000);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
        setShareSuccess(true);
        setTimeout(() => {
          setShareSuccess(false);
          setShowSharePopup(false);
        }, 3000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        setTimeout(() => setShowSharePopup(false), 3000);
      }
    }
  };

  // Close share popup
  const closeSharePopup = () => {
    setShowSharePopup(false);
    setShareSuccess(false);
  };
    
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  // Detect scroll in content area
  const handleScroll = (e) => {
    if (e.target.scrollTop > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-xl text-sm font-semibold 
        transition-all duration-300 
        flex items-center gap-2
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-700/20 scale-105"
            : "bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white border border-gray-700/50"
        }
      `}
    >
      <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 text-white p-4 md:p-6 flex flex-col">
      <div className="max-w-5xl mx-auto flex-grow w-full">
        {/* Enhanced Header section with animation */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={handleGoBack}
                className="bg-blue-600/80 hover:bg-blue-500 p-2 sm:p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-blue-500/20"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <CodeMetricsLogo />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 bg-green-600/80 hover:bg-green-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all shadow-lg hover:shadow-green-500/20 text-xs sm:text-sm"
                aria-label="Share"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Share
              </button>
              
              <button 
                className="flex items-center gap-1 sm:gap-2 bg-blue-600/80 hover:bg-blue-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 text-xs sm:text-sm"
                aria-label="Refresh"
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <TabButton
            icon={BookOpen}
            label="Problem Sheets"
            isActive={activeTab === 0}
            onClick={() => handleTabChange(0)}
          />
          <TabButton
            icon={Calendar}
            label="Upcoming Contests"
            isActive={activeTab === 1}
            onClick={() => handleTabChange(1)}
          />
        </div>

        {/* Content Area */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-blue-900/30 border border-gray-700/40">
          <div
            className={`relative ${activeTab === 0 ? "h-auto" : "h-[700px]"}`}
          >
            {/* Top gradient fade effect that changes with scroll - only show for Upcoming Contests */}
            {activeTab === 1 && (
              <div
                className={`absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-10 transition-opacity duration-300 ${
                  isScrolled ? "opacity-100" : "opacity-0"
                }`}
              ></div>
            )}

            {/* Content with conditional height and scrollbar */}
            <div
              className={`p-6 ${
                activeTab === 0
                  ? "h-auto"
                  : "h-full overflow-y-auto custom-scrollbar"
              }`}
              onScroll={activeTab === 1 ? handleScroll : undefined}
            >
              {activeTab === 0 ? <Cp_Sheets /> : <UpcomingContest />}
            </div>

            {/* Bottom gradient fade effect - only show for Upcoming Contests */}
            {activeTab === 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            )}
          </div>
        </div>
      </div>

      {/* Share Success Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-4 sm:p-6 max-w-md w-full relative animate-fadeIn">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 sm:w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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

      {/* Enhanced Footer Section */}
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
  );
};

export default CoursePage;