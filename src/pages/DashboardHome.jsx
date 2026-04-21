import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Search as SearchIcon, TrendingUp } from "lucide-react";
import axios from "axios";

const DashboardHome = () => {

    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : { fullName: "user name" };

    const [searchHistory, setSearchHistory] = useState([]);
    const [downloadHistory, setDownloadHistory] = useState([]);

    // ✅ fetch history
    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchHistory = async () => {
            try {
                const [searchRes, downloadRes] = await Promise.all([
                    axios.get("https://corpfinder-backend.onrender.com/filters/history", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("https://corpfinder-backend.onrender.com/downloads/history", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setSearchHistory(searchRes.data || []);
                setDownloadHistory(downloadRes.data || []);

            } catch (err) {
                console.log("History fetch error:", err);
            }
        };

        fetchHistory();
    }, []);

    // ✅ NOW stats AFTER state exists
    const stats = [
        {
            icon: SearchIcon,
            label: "Total Searches",
            value: searchHistory.length || 0,
            change: "Live"
        },
        {
            icon: TrendingUp,
            label: "Total Downloads",
            value: downloadHistory.length || 0,
            change: "Live"
        },
        {
            icon: Building2,
            label: "Recent Searches",
            value: Math.min(searchHistory.length, 30),
            change: "Last 30"
        },
        {
            icon: Users,
            label: "Records Exported",
            value: downloadHistory.reduce((acc, d) => acc + (d.recordCount || 0), 0),
            change: "Total"
        },
    ];

    // ✅ merge recent activity
    const recentActivity = [
        ...searchHistory.map(s => ({
            type: "search",
            text: `Searched "${s.query || s.searchText || "Unknown"}"`,
            time: s.createdAt
        })),
        ...downloadHistory.map(d => ({
            type: "download",
            text: `Downloaded ${d.recordCount || 0} records with file "${d.fileName || "Unknown"}"`,
            time: d.createdAt
        }))
    ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6);

    return (
        <div>

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Dashboard
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Welcome back, {user.fullName}. Here's your activity summary.
                </p>
            </motion.div>

            {/* STATS */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-elevated"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                                <s.icon className="h-5 w-5 text-primary" />
                            </div>

                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {s.change}
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold font-heading text-foreground">
                            {s.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="mt-8 card-elevated">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Recent Activity
                </h2>

                <div className="space-y-4">

                    {recentActivity.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No recent activity found.
                        </p>
                    ) : (
                        recentActivity.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />

                                <span className="text-sm text-foreground">
                                    {a.text}
                                </span>

                                <span className="ml-auto text-xs text-muted-foreground">
                                    {new Date(a.time).toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;