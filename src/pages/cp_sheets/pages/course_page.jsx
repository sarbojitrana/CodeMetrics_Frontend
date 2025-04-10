import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code,
  BookOpen,
  Calendar,
  ChevronRight,
  Award,
  GraduationCap,
  Github,
  ExternalLink,
} from "lucide-react";
import Cp_Sheets from "./cp_sheets1/cp_sheets";
import UpcomingContest from "./upcoming_contest/upcoming_contest";

// Logo Component with subtle animation
const CodeMetricsLogo = () => (
  <div className="flex items-center group">
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
      <span className="font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
        CodeMetrics
      </span>
      <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"></div>
    </div>
  </div>
);

// Stats Card Component
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 transform hover:-translate-y-1">
    <div className="flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-white font-semibold text-xl">{value}</p>
      </div>
    </div>
  </div>
);

// Footer Logo Component - smaller version for footer
const FooterLogo = () => (
  <div className="flex items-center group">
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
        {/* Header section with animation */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300">
          <div className="flex flex-col items-center text-center gap-4">
            <CodeMetricsLogo />
            <p className="text-gray-300 text-sm max-w-2xl">
              Elevate your coding skills with structured learning paths and
              challenging contests designed by industry experts
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
        <div className="bg-black/40 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-blue-900/30">
          <div
            className={`relative ${activeTab === 0 ? "h-auto" : "h-[700px] "}`}
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

      {/* Footer Section */}

      <footer className="mt-16 max-w-6xl mx-auto w-full">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 flex items-center justify-center">
          <FooterLogo />
          <span className="text-gray-400 text-base ml-6">
            © 2025 CodeMetrics. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default CoursePage;
