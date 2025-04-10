import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Star, 
  BookOpen, 
  Code 
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
  "Codeforces",
  "Codechef", 
  "LeetCode",
  "Atcoder",
  "GeeksForGeeks", 
  "OEIS",
  "USACO Guide",
  "CP-Algorithms",
  "Topcoder",
  "CSES"
];

const CPRoadmap = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [completedTopics, setCompletedTopics] = useState({});

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

  return (
    <div className="bg-white p-6 md:p-10 space-y-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-black p-4 rounded-full shadow-lg mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Competitive Programming Roadmap</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive learning path to master competitive programming from basics to advanced topics
        </p>
      </div>

      {/* Roadmap Sections */}
      <div className="space-y-6">
        {RoadmapData.map((section, sectionIndex) => (
          <div 
            key={sectionIndex} 
            className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm"
          >
            <div 
              onClick={() => toggleSection(section.title)}
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold">{section.title}</h2>
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
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition"
                    >
                      <button 
                        onClick={() => toggleTopicCompletion(section.title, topic)}
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center
                          ${completedTopics[`${section.title}-${topic}`] 
                            ? 'bg-green-500 text-white' 
                            : 'border-2 border-gray-300'}
                        `}
                      >
                        {completedTopics[`${section.title}-${topic}`] && <Check className="h-4 w-4" />}
                      </button>
                      <span 
                        className={`
                          text-sm 
                          ${completedTopics[`${section.title}-${topic}`] 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-800'}
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
        ))}
      </div>

      {/* Useful Links */}
      <div className="bg-gray-50 rounded-2xl p-8 mt-10">
        <div className="flex items-center mb-6">
          <Code className="h-8 w-8 mr-4 text-black" />
          <h2 className="text-2xl font-bold">Useful Learning Resources</h2>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {UsefulLinks.map((link, index) => (
            <a 
              key={index} 
              href="#" 
              className="bg-white p-4 rounded-lg text-center font-medium hover:bg-gray-100 transition shadow-sm"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CPRoadmap;