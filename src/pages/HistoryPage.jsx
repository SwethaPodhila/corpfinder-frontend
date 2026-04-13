import React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Trash2 } from "lucide-react";
import { searchHistory } from "../data/dummyData";

const HistoryPage = () => (
    <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-2xl font-bold text-foreground">
                Search History
            </h1>
            <p className="mt-1 text-muted-foreground">
                Your recent searches
            </p>
        </motion.div>

        <div className="mt-8 space-y-3">
            {searchHistory.map((h, i) => (
                <motion.div
                    key={h.id}
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
                            {h.date} · {h.results} results
                        </p>
                    </div>

                    <button className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </button>

                    <button className="btn-outline-primary px-4 py-2 text-xs">
                        <ArrowRight className="h-3 w-3" /> Re-run
                    </button>
                </motion.div>
            ))}
        </div>
    </div>
);

export default HistoryPage;