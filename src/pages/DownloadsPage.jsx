import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";

const DownloadsPage = () => {
    const [downloading, setDownloading] = useState(null);

    const downloads = [
        { id: 1, name: "Tech Companies CA - April 2026", records: 24, date: "2026-04-12" },
        { id: 2, name: "HR Directors Healthcare", records: 8, date: "2026-04-11" },
        { id: 3, name: "Finance CEOs", records: 15, date: "2026-04-10" },
    ];

    const handleDownload = (id) => {
        setDownloading(id);
        setTimeout(() => setDownloading(null), 2000);
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Downloads
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Your exported data files
                </p>
            </motion.div>

            <div className="mt-8 space-y-3">
                {downloads.map((d, i) => (
                    <motion.div
                        key={d.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-elevated flex items-center gap-4"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent flex-shrink-0">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-foreground">{d.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {d.records} records · {d.date}
                            </p>
                        </div>

                        <button
                            onClick={() => handleDownload(d.id)}
                            disabled={downloading === d.id}
                            className="btn-primary px-4 py-2 text-xs"
                        >
                            {downloading === d.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {downloading === d.id ? "Downloading..." : "Download Excel"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DownloadsPage;