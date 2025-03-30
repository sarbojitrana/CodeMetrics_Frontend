import { useState, useEffect } from "react";
import { Trophy, Medal, Code, Activity, ChevronUp, ExternalLink, Loader, RefreshCw, Filter, User, Award, ChevronsUp, Github } from "lucide-react";
import { Outlet } from "react-router-dom";
const usersList = [
    { codeforcesUsername: "sarbojit_007" },
    { codeforcesUsername: "sarafarajnasardi" },
    { codeforcesUsername: "Abhay751825" },
    { codeforcesUsername: "Premraj45" },
    { codeforcesUsername: "sarfarazahmadselarkhurd" },
    { codeforcesUsername: "_ShivA_10" },
    { codeforcesUsername: "dweepsutradhar" },
    { codeforcesUsername: "Unbreakable_will_dpk" },
    { codeforcesUsername: "neutralnutan" },
    { codeforcesUsername: "SOURABHBHAKAR45" },
    { codeforcesUsername: "kshubham35413" },
    { codeforcesUsername: "amphonerd" },
    { codeforcesUsername: "Ansh_raj18" },
    { codeforcesUsername: "sudhanshurai2005" },
    { codeforcesUsername: "m_sakib" },
    { codeforcesUsername: "aditya_0220" },
];
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('submissions');
    const [timeRange, setTimeRange] = useState(7); // days
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, [timeRange]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const updatedUsers = await Promise.all(
                usersList.map(async (user) => {
                    try {
                        const cfSubmissionsResponse = await fetch(
                            `https://codeforces.com/api/user.status?handle=${user.codeforcesUsername}&from=1&count=100`
                        );

                        if (!cfSubmissionsResponse.ok) {
                            throw new Error(`API responded with status: ${cfSubmissionsResponse.status}`);
                        }

                        const cfSubmissionsData = await cfSubmissionsResponse.json();

                        // Get user info for rating and profile pic
                        const cfUserResponse = await fetch(
                            `https://codeforces.com/api/user.info?handles=${user.codeforcesUsername}`
                        );

                        let userInfo = {};
                        if (cfUserResponse.ok) {
                            const userData = await cfUserResponse.json();
                            if (userData.status === "OK") {
                                userInfo = userData.result[0];
                            }
                        }

                        // Filter Codeforces submissions based on time range
                        const rangeCutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
                        const recentSubmissions = cfSubmissionsData.result?.filter(
                            (sub) => sub.creationTimeSeconds * 1000 >= rangeCutoff
                        ) || [];

                        const acceptedSubmissions = recentSubmissions.filter(sub => sub.verdict === "OK");

                        // Get count of unique problems solved
                        const uniqueProblemsSolved = new Set(
                            acceptedSubmissions.map(sub => `${sub.problem.contestId}-${sub.problem.index}`)
                        );

                        // Calculate streak (consecutive days with submissions)
                        const submissionDays = new Set();
                        recentSubmissions.forEach(sub => {
                            const date = new Date(sub.creationTimeSeconds * 1000);
                            submissionDays.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
                        });

                        return {
                            username: user.codeforcesUsername,
                            weeklyAcceptedSubmissions: acceptedSubmissions.length,
                            uniqueProblemsSolved: uniqueProblemsSolved.size,
                            submissionStreak: submissionDays.size,
                            totalSubmissions: recentSubmissions.length,
                            rating: userInfo.rating || "N/A",
                            rank: userInfo.rank || "unrated",
                            profileUrl: `https://codeforces.com/profile/${user.codeforcesUsername}`,
                            avatar: userInfo.avatar
                        };
                    } catch (error) {
                        console.error("Error fetching data for", user.codeforcesUsername, error);
                        return {
                            username: user.codeforcesUsername,
                            weeklyAcceptedSubmissions: 0,
                            uniqueProblemsSolved: 0,
                            submissionStreak: 0,
                            totalSubmissions: 0,
                            rating: "N/A",
                            rank: "error",
                            profileUrl: `https://codeforces.com/profile/${user.codeforcesUsername}`,
                            error: true
                        };
                    }
                })
            );

            // Sort users based on selected metric
            const sortedUsers = [...updatedUsers].sort((a, b) => {
                if (sortBy === 'submissions') return b.weeklyAcceptedSubmissions - a.weeklyAcceptedSubmissions;
                if (sortBy === 'problems') return b.uniqueProblemsSolved - a.uniqueProblemsSolved;
                if (sortBy === 'streak') return b.submissionStreak - a.submissionStreak;
                if (sortBy === 'rating') return (b.rating === "N/A" ? -9999 : b.rating) - (a.rating === "N/A" ? -9999 : a.rating);
                return b.weeklyAcceptedSubmissions - a.weeklyAcceptedSubmissions;
            });

            setUsers(sortedUsers);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch user data. Please try again later.");
            setLoading(false);
            console.error("Error in fetchUserData:", err);
        }
    };

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return "bg-yellow-100 text-yellow-800";
            case 1: return "bg-gray-100 text-gray-800";
            case 2: return "bg-orange-100 text-orange-800";
            default: return "bg-blue-100 text-blue-800";
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy size={20} className="text-yellow-500" />;
            case 1: return <Medal size={20} className="text-gray-400" />;
            case 2: return <Medal size={20} className="text-orange-500" />;
            default: return <span className="text-sm font-semibold">{index + 1}</span>;
        }
    };

    const getCFRankColor = (rank) => {
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

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
            <Outlet></Outlet>
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-blue-400 mb-2">
                        <Code size={28} />
                        <span>Codeforces Leaderboard</span>
                    </h1>
                    <p className="text-teal-400 text-lg">Competitive programmers' activity tracker</p>
                </header>

                <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Filter size={18} className="text-gray-400" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Time range:</span>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(Number(e.target.value))}
                                className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
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
                        <span className="text-sm text-gray-400">Sort by:</span>
                        <div className="flex">
                            <button
                                className={`px-3 py-1 text-sm rounded-l border border-gray-600 ${sortBy === 'submissions' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setSortBy('submissions')}
                            >
                                Submissions
                            </button>
                            <button
                                className={`px-3 py-1 text-sm border-t border-b border-gray-600 ${sortBy === 'problems' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setSortBy('problems')}
                            >
                                Problems
                            </button>
                            <button
                                className={`px-3 py-1 text-sm border-t border-b border-gray-600 ${sortBy === 'streak' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setSortBy('streak')}
                            >
                                Streak
                            </button>
                            <button
                                className={`px-3 py-1 text-sm rounded-r border border-gray-600 ${sortBy === 'rating' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                onClick={() => setSortBy('rating')}
                            >
                                Rating
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={fetchUserData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                    >
                        <RefreshCw size={14} />
                        <span>Refresh</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-lg">
                        <Loader className="animate-spin text-blue-400 mb-4" size={40} />
                        <p className="text-gray-300">Fetching latest submissions data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center p-12 bg-red-900/20 rounded-lg shadow-lg">
                        <p className="text-red-300 mb-4">{error}</p>
                        <button
                            onClick={fetchUserData}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/40 text-left">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Rank</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Programmer</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>Submissions</span>
                                                    {sortBy === 'submissions' && <ChevronUp size={14} />}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>Problems</span>
                                                    {sortBy === 'problems' && <ChevronUp size={14} />}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>Streak</span>
                                                    {sortBy === 'streak' && <ChevronUp size={14} />}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <span>Rating</span>
                                                    {sortBy === 'rating' && <ChevronUp size={14} />}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Profile</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {users.map((user, index) => (
                                            <tr
                                                key={user.username}
                                                className={`hover:bg-blue-900/10 transition-colors ${index < 3 ? "font-medium" : ""}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${getMedalColor(index)}`}>
                                                        {getRankIcon(index)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        onClick={() => navigate(`/user-detail/${user.username}`)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <User size={16} className="text-gray-400" />
                                                        <span>{user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={16} className="text-teal-400" />
                                                        <span className="tabular-nums">{user.weeklyAcceptedSubmissions}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Code size={16} className="text-blue-400" />
                                                        <span className="tabular-nums">{user.uniqueProblemsSolved}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <ChevronsUp size={16} className="text-purple-400" />
                                                        <span className="tabular-nums">{user.submissionStreak} days</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Award size={16} className="text-yellow-400" />
                                                        <span className={`tabular-nums ${getCFRankColor(user.rank)}`}>
                                                            {user.rating !== "N/A" ? user.rating : "-"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={user.profileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center"
                                                    >
                                                        <ExternalLink size={16} />
                                                        <span className="sr-only">View Profile</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <footer className="flex justify-between items-center text-sm text-gray-400 opacity-80">
                            <p>Last updated: {new Date().toLocaleString()}</p>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
                                <Github size={14} />
                                <span>View source code</span>
                            </div>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;