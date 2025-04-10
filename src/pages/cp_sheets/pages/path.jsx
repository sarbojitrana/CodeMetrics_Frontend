import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Star, 
  BookOpen, 
  Code,
  ExternalLink,
  Award 
} from 'lucide-react';

const RoadmapData = [
    {
      title: "Basics of Programming",
      topics: [
        "C++ Basic",
        "I/O, Conditional Statements", 
        "Loops, Pointers",
        "Array, String",
        "Function"
      ]
    },
    {
      title: "Time and Space Complexity",
      topics: [
        "Time Complexity",
        "Space Complexity", 
        "Asymptotic Notation"
      ]
    },
    {
      title: "STL",
      topics: [
        "Vector and Pair",
        "Iterator",
        "Map and Set",
        "Stack, Queue, Dequeue and Priority-Queue", 
        "STL algorithms",
        "Sorting and Comparator Function"
      ]
    },
    {
      title: "Array's Algorithm",
      topics: [
        "Kadane's Algorithm",
        "Window Sliding",
        "Dutch National Flag Algorithm", 
        "Searching and Sorting",
        "Prefix and Suffix sum",
        "Two Pointer",
        "2D Array"
      ]
    },
    {
      title: "String's Algorithm",
      topics: [
        "KMP Algorithm",
        "Rabin Karp Algorithm", 
        "Z-Algorithm"
      ]
    },
    {
      title: "Greedy Algorithm",
      topics: [
        "Activity Selection Problems",
        "Egyptian Fraction", 
        "Job Sequencing",
        "Minimum Swaps for Bracket Balancing"
      ]
    },
    {
      title: "Binary Search",
      topics: [
        "Binary Search I",
        "Binary Search II", 
        "Binary Search III",
        "Ternary Search"
      ]
    },
    {
      title: "Number Theory",
      topics: [
        "Euclid's GCD algorithm and Extended Euclid algorithm",
        "Basic Modular Arithmetic",
        "Modular Exponentiation", 
        "Modular Inverse",
        "Prime Factorization of a number",
        "Sieve of Eratosthenes",
        "Segmented Sieve",
        "Euler Totient Function",
        "Fermat's Little Theorem",
        "NCR mod p calculation",
        "Lucas Theorem",
        "Chinese Remainder Theorem",
        "Mobius Function"
      ]
    },
    {
      title: "Recursion and Backtracking",
      topics: [
        "Recursion and Backtracking Basics",
        "Subset Sum",
        "Combination Sum", 
        "N queens Problem",
        "Sudoku Solver",
        "Rat in a Maze"
      ]
    },
    {
      title: "Bit Manipulation",
      topics: [
        "Number System",
        "Bitwise Operators", 
        "Bit Masking",
        "Binary Exponentiation"
      ]
    },
    {
      title: "Dynamic Programming",
      topics: [
        "Introduction",
        "One Dimensional DP",
        "Two Dimensional DP", 
        "Digit DP",
        "DP on Trees",
        "DP with Bitmask",
        "SOS DP",
        "Beginner to Advanced",
        "Non Trivial DP Tricks and Techniques",
        "CF Blog"
      ]
    },
    {
      title: "Graph",
      topics: [
        "Graph Representation",
        "DFS",
        "BFS", 
        "Bipartite Graph",
        "Topological Sort",
        "Kruskal's Algorithm",
        "Prims's Algorithm",
        "Dijkstra's Algorithm", 
        "Bellman Ford's Algorithm",
        "Floyd Warshall's Algorithm",
        "Bridge",
        "Articulation Points",
        "Strongly Connected Components (SCC)",
        "Tarjan's Algorithm for SCC"
      ]
    },
    {
      title: "Tree",
      topics: [
        "Traversal Techniques",
        "Binary Tree, BST, Balanced Binary Tree",
        "Binary Lifting",
        "Bridges, BridgeTree, Cutpoits, SCC, DFS Tree", 
        "Dynamic Programming on tree",
        "2K Decomposition of tree (and Lowest Common Ancestor)",
        "Kruskal Reconstruction Tree (KRT)",
        "Set Merging",
        "O(N^2) Distribution DP",
        "'Re-rooting' tree DP",
        "Centroid Decomposition",
        "Heavy-Light Decomposition",
        "UFDS on tree"
      ]
    },
    {
      title: "Miscellaneous Topics",
      topics: [
        "Trie",
        "Segment Tree & Fenwick Tree",
        "Game Theory", 
        "Probability & Expectation",
        "Matrix Exponention",
        "Euler Tour"
      ]
    }
  ];

const UsefulLinks = [
  { name: "Codeforces", url: "https://codeforces.com" },
  { name: "Codechef", url: "https://www.codechef.com" },
  { name: "LeetCode", url: "https://leetcode.com" },
  { name: "Atcoder", url: "https://atcoder.jp" },
  { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org" },
  { name: "OEIS", url: "https://oeis.org" },
  { name: "USACO Guide", url: "https://usaco.guide" },
  { name: "CP-Algorithms", url: "https://cp-algorithms.com" },
  { name: "Topcoder", url: "https://www.topcoder.com" },
  { name: "CSES", url: "https://cses.fi/problemset/" }
];

const CPRoadmap = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [completedTopics, setCompletedTopics] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleTopicCompletion = (section, topic) => {
    const key = `${section}-${topic}`;
    setCompletedTopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredRoadmap = RoadmapData.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.topics.some(topic => 
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;
  const totalTopicsCount = RoadmapData.reduce((total, section) => total + section.topics.length, 0);
  const completionPercentage = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-black text-white px-6 py-2 rounded-full shadow-lg mb-4">
            <Award className="h-6 w-6 mr-2" />
            <span className="font-medium">Competitive Programming Journey</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Master Competitive Programming
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A comprehensive, interactive learning path designed to transform you from a beginner to an advanced competitive programmer.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Code className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Learning Progress</h2>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-blue-600">{completionPercentage}% Complete</p>
              <p className="text-sm text-gray-500">
                {completedTopicsCount} of {totalTopicsCount} topics mastered
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{width: `${completionPercentage}%`}}
            ></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search topics, sections..." 
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Roadmap Sections */}
        <div className="space-y-6">
          {filteredRoadmap.map((section, sectionIndex) => {
            const Icon = section.icon || Star;
            return (
              <div 
                key={sectionIndex} 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div 
                  onClick={() => toggleSection(section.title)}
                  className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center space-x-4">
                    <Icon className="h-7 w-7 text-blue-600 group-hover:scale-110 transition" />
                    <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
                  </div>
                  {expandedSections[section.title] ? (
                    <ChevronUp className="h-6 w-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-600" />
                  )}
                </div>

                {expandedSections[section.title] && (
                  <div className="p-6 pt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.topics.map((topic, topicIndex) => (
                        <div 
                          key={topicIndex}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 hover:shadow-sm transition group"
                        >
                          <button 
                            onClick={() => toggleTopicCompletion(section.title, topic)}
                            className={`
                              w-6 h-6 rounded-full flex items-center justify-center
                              ${completedTopics[`${section.title}-${topic}`] 
                                ? 'bg-blue-500 text-white' 
                                : 'border-2 border-gray-300 group-hover:border-blue-300'}
                            `}
                          >
                            {completedTopics[`${section.title}-${topic}`] && <Check className="h-4 w-4" />}
                          </button>
                          <span 
                            className={`
                              text-sm flex-grow
                              ${completedTopics[`${section.title}-${topic}`] 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-800 group-hover:text-blue-600'}
                            `}
                          >
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Useful Links */}
        <div className="bg-white rounded-2xl p-8 mt-10 shadow-md">
          <div className="flex items-center mb-6">
            <ExternalLink className="h-8 w-8 mr-4 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Essential Platforms</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {UsefulLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 p-4 rounded-lg text-center font-medium hover:bg-blue-50 hover:text-blue-600 transition shadow-sm flex items-center justify-center group"
              >
                {link.name}
                <ExternalLink className="h-4 w-4 ml-2 text-gray-400 group-hover:text-blue-600 transition" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPRoadmap;