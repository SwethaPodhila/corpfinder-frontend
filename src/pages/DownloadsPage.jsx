import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DownloadsPage = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const navigate = useNavigate();

    /* =========================
       FETCH DOWNLOAD HISTORY
    ========================= */
    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "http://localhost:5000/downloads/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await res.json();
                setDownloads(data || []);
            } catch (err) {
                console.log(err);
            }

            setLoading(false);
        };

        fetchDownloads();
    }, []);

    const handleDownload = (item) => {
        setDownloading(item._id);

        try {
            let url = item.fileUrl;

            // 👉 Cloudinary force download
            if (url.includes("/upload/")) {
                url = url.replace("/upload/", "/upload/fl_attachment/");
            }

            window.open(url, "_blank");

            setTimeout(() => {
                setDownloading(null);
            }, 1000);

        } catch (err) {
            console.log(err);
            setDownloading(null);
        }
    };
    return (
        <div>
            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Downloads
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Your exported data files
                </p>
            </motion.div>

            {/* =========================
               EMPTY STATE
            ========================= */}
            {!loading && downloads.length === 0 && (
                <div className="mt-12 flex flex-col items-center justify-center text-center">

                    <div className="w-full rounded-2xl border border-border bg-gradient-to-b from-muted/40 to-background p-10 shadow-sm">

                        {/* Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-md">
                            <FileSpreadsheet className="h-7 w-7 text-primary" />
                        </div>

                        {/* Title */}
                        <h2 className="mt-5 text-xl font-semibold text-foreground">
                            No Downloads Yet
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            You haven’t downloaded any data yet.
                            Start searching and export results to see them here.
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
                            Tip: Your downloaded files will appear here for quick access
                        </p>
                    </div>
                </div>
            )}

            {/* =========================
               DOWNLOAD LIST
            ========================= */}
            <div className="mt-8 space-y-3">
                {downloads.map((d, i) => (
                    <motion.div
                        key={d._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-elevated flex items-center gap-4"
                    >
                        {/* ICON */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent flex-shrink-0">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>

                        {/* DETAILS */}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                                {d.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {d.recordCount} records ·{" "}
                                {new Date(d.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* DOWNLOAD BUTTON */}
                        <button
                            onClick={() => handleDownload(d)}
                            disabled={downloading === d._id}
                            className="btn-primary1 px-4 py-2 text-xs"
                        >
                            {downloading === d._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {downloading === d._id
                                ? "Downloading..."
                                : "Download Excel"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DownloadsPage;