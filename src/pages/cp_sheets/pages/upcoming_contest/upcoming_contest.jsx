import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Clock, Calendar, ExternalLink, Award, ArrowRight } from "lucide-react";

const UpcomingContest = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://codeforces.com/api/contest.list");
      const data = await res.json();
      if (data.status === "OK") {
        const upcoming = data.result
          .filter((contest) => contest.phase === "BEFORE")
          .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
          .slice(0, 20);
        setContests(upcoming);
      } else {
        setError("Failed to fetch contests");
      }
    } catch (err) {
      setError("Error connecting to Codeforces API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, contests.length));
  };

  const addToCalendar = useCallback((contest) => {
    const startTime = new Date(contest.startTimeSeconds * 1000);
    const endTime = new Date(
      contest.startTimeSeconds * 1000 + contest.durationSeconds * 1000
    );
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      contest.name
    )}&dates=${startTime
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")}/${endTime
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(
      "Codeforces Contest"
    )}&location=${encodeURIComponent("https://codeforces.com/contests")}&sf=true&output=xml`;
    window.open(calendarUrl, "_blank");
  }, []);

  const formatDate = useCallback((timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getTimeUntil = useCallback((startTimeSeconds) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = startTimeSeconds - now;

    if (timeLeft <= 0) return "Starting soon";

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m`;
  }, []);

  const visibleContests = useMemo(() => {
    return contests.slice(0, visibleCount);
  }, [contests, visibleCount]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <Award className="text-blue-400 h-6 w-6" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
            Upcoming Codeforces Contests
          </h2>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-2 border-blue-500 opacity-20"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-2 border-blue-400 animate-spin"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 backdrop-blur-md border border-red-800/40 text-red-400 p-4 rounded-xl text-center my-4">
          {error}
        </div>
      )}

      {!loading && contests.length === 0 && (
        <div className="bg-blue-900/20 backdrop-blur-md border border-blue-800/40 text-blue-300 p-6 rounded-xl text-center">
          No upcoming contests found at the moment
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 will-change-transform">
        {visibleContests.map((contest, index) => (
          <div
            key={contest.id || index}
            className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/40 hover:border-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 transform hover:-translate-y-1 will-change-transform"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "both",
            }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-gray-700/40">
              <div className="flex justify-between items-start">
                <h3
                  className="text-lg font-semibold text-blue-300 line-clamp-2 flex-1 pr-2"
                  title={contest.name}
                >
                  {contest.name}
                </h3>
                <span className="text-xs font-medium bg-blue-900/50 text-blue-200 px-2 py-1 rounded-full whitespace-nowrap">
                  {getTimeUntil(contest.startTimeSeconds)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3 mb-5">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">
                    {formatDate(contest.startTimeSeconds)}
                  </span>
                </div>

                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">
                    {formatTime(contest.startTimeSeconds)}
                  </span>
                </div>

                <div className="text-gray-300 text-sm flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
                  <span>
                    {Math.floor(contest.durationSeconds / 3600)} hrs{" "}
                    {Math.floor((contest.durationSeconds % 3600) / 60)} mins
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    window.open("https://codeforces.com/contests", "_blank")
                  }
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-900/20 text-sm font-medium"
                >
                  Register
                  <ExternalLink size={14} className="opacity-70" />
                </button>
                <button
                  onClick={() => addToCalendar(contest)}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-black/40 border border-blue-800/30 text-blue-300 rounded-lg hover:bg-black/60 hover:text-blue-200 transition-all text-sm font-medium"
                >
                  Calendar
                  <Calendar size={14} className="opacity-70" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && visibleCount < contests.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md shadow-blue-900/20 backdrop-blur-md"
          >
            <span>Load More</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingContest;
