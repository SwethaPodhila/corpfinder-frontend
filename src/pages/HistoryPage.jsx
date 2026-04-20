import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    /* =========================
       FETCH USER HISTORY
    ========================= */
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "https://corpfinder-backend.onrender.com/filters/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();
                setHistory(data || []);
            } catch (err) {
                console.log(err);
            }

            setLoading(false);
        };

        fetchHistory();
    }, []);

    /* =========================
       DELETE HISTORY ITEM
    ========================= */
    const deleteHistory = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this search history?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(
                `https://corpfinder-backend.onrender.com/filters/history/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHistory((prev) => prev.filter((h) => h._id !== id));

        } catch (err) {
            console.log(err);
        }
    };

    const clearHistory = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to clear all search history?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await fetch("https://corpfinder-backend.onrender.com/filters/history", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHistory([]);

        } catch (err) {
            console.log(err);
        }
    };

    const handleReRun = (query) => {
        if (!query) {
            console.log("❌ Query is undefined");
            return;
        }

        navigate(`/dashboard/search?query=${encodeURIComponent(query)}`);
    };
    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">
                            Search History
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Your recent searches
                        </p>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl 
    bg-gradient-to-r from-red-500 to-red-600 text-white 
    shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 
    transition-all duration-300"
                        >
                            <Trash2 size={16} />
                            Clear All
                        </button>
                    )}
                </div>
            </motion.div>

            {/* =========================
               EMPTY STATE
            ========================= */}
            {!loading && history.length === 0 && (
                <div className="mt-12 flex flex-col items-center justify-center text-center">

                    {/* Full Width Card */}
                    <div className="w-full rounded-2xl border border-border bg-gradient-to-b from-muted/40 to-background p-10 shadow-sm">

                        {/* Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-md">
                            <Clock className="h-7 w-7 text-primary" />
                        </div>

                        {/* Title */}
                        <h2 className="mt-5 text-xl font-semibold text-foreground">
                            Your History is Empty
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            We haven’t recorded any searches yet.
                            Start exploring employees or companies and we’ll keep track of everything for you.
                        </p>

                        {/* CTA */}
                        <button
                            onClick={() => navigate("/dashboard/search")}
                            className="mt-6 rounded-xl bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90 transition"
                        >
                            Start Searching
                        </button>

                        {/* Hint */}
                        <p className="mt-3 text-xs text-muted-foreground">
                            Tip: Your last 30 searches will be saved automatically
                        </p>
                    </div>
                </div>
            )}

            {/* =========================
               HISTORY LIST
            ========================= */}
            <div className="mt-8 space-y-3">
                {history.map((h, i) => (
                    <motion.div
                        key={h._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-elevated flex items-center gap-4 group"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent flex-shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                                {h.query}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(h.createdAt).toLocaleString()} ·{" "}
                                {h.resultCount} results
                            </p>
                        </div>

                        <button
                            onClick={() => deleteHistory(h._id)}
                            className="text-muted-foreground opacity-100 transition-opacity group-hover:opacity-100 hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => handleReRun(h.query)}
                            className="btn-outline-primary px-4 py-2 text-xs"
                        >
                            <ArrowRight className="h-3 w-3" /> Re-run
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
