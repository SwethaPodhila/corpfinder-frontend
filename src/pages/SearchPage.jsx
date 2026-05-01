import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Loader2, Inbox, Download } from "lucide-react";
import FILTER_DATA from "../data/filterData";
import { Eye, EyeOff } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [visibleFields, setVisibleFields] = useState({});

    const toggleField = (id, field) => {
        setVisibleFields((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: !prev[id]?.[field]
            }
        }));
    };

    const maskValue = (value) => {
        if (!value) return "-";
        return "*".repeat(Math.min(value.length, 10));
    };

    // ✅ FILTER STATE
    const [filters, setFilters] = useState({
        country: "",
        state: "",
        city: "",
        designation: "",
        industry: ""
    });

    // ---------------- SEARCH ----------------
    const runSearch = async (searchText = query) => {

        const cleanQuery = String(searchText || "").trim().toLowerCase();

        setLoading(true);
        setSearched(true);

        try {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams({
                query: cleanQuery,
                country: filters.country || "",
                state: filters.state || "",
                city: filters.city || "",
                designation: filters.designation || "",
                industry: filters.industry || ""
            });

            const url = `https://corpfinder-backend.onrender.com/filters/search?${params.toString()}`;

            console.log("🌐 Search URL:", url);

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            setResults(data.data || []);
            setPage(1);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const hasRestored = useRef(false);

    useEffect(() => {

        // 1️⃣ BACK NAVIGATION (ONLY ONCE)
        if (location.state?.results && !hasRestored.current) {

            hasRestored.current = true;

            setResults(location.state.results);
            setFilters(location.state.filters || {});
            setPage(location.state.page || 1);
            setQuery(location.state.query || "");
            setSearched(true);

            return;
        }

        // 2️⃣ URL SEARCH (ONLY IF NO DATA RESTORED)
        const params = new URLSearchParams(location.search);
        const q = params.get("query");

        if (q && !hasRestored.current) {
            setQuery(q);
            runSearch(q);
        }

    }, [location.search]);

    // ---------------- FILTER DATA ----------------
    const filteredResults = results;

    const paged = filteredResults.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE));

    // ---------------- DOWNLOAD ----------------
    const downloadExcel = async () => {
        if (!filteredResults.length) {
            alert("No data available");
            return;
        }

        // 1️⃣ Create Excel
        const worksheet = XLSX.utils.json_to_sheet(filteredResults);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const safeQuery = (query || "results")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")      // spaces → _
            .replace(/[^a-z0-9_]/g, ""); // remove special chars

        const fileName = `${safeQuery}-${Date.now()}.xlsx`;

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        // 2️⃣ Download locally
        saveAs(file, fileName);

        // 3️⃣ Upload to backend
        const formData = new FormData();
        formData.append("file", file, fileName);
        formData.append("name", fileName);
        formData.append("recordCount", filteredResults.length);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://corpfinder-backend.onrender.com/downloads/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await res.json();
            console.log("Upload success:", data);

        } catch (err) {
            console.log("Upload failed:", err);
        }
    };

    useEffect(() => {
        if (
            filters.country ||
            filters.state ||
            filters.city ||
            filters.designation ||
            filters.industry
        ) {
            runSearch(query);   // 🔥 KEEP QUERY ALWAYS
        }
    }, [filters]);

    return (
        <div className="p-6">

            {/* ================= SEARCH ================= */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border">

                <SearchIcon />

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            runSearch(query);
                        }
                    }}
                    placeholder="Search employees or companies..."
                    className="flex-1 outline-none"
                />

                <button onClick={() => runSearch(query)} className="btn-primary1">
                    Search
                </button>

            </div>

            {/* ================= FILTERS ================= */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">

                {/* COUNTRY */}
                <select
                    value={filters.country}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            country: e.target.value,
                            state: "",
                            city: ""
                        })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">Country</option>
                    {FILTER_DATA.countries.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>

                {/* STATE */}
                <select
                    value={filters.state}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            state: e.target.value,
                            city: ""
                        })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">State</option>
                    {filters.country &&
                        FILTER_DATA.states[filters.country]?.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))
                    }
                </select>

                {/* CITY */}
                <select
                    value={filters.city}
                    onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">City</option>
                    {filters.state &&
                        FILTER_DATA.cities[filters.state]?.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))
                    }
                </select>

                {/* DESIGNATION */}
                <select
                    value={filters.designation}
                    onChange={(e) =>
                        setFilters({ ...filters, designation: e.target.value })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">Designation</option>
                    {FILTER_DATA.designations.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                    ))}
                </select>

                {/* INDUSTRY */}
                <select
                    value={filters.industry}
                    onChange={(e) =>
                        setFilters({ ...filters, industry: e.target.value })
                    }
                    className="border p-2 rounded"
                >
                    <option value="">Industry</option>
                    {FILTER_DATA.industries.map((i, idx) => (
                        <option key={idx} value={i}>{i}</option>
                    ))}
                </select>
            </div>

            {/* ================= EXPORT ================= */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={downloadExcel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm"
                >
                    <Download size={16} />
                    Export Excel
                </button>
            </div>

            {/* ================= RESULTS ================= */}
            <div className="mt-6 bg-white rounded-2xl shadow-md border overflow-hidden">

                {!searched ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">

                        <div
                            className="p-5 rounded-full mb-4"
                            style={{
                                background: "linear-gradient(135deg, rgba(10,132,162,0.15), rgba(13,165,199,0.15))"
                            }}
                        >
                            <Search size={30} className="text-cyan-600" />
                        </div>

                        <p className="text-lg font-semibold text-gray-700">Start Searching</p>

                        <p className="text-sm text-gray-400 mt-1">
                            Use filters or keywords to find employees
                        </p>
                    </div>

                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">

                        <div
                            className="p-5 rounded-full mb-4"
                            style={{
                                background: "linear-gradient(135deg, rgba(10,132,162,0.15), rgba(13,165,199,0.15))"
                            }}
                        >
                            <Loader2 size={30} className="animate-spin text-cyan-600" />
                        </div>

                        <p className="text-lg font-semibold text-gray-700">Searching...</p>

                        <p className="text-sm text-gray-400 mt-1">
                            Fetching results, please wait
                        </p>
                    </div>

                ) : paged.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">

                        <div
                            className="p-5 rounded-full mb-4"
                            style={{
                                background: "linear-gradient(135deg, rgba(10,132,162,0.15), rgba(13,165,199,0.15))"
                            }}
                        >
                            <Inbox size={30} className="text-cyan-600" />
                        </div>

                        <p className="text-lg font-semibold text-gray-700">No Results Found</p>

                        <p className="text-sm text-gray-400 mt-1">
                            Try changing filters or search query
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg border overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">

                                {/* HEADER */}
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Full Name</th>
                                        <th className="px-6 py-4">Designation</th>
                                        <th className="px-6 py-4">Company</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Industry</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>

                                {/* BODY */}
                                <tbody className="divide-y">

                                    {paged.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gray-50 transition duration-200"
                                        >

                                            {/* NAME */}
                                            <td
                                                className="px-6 py-4 font-semibold text-cyan-700 cursor-pointer hover:underline"
                                                onClick={() =>
                                                    navigate(`/dashboard/profile/${item._id}`, {
                                                        state: { results, filters, page, query },
                                                    })
                                                }
                                            >
                                                {item.first_name + " " + item.last_name || "-"}
                                            </td>

                                            <td className="px-6 py-4">{item.designation || "-"}</td>

                                            <td className="px-6 py-4">{item.company_name || "-"}</td>

                                            {/* LOCATION MERGED */}
                                            <td className="px-6 py-4 text-gray-500">
                                                {item.city}, {item.state}
                                            </td>

                                            <td className="px-6 py-4">{item.company_industry || "-"}</td>

                                            {/* EMAIL */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">

                                                    <span className="truncate max-w-[140px]">
                                                        {visibleFields[item._id]?.email
                                                            ? item.personal_email || "-"
                                                            : "••••••••"}
                                                    </span>

                                                    <button
                                                        onClick={() => toggleField(item._id, "email")}
                                                        className="p-1 rounded hover:bg-gray-200"
                                                    >
                                                        {visibleFields[item._id]?.email ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )}
                                                    </button>

                                                </div>
                                            </td>

                                            {/* PHONE */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">

                                                    <span>
                                                        {visibleFields[item._id]?.phone
                                                            ? item.phone || "-"
                                                            : "••••••••"}
                                                    </span>

                                                    <button
                                                        onClick={() => toggleField(item._id, "phone")}
                                                        className="p-1 rounded hover:bg-gray-200"
                                                    >
                                                        {visibleFields[item._id]?.phone ? (
                                                            <EyeOff size={16} />
                                                        ) : (
                                                            <Eye size={16} />
                                                        )}
                                                    </button>

                                                </div>
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/dashboard/profile/${item._id}`, {
                                                            state: { results, filters, page, query },
                                                        })
                                                    }
                                                    className="px-4 py-1.5 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>


                )}
            </div>

            {/* ================= PAGINATION ================= */}
            {searched && totalPages > 1 && (
                <div className="mt-5 flex justify-center gap-3">
                    <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                        <ChevronLeft />
                    </button>

                    <span>{page} / {totalPages}</span>

                    <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                        <ChevronRight />
                    </button>
                </div>
            )}

        </div>
    );
};

export default SearchPage;