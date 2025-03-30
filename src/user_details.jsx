
import { useState, useEffect } from "react";
import { ArrowLeft, Award, Calendar, Code, ExternalLink, Github, LineChart, Loader, RefreshCw, Star, BarChart2, PieChart, User, Trophy, Clock, CheckCircle, XCircle, Zap, TrendingUp, Circle } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { useParams } from "react-router-dom";


const UserDetailsPage = () => {
    const { username } = useParams();

    const [userData, setUserData] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState(30); // days
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (username) {
            fetchUserData(username);
        }
    }, [username, timeRange]);

    const fetchUserData = async (username) => {
        setLoading(true);
        try {
            // Fetch user info
            const userInfoResponse = await fetch(
                `https://codeforces.com/api/user.info?handles=${username}`
            );

            if (!userInfoResponse.ok) {
                throw new Error(`API responded with status: ${userInfoResponse.status}`);
            }

            const userInfoData = await userInfoResponse.json();

            if (userInfoData.status !== "OK" || !userInfoData.result.length) {
                throw new Error("User not found");
            }

            const userInfo = userInfoData.result[0];

            // Fetch user submissions
            const submissionsResponse = await fetch(
                `https://codeforces.com/api/user.status?handle=${username}&from=1&count=500`
            );

            if (!submissionsResponse.ok) {
                throw new Error(`API responded with status: ${submissionsResponse.status}`);
            }

            const submissionsData = await submissionsResponse.json();

            // Process all submissions data
            const allSubmissions = submissionsData.result || [];
            setSubmissions(allSubmissions);

            // Filter submissions based on time range
            const rangeCutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
            const recentSubmissions = allSubmissions.filter(
                (sub) => sub.creationTimeSeconds * 1000 >= rangeCutoff
            );

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

            // Calculate problem statistics by rating
            const problemsByRating = calculateProblemsByRating(allSubmissions);

            // Calculate verdict statistics
            const verdictStats = calculateVerdictStats(allSubmissions);

            // Calculate language statistics
            const languageStats = calculateLanguageStats(allSubmissions);

            // Calculate tags statistics 
            const tagStats = calculateTagStats(allSubmissions);

            // Calculate recent activity
            const recentActivity = calculateRecentActivity(allSubmissions);

            setUserData({
                ...userInfo,
                recentAcceptedSubmissions: acceptedSubmissions.length,
                uniqueProblemsSolved: uniqueProblemsSolved.size,
                submissionStreak: submissionDays.size,
                totalSubmissions: recentSubmissions.length,
                problemsByRating,
                verdictStats,
                languageStats,
                tagStats,
                recentActivity,
                profileUrl: `https://codeforces.com/profile/${username}`
            });

            setLoading(false);
        } catch (err) {
            setError(`Failed to fetch data for ${username}. ${err.message}`);
            setLoading(false);
            console.error("Error in fetchUserData:", err);
        }
    };

    const calculateProblemsByRating = (submissions) => {
        // Count unique problems by rating
        const solvedProblems = new Map();
        const attemptedProblems = new Map();

        submissions.forEach(sub => {
            const problemRating = sub.problem.rating || "Unknown";
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;

            // Add to attempted problems
            if (!attemptedProblems.has(problemRating)) {
                attemptedProblems.set(problemRating, new Set());
            }
            attemptedProblems.get(problemRating).add(problemId);

            // Add to solved problems if verdict is OK
            if (sub.verdict === "OK") {
                if (!solvedProblems.has(problemRating)) {
                    solvedProblems.set(problemRating, new Set());
                }
                solvedProblems.get(problemRating).add(problemId);
            }
        });

        // Create data structure for chart
        const ratings = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500];

        return ratings.map(rating => ({
            rating: rating,
            solved: solvedProblems.has(rating) ? solvedProblems.get(rating).size : 0,
            attempted: attemptedProblems.has(rating) ? attemptedProblems.get(rating).size : 0,
            unsolved: attemptedProblems.has(rating) ?
                attemptedProblems.get(rating).size - (solvedProblems.has(rating) ? solvedProblems.get(rating).size : 0) : 0
        })).filter(data => data.attempted > 0);
    };

    const calculateVerdictStats = (submissions) => {
        const verdicts = {};

        submissions.forEach(sub => {
            const verdict = sub.verdict || "UNKNOWN";
            verdicts[verdict] = (verdicts[verdict] || 0) + 1;
        });

        return Object.entries(verdicts).map(([verdict, count]) => ({
            name: formatVerdict(verdict),
            value: count,
            verdict: verdict
        }));
    };

    const calculateLanguageStats = (submissions) => {
        const languages = {};

        submissions.forEach(sub => {
            const lang = sub.programmingLanguage || "Unknown";
            languages[lang] = (languages[lang] || 0) + 1;
        });

        return Object.entries(languages)
            .map(([lang, count]) => ({ name: lang, value: count }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 languages
    };

    const calculateTagStats = (submissions) => {
        const tags = {};

        // Count only solved problems
        const solvedProblems = new Set();
        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedProblems.add(problemId);
            }
        });

        // Count tags from solved problems only once per problem
        const processedProblems = new Set();
        submissions.forEach(sub => {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            if (solvedProblems.has(problemId) && !processedProblems.has(problemId)) {
                processedProblems.add(problemId);

                if (sub.problem.tags && sub.problem.tags.length) {
                    sub.problem.tags.forEach(tag => {
                        tags[tag] = (tags[tag] || 0) + 1;
                    });
                }
            }
        });

        return Object.entries(tags)
            .map(([tag, count]) => ({ name: tag, value: count }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 tags
    };

    const calculateRecentActivity = (submissions) => {
        // Get submissions from the last 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentSubs = submissions.filter(
            sub => sub.creationTimeSeconds * 1000 >= thirtyDaysAgo
        );

        // Group by day
        const submissionsByDay = {};
        const acceptedByDay = {};

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            submissionsByDay[dateStr] = 0;
            acceptedByDay[dateStr] = 0;
        }

        recentSubs.forEach(sub => {
            const date = new Date(sub.creationTimeSeconds * 1000);
            const dateStr = date.toISOString().split('T')[0];

            if (submissionsByDay[dateStr] !== undefined) {
                submissionsByDay[dateStr]++;

                if (sub.verdict === "OK") {
                    acceptedByDay[dateStr]++;
                }
            }
        });

        // Convert to array for recharts
        return Object.entries(submissionsByDay)
            .map(([date, count]) => ({
                date,
                submissions: count,
                accepted: acceptedByDay[date] || 0
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const formatVerdict = (verdict) => {
        switch (verdict) {
            case "OK": return "Accepted";
            case "WRONG_ANSWER": return "Wrong Answer";
            case "TIME_LIMIT_EXCEEDED": return "Time Limit";
            case "MEMORY_LIMIT_EXCEEDED": return "Memory Limit";
            case "RUNTIME_ERROR": return "Runtime Error";
            case "COMPILATION_ERROR": return "Compilation Error";
            default: return verdict.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
        }
    };

    const getVerdictColor = (verdict) => {
        switch (verdict) {
            case "OK": return "#4CAF50";
            case "WRONG_ANSWER": return "#F44336";
            case "TIME_LIMIT_EXCEEDED": return "#FF9800";
            case "MEMORY_LIMIT_EXCEEDED": return "#E91E63";
            case "RUNTIME_ERROR": return "#9C27B0";
            case "COMPILATION_ERROR": return "#607D8B";
            default: return "#9E9E9E";
        }
    };
    const getRankColor = (rank) => {
        if (!rank) return "text-gray-400";

        rank = rank.toLowerCase();
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

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const navigateBack = () => {
        window.history.back();  // Use window.history.back() as a fallback
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-lg">
                        <Loader className="animate-spin text-blue-400 mb-4" size={40} />
                        <p className="text-gray-300">Fetching user data...</p>
                    </div>
                </div>
            </div>
        );
    }
    const verdictTotal = userData.verdictStats?.reduce((sum, item) => sum + item.value, 0) || 0;
    const languageTotal = userData.languageStats?.reduce((sum, item) => sum + item.value, 0) || 0;


    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center p-12 bg-red-900/20 rounded-lg shadow-lg">
                        <p className="text-red-300 mb-4">{error}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fetchUserData(username)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <button
                                onClick={navigateBack}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Back to Leaderboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={navigateBack}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Leaderboard</span>
                    </button>
                </div>

                {/* User Profile Header */}
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                {userData.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt={`${userData.handle}'s avatar`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                        <User size={40} className="text-gray-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                                    <h1 className="text-3xl font-bold">{userData.handle}</h1>
                                    <div className={`flex items-center gap-1 ${getRankColor(userData.rank)}`}>
                                        <Award size={18} />
                                        <span>{userData.rank || 'Unrated'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={18} className="text-yellow-400" />
                                        <span className="text-xl font-semibold">{userData.rating || 'N/A'}</span>
                                    </div>
                                    <a
                                        href={userData.profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                    >
                                        <ExternalLink size={14} />
                                        <span>View on Codeforces</span>
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-700/50 p-3 rounded flex items-center gap-2">
                                        <Trophy size={18} className="text-yellow-400" />
                                        <div>
                                            <div className="text-xs text-gray-400">Max Rating</div>
                                            <div className="font-semibold">{userData.maxRating || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 p-3 rounded flex items-center gap-2">
                                        <Calendar size={18} className="text-green-400" />
                                        <div>
                                            <div className="text-xs text-gray-400">Registered</div>
                                            <div className="font-semibold">{userData.registrationTimeSeconds ? formatDate(userData.registrationTimeSeconds) : 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 p-3 rounded flex items-center gap-2">
                                        <LineChart size={18} className="text-blue-400" />
                                        <div>
                                            <div className="text-xs text-gray-400">Current Streak</div>
                                            <div className="font-semibold">{userData.submissionStreak} days</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/50 p-3 rounded flex items-center gap-2">
                                        <Code size={18} className="text-purple-400" />
                                        <div>
                                            <div className="text-xs text-gray-400">Problems Solved</div>
                                            <div className="font-semibold">{userData.uniqueProblemsSolved}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-t border-gray-700">
                        <div className="flex overflow-x-auto">
                            <button
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white transition-colors'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'problems' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white transition-colors'}`}
                                onClick={() => setActiveTab('problems')}
                            >
                                Problems
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'submissions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white transition-colors'}`}
                                onClick={() => setActiveTab('submissions')}
                            >
                                Submissions
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'statistics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-white transition-colors'}`}
                                onClick={() => setActiveTab('statistics')}
                            >
                                Statistics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Recent Activity Chart */}
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Activity</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsLineChart
                                        data={userData.recentActivity}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis dataKey="date" stroke="#999" />
                                        <YAxis stroke="#999" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelStyle={{ color: '#999' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="submissions" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="accepted" stroke="#4CAF50" />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Verdicts Distribution */}
                                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Submission Verdicts</h2>
                                    <div className="flex flex-row h-64">
                                        {/* Pie Chart */}
                                        <div className="w-1/2">
                                            {userData.verdictStats && userData.verdictStats.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RechartsPieChart>
                                                        <Pie
                                                            data={userData.verdictStats}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={70}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {userData.verdictStats.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={getVerdictColor(entry.verdict)} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(value, name, props) => [`${value} submissions`, props.payload.verdict]}
                                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                                        />
                                                    </RechartsPieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <p className="text-gray-400">No data</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Panel - Now with scrolling */}
                                        <div className="w-1/2 pl-4 flex flex-col">
                                            <h3 className="text-md font-medium text-gray-300 mb-3">Verdict Statistics</h3>
                                            <div className="overflow-y-auto pr-2 max-h-52">
                                                <div className="space-y-3">
                                                    {userData.verdictStats.sort((a, b) => b.value - a.value).map((stat, index) => {
                                                        const percentage = ((stat.value / verdictTotal) * 100).toFixed(1);
                                                        return (
                                                            <div key={index} className="relative">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-sm font-medium text-gray-300">{stat.verdict}</span>
                                                                    <span className="text-sm font-medium text-gray-300">{percentage}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                                    <div
                                                                        className="h-2 rounded-full"
                                                                        style={{
                                                                            width: `${percentage}%`,
                                                                            backgroundColor: getVerdictColor(stat.verdict)
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs text-gray-400 absolute right-0 mt-1">{stat.value} submissions</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Languages Used</h2>
                                    <div className="flex flex-row h-64">
                                        {/* Pie Chart */}
                                        <div className="w-1/2">
                                            {userData.languageStats && userData.languageStats.length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RechartsPieChart>
                                                        <Pie
                                                            data={userData.languageStats}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            outerRadius={70}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {userData.languageStats.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(value, name) => [`${value} submissions`, name]}
                                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                                        />
                                                    </RechartsPieChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <p className="text-gray-400">No data</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Panel - Now with scrolling */}
                                        <div className="w-1/2 pl-4 flex flex-col">
                                            <h3 className="text-md font-medium text-gray-300 mb-3">Language Statistics</h3>
                                            <div className="overflow-y-auto pr-2 max-h-52">
                                                <div className="space-y-3">
                                                    {userData.languageStats.sort((a, b) => b.value - a.value).map((stat, index) => {
                                                        const percentage = ((stat.value / languageTotal) * 100).toFixed(1);
                                                        return (
                                                            <div key={index} className="relative">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="text-sm font-medium text-gray-300">{stat.name}</span>
                                                                    <span className="text-sm font-medium text-gray-300">{percentage}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                                    <div
                                                                        className="h-2 rounded-full"
                                                                        style={{
                                                                            width: `${percentage}%`,
                                                                            backgroundColor: COLORS[index % COLORS.length]
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs text-gray-400 absolute right-0 mt-1">{stat.value} submissions</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Problems Tab */}
                    {activeTab === 'problems' && (
                        <>
                            {/* Problems by Rating */}
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-400">Problems by Rating</h2>
                                {userData.problemsByRating && userData.problemsByRating.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={userData.problemsByRating}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="rating" stroke="#999" />
                                            <YAxis stroke="#999" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#999' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="solved" stackId="a" fill="#4CAF50" name="Solved" />
                                            <Bar dataKey="unsolved" stackId="a" fill="#F44336" name="Unsolved" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-400">No problem rating data available</p>
                                    </div>
                                )}
                            </div>

                            {/* Problem Tags */}
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-400">Problem Tags Solved</h2>
                                {userData.tagStats && userData.tagStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={userData.tagStats}
                                            layout="vertical"
                                            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis type="number" stroke="#999" />
                                            <YAxis dataKey="name" type="category" stroke="#999" width={150} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#999' }}
                                            />
                                            <Bar dataKey="value" fill="#8884d8" name="Problems Solved" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-64 flex items-center justify-center">
                                        <p className="text-gray-400">No tag data available</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

            // Submissions Tab
                    {activeTab === 'submissions' && (
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/40 text-left">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Problem</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Verdict</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Language</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-blue-400 uppercase tracking-wider">Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {submissions.slice(0, 20).map((submission, index) => (
                                            <tr
                                                key={submission.id || index}
                                                className="hover:bg-blue-900/10 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-gray-400" />
                                                        <span>{new Date(submission.creationTimeSeconds * 1000).toLocaleDateString()} {new Date(submission.creationTimeSeconds * 1000).toLocaleTimeString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`https://codeforces.com/contest/${submission.problem.contestId}/problem/${submission.problem.index}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        {submission.problem.index}. {submission.problem.name}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {submission.problem.rating || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {submission.verdict === "OK" ? (
                                                            <CheckCircle size={16} className="text-green-500" />
                                                        ) : (
                                                            <XCircle size={16} className="text-red-500" />
                                                        )}
                                                        <span style={{ color: getVerdictColor(submission.verdict) }}>
                                                            {formatVerdict(submission.verdict)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {submission.programmingLanguage}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`https://codeforces.com/contest/${submission.contestId || submission.problem.contestId}/submission/${submission.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                                    >
                                                        <ExternalLink size={14} />
                                                        <span>View</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {submissions.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    No submissions found
                                </div>
                            )}

                            {submissions.length > 20 && (
                                <div className="p-4 text-center text-gray-400 border-t border-gray-700">
                                    Showing the 20 most recent submissions out of {submissions.length}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'statistics' && (
                        <div className="space-y-6">
                            {/* Time of Day Analysis */}
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-400">Submission Time Analysis</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-3 text-gray-300">Time of Day</h3>
                                        {(() => {
                                            // Calculate submission time distribution
                                            const hourData = Array(24).fill(0);
                                            submissions.forEach(sub => {
                                                const hour = new Date(sub.creationTimeSeconds * 1000).getHours();
                                                hourData[hour]++;
                                            });

                                            const timeData = hourData.map((count, hour) => ({
                                                hour: `${hour}:00`,
                                                submissions: count
                                            }));

                                            return (
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <BarChart data={timeData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                        <XAxis dataKey="hour" stroke="#999" />
                                                        <YAxis stroke="#999" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                            itemStyle={{ color: '#fff' }}
                                                        />
                                                        <Bar dataKey="submissions" fill="#8884d8" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            );
                                        })()}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-3 text-gray-300">Day of Week</h3>
                                        {(() => {
                                            // Calculate day of week distribution
                                            const dayData = Array(7).fill(0);
                                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                                            submissions.forEach(sub => {
                                                const day = new Date(sub.creationTimeSeconds * 1000).getDay();
                                                dayData[day]++;
                                            });

                                            const weekData = dayData.map((count, day) => ({
                                                day: dayNames[day],
                                                submissions: count
                                            }));

                                            return (
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <BarChart data={weekData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                        <XAxis dataKey="day" stroke="#999" />
                                                        <YAxis stroke="#999" />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                            itemStyle={{ color: '#fff' }}
                                                        />
                                                        <Bar dataKey="submissions" fill="#82ca9d" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 text-blue-400">Performance Metrics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Acceptance Rate */}
                                    <div className="bg-gray-700/40 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={18} className="text-green-400" />
                                            <h3 className="text-lg font-medium text-gray-200">Acceptance Rate</h3>
                                        </div>
                                        {(() => {
                                            const totalSubmissions = submissions.length;
                                            const acceptedSubmissions = submissions.filter(sub => sub.verdict === "OK").length;
                                            const acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions / totalSubmissions) * 100 : 0;

                                            return (
                                                <>
                                                    <div className="text-3xl font-bold mb-2">{acceptanceRate.toFixed(1)}%</div>
                                                    <div className="text-sm text-gray-400">
                                                        {acceptedSubmissions} accepted out of {totalSubmissions} submissions
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Average Attempts per Problem */}
                                    <div className="bg-gray-700/40 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <RefreshCw size={18} className="text-blue-400" />
                                            <h3 className="text-lg font-medium text-gray-200">Avg Attempts</h3>
                                        </div>
                                        {(() => {
                                            // Count attempts per problem
                                            const problemAttempts = {};
                                            submissions.forEach(sub => {
                                                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                                                problemAttempts[problemId] = (problemAttempts[problemId] || 0) + 1;
                                            });

                                            const uniqueProblems = Object.keys(problemAttempts).length;
                                            const totalAttempts = submissions.length;
                                            const avgAttempts = uniqueProblems > 0 ? totalAttempts / uniqueProblems : 0;

                                            return (
                                                <>
                                                    <div className="text-3xl font-bold mb-2">{avgAttempts.toFixed(1)}</div>
                                                    <div className="text-sm text-gray-400">
                                                        Average attempts per problem
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Solved Problem Trend */}
                                    <div className="bg-gray-700/40 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp size={18} className="text-orange-400" />
                                            <h3 className="text-lg font-medium text-gray-200">Problem Trend</h3>
                                        </div>
                                        {(() => {
                                            // Count solved problems per month (last 6 months)
                                            const months = [];
                                            const labels = [];
                                            const solvedCounts = [];

                                            for (let i = 5; i >= 0; i--) {
                                                const date = new Date();
                                                date.setMonth(date.getMonth() - i);
                                                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime() / 1000;
                                                const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() / 1000;

                                                const monthSolved = new Set();
                                                submissions.forEach(sub => {
                                                    if (sub.verdict === "OK" &&
                                                        sub.creationTimeSeconds >= monthStart &&
                                                        sub.creationTimeSeconds <= monthEnd) {
                                                        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                                                        monthSolved.add(problemId);
                                                    }
                                                });

                                                months.push({
                                                    month: `${date.toLocaleString('default', { month: 'short' })}`,
                                                    solved: monthSolved.size
                                                });

                                                labels.push(date.toLocaleString('default', { month: 'short' }));
                                                solvedCounts.push(monthSolved.size);
                                            }

                                            return (
                                                <>
                                                    <ResponsiveContainer width="100%" height={80}>
                                                        <RechartsLineChart data={months}>
                                                            <Line
                                                                type="monotone"
                                                                dataKey="solved"
                                                                stroke="#ff9d00"
                                                                strokeWidth={2}
                                                                dot={{ r: 3 }}
                                                                activeDot={{ r: 5 }}
                                                            />
                                                            <XAxis dataKey="month" hide />
                                                            <YAxis hide />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                                formatter={(value) => [`${value} problems`, 'Solved']}
                                                                labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                                                            />
                                                        </RechartsLineChart>
                                                    </ResponsiveContainer>
                                                    <div className="text-sm text-gray-400 text-center">
                                                        Problems solved per month (last 6 months)
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Attempt Distribution */}
                                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Attempts per Problem</h2>
                                    {(() => {
                                        // Calculate attempts per problem
                                        const problemAttempts = {};
                                        submissions.forEach(sub => {
                                            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                                            problemAttempts[problemId] = (problemAttempts[problemId] || 0) + 1;
                                        });

                                        // Count problems by number of attempts
                                        const attemptsCount = {};
                                        Object.values(problemAttempts).forEach(attempts => {
                                            attemptsCount[attempts] = (attemptsCount[attempts] || 0) + 1;
                                        });

                                        // Create data for chart
                                        const attemptData = Object.entries(attemptsCount)
                                            .map(([attempts, count]) => ({
                                                attempts: attempts === "1" ? "1 attempt" : `${attempts} attempts`,
                                                count,
                                                value: parseInt(attempts)
                                            }))
                                            .sort((a, b) => a.value - b.value);

                                        return (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={attemptData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                    <XAxis dataKey="attempts" stroke="#999" />
                                                    <YAxis stroke="#999" />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        formatter={(value) => [`${value} problems`, 'Count']}
                                                    />
                                                    <Bar dataKey="count" fill="#ff7c7c" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        );
                                    })()}
                                </div>

                                {/* Solved by Rating */}
                                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Difficulty Level Progress</h2>
                                    {(() => {
                                        // Calculate max rating solved over time
                                        const solvedProblemsByTime = [];
                                        const seenProblems = new Set();
                                        let maxRating = 0;

                                        // Sort submissions by time
                                        const sortedSubmissions = [...submissions]
                                            .filter(sub => sub.verdict === "OK" && sub.problem.rating)
                                            .sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);

                                        sortedSubmissions.forEach(sub => {
                                            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                                            if (!seenProblems.has(problemId)) {
                                                seenProblems.add(problemId);
                                                maxRating = Math.max(maxRating, sub.problem.rating || 0);
                                                solvedProblemsByTime.push({
                                                    time: new Date(sub.creationTimeSeconds * 1000).toLocaleDateString(),
                                                    maxRating,
                                                    problemCount: seenProblems.size
                                                });
                                            }
                                        });

                                        // Take a subset of points to avoid overcrowding (every 10th point)
                                        const chartData = solvedProblemsByTime.filter((_, i) =>
                                            i === 0 || i === solvedProblemsByTime.length - 1 || i % 10 === 0
                                        );

                                        return (
                                            <ResponsiveContainer width="100%" height={300}>
                                                <RechartsLineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                                    <XAxis
                                                        dataKey="problemCount"
                                                        stroke="#999"
                                                        label={{ value: 'Problems Solved', position: 'insideBottom', offset: -5, fill: '#999' }}
                                                    />
                                                    <YAxis
                                                        stroke="#999"
                                                        label={{ value: 'Max Rating', angle: -90, position: 'insideLeft', fill: '#999' }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                                                        formatter={(value) => [value, 'Max Rating']}
                                                        labelFormatter={(label) => `After ${label} problems`}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="maxRating"
                                                        stroke="#8884d8"
                                                        activeDot={{ r: 8 }}
                                                    />
                                                </RechartsLineChart>
                                            </ResponsiveContainer>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>)
}

export default UserDetailsPage