import React, { useState, useEffect } from "react";
import {
  Code,
  Layers,
  BookOpen,
  ExternalLink,
  ArrowRight,
  Activity,
  Hash,
  Award,
  Star,
  FileText,
  Clock,
  Users,
} from "lucide-react";
import CP31 from "./cp31_page";
import A2oJ from "./A2oj_page";

const Cp_Sheets = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionState, setTransitionState] = useState("fadeIn");

  // Load content with fade effect
  useEffect(() => {
    setPage(<CP31 />);
    setIsLoading(false);
  }, []);

  const handleTabChange = (tabIndex) => {
    if (tabIndex === activeTab) return;

    // Animate transition
    setTransitionState("fadeOut");

    setTimeout(() => {
      setIsLoading(true);
      setActiveTab(tabIndex);

      setTimeout(() => {
        if (tabIndex === 0) {
          setPage(<CP31 />);
        } else {
          setPage(<A2oJ />);
        }
        setIsLoading(false);
        setTransitionState("fadeIn");
      }, 150);
    }, 150);
  };

  // Detailed tab data with additional information
  const tabs = [
    {
      title: "CP31 Sheet",
      icon: <Code />,
      description:
        "A structured problem set covering key competitive programming concepts with progressive difficulty",
      color: "from-blue-600 to-blue-800",
      lightColor: "from-blue-500/20 to-blue-700/20",
      problemCount: 450,
      topics: 31,
      difficulty: "Beginner to Advanced",
      tags: ["Implementation", "Greedy", "DP", "Graphs"],
    },
    {
      title: "A2OJ Ladder",
      icon: <Layers />,
      description:
        "Difficulty-based problem sets organized as a ladder to improve your rating",
      color: "from-indigo-600 to-indigo-800",
      lightColor: "from-indigo-500/20 to-indigo-700/20",
      problemCount: 1350,
      topics: 42,
      difficulty: "Rating-based",
      tags: ["Div 2", "Div 1", "Contest Problems"],
    },
  ];

  // Feature cards for each tab
  const features = [
    [
      {
        icon: <FileText />,
        title: "450+ Problems",
        description: "Carefully selected problems",
      },
      {
        icon: <Activity />,
        title: "Progressive Difficulty",
        description: "From easy to challenging",
      },
      {
        icon: <BookOpen />,
        title: "31 Core Topics",
        description: "Comprehensive coverage",
      },
    ],
    [
      {
        icon: <Star />,
        title: "Rating Based",
        description: "Problems by CF rating",
      },
      {
        icon: <Users />,
        title: "Community Favorite",
        description: "Used by thousands",
      },
      {
        icon: <Clock />,
        title: "Time Tested",
        description: "Proven learning path",
      },
    ],
  ];

  return (
    <div className="min-h-full">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`
                py-3 px-5 rounded-xl transition-all duration-300
                flex items-center gap-3
                ${
                  activeTab === index
                    ? `bg-gradient-to-r ${
                        tab.color
                      } text-white shadow-lg shadow-${
                        tab.color.split("-")[1]
                      }-600/20 scale-105`
                    : "bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white border border-gray-700/50"
                }
              `}
            >
              <div
                className={`
                p-1.5 rounded-lg bg-gradient-to-r 
                ${
                  activeTab === index
                    ? "from-white/20 to-white/5"
                    : tab.lightColor
                }
              `}
              >
                {React.cloneElement(tab.icon, {
                  className: `h-4 w-4 ${
                    activeTab === index ? "text-white" : "text-blue-400"
                  }`,
                })}
              </div>
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Loading State */}
      <div className=" backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div
          className={`relative transition-all duration-300 ${
            transitionState === "fadeIn" ? "opacity-100" : "opacity-0"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="p-6">{page}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cp_Sheets;
