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
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchusernames } from "./utils/user";
import { userid } from "./utils/auth";

const HomePage = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("submissions");
  const [timeRange, setTimeRange] = useState(7);
  const [usersList, setUsersList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      if (!userId) return;

      try {
        const response = await fetchusernames(userId);
        if (!isMounted) return;

        if (response.success) {
          setUsersList(
            response.message.map((username) => ({
              codeforcesUsername: username,
            }))
          );
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
        .map((user) => user.codeforcesUsername)
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

          combinedResults = { ...combinedResults, ...batchResults };
        }
      } catch (error) {
        errorCount++;
        console.error("Error fetching batch:", error);
        // Continue with other batches
      }

      // Add delay between batches to avoid rate limiting
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }

    if (errorCount === batches.length && batches.length > 0) {
      throw new Error("Failed to fetch any user data from Codeforces API");
    }

    return combinedResults;
  }, [usersList]);

  const fetchUserDataForUser = useCallback(
    async (user, userInfo) => {
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
          id: `unknown-${Math.random()}`,
        };
      }

      try {
        const cfSubmissionsResponse = await fetch(
          `https://codeforces.com/api/user.status?handle=${user.codeforcesUsername}&from=1&count=100`
        );

        if (!cfSubmissionsResponse.ok) {
          throw new Error(
            `Submissions API failed: ${cfSubmissionsResponse.status}`
          );
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
        acceptedSubmissions.forEach((sub) => {
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
          id: user.codeforcesUsername,
        };
      } catch (error) {
        console.error(
          "Error fetching data for",
          user.codeforcesUsername,
          error
        );
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
          id: user.codeforcesUsername,
        };
      }
    },
    [timeRange]
  );

  const fetchWithDelay = useCallback(
    async (user, userInfoMap, delay) => {
      await new Promise((res) => setTimeout(res, delay));
      return fetchUserDataForUser(
        user,
        userInfoMap[user.codeforcesUsername] || {}
      );
    },
    [fetchUserDataForUser]
  );

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
        return "bg-yellow-300 text-yellow-800";
      case 1:
        return "bg-gray-300 text-gray-800";
      case 2:
        return "bg-orange-300 text-orange-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy size={20} className="text-yellow-600" />;
      case 1:
        return <Medal size={20} className="text-gray-600" />;
      case 2:
        return <Medal size={20} className="text-orange-600" />;
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
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    fetchUserData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-5xl font-bold mb-4">
            <Code size={48} className="text-cyan-400" />
            <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 text-transparent bg-clip-text">
              Codeforces Leaderboard
            </h1>
          </div>
          <p className="text-lg font-medium bg-gradient-to-r from-teal-400 to-blue-400 text-transparent bg-clip-text">
            Track your competitive programming progress with friends
          </p>
        </header>

        <div className="bg-gray-800/40 backdrop-blur-md shadow-xl rounded-xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 border border-blue-900/50">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-cyan-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Time range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <button
                className={`px-4 py-2 text-sm transition-all ${
                  sortBy === "submissions"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("submissions")}
              >
                Submissions
              </button>
              <button
                className={`px-4 py-2 text-sm transition-all ${
                  sortBy === "problems"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("problems")}
              >
                Problems
              </button>
              <button
                className={`px-4 py-2 text-sm transition-all ${
                  sortBy === "streak"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-inner"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setSortBy("streak")}
              >
                Streak
              </button>
              <button
                className={`px-4 py-2 text-sm transition-all ${
                  sortBy === "rating"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-inner"
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
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:shadow-inner disabled:opacity-50 disabled:pointer-events-none"
            disabled={loading}
          >
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            <span>{loading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-gray-800/40 backdrop-blur-md rounded-xl shadow-xl border border-blue-900/50">
            <div className="relative">
              <Loader className="animate-spin text-cyan-400 mb-6" size={50} />
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400 to-cyan-400 blur-xl opacity-20 rounded-full"></div>
            </div>
            <p className="text-gray-200 text-lg font-medium mb-2">Fetching latest submissions data...</p>
            <p className="text-gray-400 text-sm">
              This may take a moment as we collect data from Codeforces API
            </p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-900/20 backdrop-blur-md rounded-xl shadow-xl border border-red-900/50">
            <p className="text-red-300 mb-6 text-lg">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {users.length === 0 ? (
              <div className="text-center p-16 bg-gray-800/40 backdrop-blur-md rounded-xl shadow-xl border border-blue-900/50">
                <p className="text-gray-300 mb-6 text-lg">
                  No users found. Add some users to track.
                </p>
                <button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus size={18} />
                  <span>Add User</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-blue-900/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/70 text-left">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Programmer
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Submissions</span>
                            {sortBy === "submissions" && (
                              <ChevronUp size={14} />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Problems</span>
                            {sortBy === "problems" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Streak</span>
                            {sortBy === "streak" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>Rating</span>
                            {sortBy === "rating" && <ChevronUp size={14} />}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Profile
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {users.map((user, index) => (
                        <tr
                          key={user.id || `user-${index}`}
                          className={`hover:bg-blue-900/30 transition-all ${
                            index < 3 ? "font-medium" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`w-10 h-10 flex items-center justify-center rounded-full ${getMedalColor(
                                index
                              )} shadow-lg ${index < 3 ? "ring-2 ring-blue-400/50 ring-offset-2 ring-offset-gray-800" : ""}`}
                            >
                              {getRankIcon(index)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              onClick={() =>
                                user.username &&
                                navigate(`/user-detail/${user.username}`)
                              }
                              className={`flex items-center gap-2 ${
                                user.username
                                  ? "cursor-pointer hover:text-cyan-300 transition-colors"
                                  : ""
                              }`}
                            >
                              <div className="bg-gray-700 p-1.5 rounded-full">
                                <User size={16} className="text-gray-300" />
                              </div>
                              <span className={index < 3 ? "text-cyan-100" : ""}>{user.username || "Unknown"}</span>
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
                              <ChevronsUp
                                size={16}
                                className="text-purple-400"
                              />
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
                                className="text-blue-400 hover:text-cyan-300 transition-colors flex items-center justify-center bg-gray-700/50 hover:bg-gray-700 p-2 rounded-full"
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

            <footer className="flex flex-wrap justify-between items-center text-sm text-gray-400 gap-2 mt-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-blue-900/30">
              <p>Last updated: {new Date().toLocaleString()}</p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg"
              >
                <Github size={16} />
                <span>View source code</span>
              </a>
            </footer>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default HomePage;