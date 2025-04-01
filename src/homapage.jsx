import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Trophy,
  Medal,
  Code,
  Activity,
  ChevronUp,
  ExternalLink,
  Loader,
  RefreshCw,
  Filter,
  User,
  Award,
  ChevronsUp,
  Github,
} from "lucide-react";
import UsernameAdder from "./add";

import { useNavigate, useParams } from "react-router-dom";
import { fetchusernames } from "./utils/user";
import { userid } from "./utils/auth";

const HomePage = () => {
  const { email } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("submissions");
  const [timeRange, setTimeRange] = useState(7);
  const [userId, setUserId] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  // Fetch user ID when email changes
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

  // Fetch usernames when userId changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      if (!userId) return;
      
      try {
        const response = await fetchusernames(userId);
        if (!isMounted) return;
        
        if (response.success) {
            setUsersList(response.message.map(username => ({ codeforcesUsername: username })));
        } else {
          setError(response.message || "Failed to fetch usernames");
        }
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to fetch usernames. Please try again later.");
      }
    };
    
    if (userId) {
      fetchUsers();
    }
    
    return () => {
      isMounted = false;
    };
  }, [userId, refreshTrigger]);

  const fetchUserInfoBatch = useCallback(async () => {
    if (usersList.length === 0) return {};
    
    // Split into batches to avoid API limitations
    const batchSize = 50; // Codeforces max handles per request
    const batches = [];
    
    for (let i = 0; i < usersList.length; i += batchSize) {
      batches.push(usersList.slice(i, i + batchSize));
    }
    
    let combinedResults = {};
    let errorCount = 0;
    
    for (const batch of batches) {
      const handles = batch
        .map(user => user.codeforcesUsername)
        .filter(Boolean)
        .join(";");
      
      if (!handles) continue;
      
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${handles}`
        );
        
        if (!response.ok) {
          errorCount++;
          console.warn("Failed to fetch batch, status:", response.status);
          // Continue with other batches rather than failing completely
          continue;
        }
        
        const data = await response.json();
        
        if (data.status === "OK" && Array.isArray(data.result)) {
          const batchResults = data.result.reduce((acc, user) => {
            acc[user.handle] = user;
            return acc;
          }, {});
          
          combinedResults = {...combinedResults, ...batchResults};
        }
      } catch (error) {
        errorCount++;
        console.error("Error fetching batch:", error);
        // Continue with other batches
      }
      
      // Add delay between batches to avoid rate limiting
      if (batches.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    }
    
    if (errorCount === batches.length && batches.length > 0) {
      throw new Error("Failed to fetch any user data from Codeforces API");
    }
    
    return combinedResults;
  }, [usersList]);

  const fetchUserDataForUser = useCallback(async (user, userInfo) => {
    if (!user.codeforcesUsername) {
      return {
        username: user.codeforcesUsername || "Unknown",
        weeklyAcceptedSubmissions: 0,
        uniqueProblemsSolved: 0,
        submissionStreak: 0,
        totalSubmissions: 0,
        rating: "N/A",
        rank: "unrated",
        profileUrl: "#",
        error: true,
        id: `unknown-${Math.random()}`
      };
    }
    
    try {
      const cfSubmissionsResponse = await fetch(
        `https://codeforces.com/api/user.status?handle=${user.codeforcesUsername}&from=1&count=100`
      );

      if (!cfSubmissionsResponse.ok) {
        throw new Error(`Submissions API failed: ${cfSubmissionsResponse.status}`);
      }

      const cfSubmissionsData = await cfSubmissionsResponse.json();

      const rangeCutoff = Date.now() - timeRange * 24 * 60 * 60 * 1000;
      const recentSubmissions =
        cfSubmissionsData.result?.filter(
          (sub) => sub.creationTimeSeconds * 1000 >= rangeCutoff
        ) || [];

      const acceptedSubmissions = recentSubmissions.filter(
        (sub) => sub.verdict === "OK"
      );
      
      const uniqueProblemIds = new Set();
      acceptedSubmissions.forEach(sub => {
        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
        uniqueProblemIds.add(problemId);
      });

      const submissionDays = new Set();
      recentSubmissions.forEach((sub) => {
        const date = new Date(sub.creationTimeSeconds * 1000);
        submissionDays.add(
          `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        );
      });

      return {
        username: user.codeforcesUsername,
        weeklyAcceptedSubmissions: acceptedSubmissions.length,
        uniqueProblemsSolved: uniqueProblemIds.size,
        submissionStreak: submissionDays.size,
        totalSubmissions: recentSubmissions.length,
        rating: userInfo?.rating || "N/A",
        rank: userInfo?.rank || "unrated",
        profileUrl: `https://codeforces.com/profile/${user.codeforcesUsername}`,
        avatar: userInfo?.avatar,
        id: user.codeforcesUsername
      };
    } catch (error) {
      console.error("Error fetching data for", user.codeforcesUsername, error);
      return {
        username: user.codeforcesUsername,
        weeklyAcceptedSubmissions: 0,
        uniqueProblemsSolved: 0,
        submissionStreak: 0,
        totalSubmissions: 0,
        rating: userInfo?.rating || "N/A", 
        rank: userInfo?.rank || "error",
        profileUrl: `https://codeforces.com/profile/${user.codeforcesUsername}`,
        error: true,
        id: user.codeforcesUsername
      };
    }
  }, [timeRange]);

  const fetchWithDelay = useCallback(async (user, userInfoMap, delay) => {
    await new Promise((res) => setTimeout(res, delay));
    return fetchUserDataForUser(
      user,
      userInfoMap[user.codeforcesUsername] || {}
    );
  }, [fetchUserDataForUser]);

  const sortUserData = useMemo(() => {
    return (userData) => {
      return [...userData].sort((a, b) => {
        switch (sortBy) {
          case "submissions":
            return b.weeklyAcceptedSubmissions - a.weeklyAcceptedSubmissions;
          case "problems":
            return b.uniqueProblemsSolved - a.uniqueProblemsSolved;
          case "streak":
            return b.submissionStreak - a.submissionStreak;
          case "rating":
            // Handle "N/A" ratings
            const ratingA = a.rating === "N/A" ? -1 : a.rating;
            const ratingB = b.rating === "N/A" ? -1 : b.rating;
            return ratingB - ratingA;
          default:
            return b.weeklyAcceptedSubmissions - a.weeklyAcceptedSubmissions;
        }
      });
    };
  }, [sortBy]);

  const fetchUserData = useCallback(async () => {
    if (usersList.length === 0) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user info in batch
      const userInfoMap = await fetchUserInfoBatch();
      const promises = [];
      
      // Add delay between requests to avoid rate-limiting
      usersList.forEach((user, index) => {
        promises.push(fetchWithDelay(user, userInfoMap, index * 300));
      });
      
      const updatedUsers = await Promise.all(promises);
      const sortedUsers = sortUserData(updatedUsers);
      
      setUsers(sortedUsers);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch user data. Please try again later.");
      setLoading(false);
      console.error("Error in fetchUserData:", err);
    }
  }, [usersList, fetchUserInfoBatch, fetchWithDelay, sortUserData]);

  // Fetch user data when usersList or timeRange changes
  useEffect(() => {
    if (usersList.length > 0) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [usersList, timeRange, fetchUserData]);

  // Update users when sortBy changes, without refetching data
  useEffect(() => {
    if (users.length > 0) {
      const sortedUsers = sortUserData(users);
      setUsers(sortedUsers);
    }
  }, [sortBy, sortUserData]);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-gray-100 text-gray-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy size={20} className="text-yellow-500" />;
      case 1:
        return <Medal size={20} className="text-gray-400" />;
      case 2:
        return <Medal size={20} className="text-orange-500" />;
      default:
        return <span className="text-sm font-semibold">{index + 1}</span>;
    }
  };

  const getCFRankColor = (rank) => {
    if (!rank) return "text-gray-400";
    if (rank.includes("legendary")) return "text-red-500";
    if (rank.includes("international")) return "text-orange-500";
    if (rank.includes("grandmaster")) return "text-red-500";
    if (rank.includes("master")) return "text-orange-400";
    if (rank.includes("candidate")) return "text-purple-500";
    if (rank.includes("expert")) return "text-blue-500";
    if (rank.includes("specialist")) return "text-cyan-500";
    if (rank.includes("pupil")) return "text-green-500";
    if (rank.includes("newbie")) return "text-gray-500";
    return "text-gray-400";
  };

  const handleUserAdded = () => {
    // Trigger a refresh by updating the refreshTrigger state
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = () => {
    fetchUserData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-400 mb-3">
            <Code size={32} className="text-blue-300" />
            <span>Codeforces Leaderboard</span>
          </h1>
          <p className="text-teal-400 text-lg font-medium">
            Track your competitive programming progress
          </p>
        </header>

        <div className="bg-gray-800/80 backdrop-blur shadow-lg rounded-lg p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-blue-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Time range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Last 24 hours</option>
                <option value={3}>Last 3 days</option>
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Sort by:</span>
            <div className="flex shadow-sm">
              <button
                className={`px-3 py-1 text-sm rounded-l border border-gray-600 transition-all ${
                  sortBy === "submissions"
                    ? "bg-blue-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("submissions")}
              >
                Submissions
              </button>
              <button
                className={`px-3 py-1 text-sm border-t border-b border-gray-600 transition-all ${
                  sortBy === "problems"
                    ? "bg-blue-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("problems")}
              >
                Problems
              </button>
              <button
                className={`px-3 py-1 text-sm border-t border-b border-gray-600 transition-all ${
                  sortBy === "streak"
                    ? "bg-blue-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("streak")}
              >
                Streak
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-r border border-gray-600 transition-all ${
                  sortBy === "rating"
                    ? "bg-blue-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("rating")}
              >
                Rating
              </button>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors shadow-md hover:shadow-lg active:shadow-inner disabled:opacity-50 disabled:pointer-events-none"
            disabled={loading}
          >
            {loading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-800/80 backdrop-blur rounded-lg shadow-lg">
            <Loader className="animate-spin text-blue-400 mb-4" size={40} />
            <p className="text-gray-300">Fetching latest submissions data...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a moment as we collect data from Codeforces API</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-900/20 backdrop-blur rounded-lg shadow-lg">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {users.length === 0 ? (
              <div className="text-center p-12 bg-gray-800/80 backdrop-blur rounded-lg shadow-lg">
                <p className="text-gray-300 mb-4">No users found. Add some users to track.</p>
              </div>
            ) : (
              <div className="bg-gray-800/80 backdrop-blur rounded-lg shadow-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/60 text-left">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          Programmer
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Submissions</span>
                            {sortBy === "submissions" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Problems</span>
                            {sortBy === "problems" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Streak</span>
                            {sortBy === "streak" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Rating</span>
                            {sortBy === "rating" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          Profile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user, index) => (
                        <tr
                          key={user.id || `user-${index}`}
                          className={`hover:bg-blue-900/20 transition-colors ${
                            index < 3 ? "font-medium" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full ${getMedalColor(
                                index
                              )} shadow-md`}
                            >
                              {getRankIcon(index)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              onClick={() =>
                                user.username && navigate(`/user-detail/${user.username}`)
                              }
                              className={`flex items-center gap-2 ${user.username ? "cursor-pointer hover:text-blue-300 transition-colors" : ""}`}
                            >
                              <User size={16} className="text-gray-400" />
                              <span>{user.username || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Activity size={16} className="text-teal-400" />
                              <span className="tabular-nums font-medium">
                                {user.weeklyAcceptedSubmissions}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Code size={16} className="text-blue-400" />
                              <span className="tabular-nums font-medium">
                                {user.uniqueProblemsSolved}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <ChevronsUp size={16} className="text-purple-400" />
                              <span className="tabular-nums font-medium">
                                {user.submissionStreak} days
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-yellow-400" />
                              <span
                                className={`tabular-nums font-medium ${getCFRankColor(
                                  user.rank
                                )}`}
                              >
                                {user.rating !== "N/A" ? user.rating : "0"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.profileUrl && user.profileUrl !== "#" ? (
                              <a
                                href={user.profileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center"
                              >
                                <ExternalLink size={16} />
                                <span className="sr-only">View Profile</span>
                              </a>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <footer className="flex flex-wrap justify-between items-center text-sm text-gray-400 gap-2">
              <p>Last updated: {new Date().toLocaleString()}</p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gray-300 transition-colors"
              >
                <Github size={14} />
                <span>View source code</span>
              </a>
            </footer>
          </div>
        )}
        <div className="mt-6 flex items-center justify-center">
          <UsernameAdder userId={userId} onAddUser={handleUserAdded} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;