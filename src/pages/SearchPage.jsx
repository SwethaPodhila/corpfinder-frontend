import React, { useState, useCallback, useEffect } from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
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
    const runSearch = useCallback(async (searchText = query) => {

        const cleanQuery = (searchText || "").trim().toLowerCase();
        if (!cleanQuery) return;

        setLoading(true);
        setSearched(true);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/filters/search?query=${cleanQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();
            setResults(data.data || []);
            setPage(1);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);

    }, [query]);

    /* useEffect(() => {
         const params = new URLSearchParams(location.search);
         const q = params.get("query");
 
         if (q) {
             setQuery(q);
             runSearch(q); // auto search trigger
         }
     }, [location.search, runSearch]);*/


    useEffect(() => {
        if (location.state?.results) {
            setResults(location.state.results);
            setFilters(location.state.filters);
            setPage(location.state.page);
            setQuery(location.state.query);
            setSearched(true);
            return;
        }

        const params = new URLSearchParams(location.search);
        const q = params.get("query");

        if (q) {
            setQuery(q);
            runSearch(q);
        }
    }, []);

    const normalize = (val) =>
        (val || "")
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");

    // ---------------- FILTER DATA ----------------
    const filteredResults = results.filter((item) => {
        return (
            (!filters.country ||
                normalize(item.country).includes(normalize(filters.country))) &&

            (!filters.state ||
                normalize(item.state).includes(normalize(filters.state))) &&

            (!filters.city ||
                normalize(item.city).includes(normalize(filters.city))) &&

            (!filters.designation ||
                normalize(item.designation).includes(normalize(filters.designation))) &&

            (!filters.industry ||
                normalize(item.company_industry).includes(normalize(filters.industry)))
        );
    });

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
                    <div className="text-center py-20 text-gray-500">
                        Start searching...
                    </div>

                ) : loading ? (
                    <div className="text-center py-20">
                        Searching...
                    </div>

                ) : paged.length === 0 ? (
                    <div className="text-center py-20">
                        No results found
                    </div>

                ) : (

                    <table className="min-w-full border">

                        <thead className="bg-gray-100 text-xs uppercase">
                            <tr>
                                <th className="p-3 border">Full Name</th>
                                <th className="p-3 border">Designation</th>
                                <th className="p-3 border">Company Name</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">State</th>
                                <th className="p-3 border">Country</th>
                                <th className="p-3 border">Company Type</th>
                                <th className="p-3 border">Company Industry</th>
                                <th className="p-3 border">Personal Email</th>
                                <th className="p-3 border">Phone</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">

                            {paged.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">

                                    <td
                                        className="p-3 border font-medium text-[rgba(10,132,162,1)] cursor-pointer"
                                        onClick={() =>
                                            navigate(`/dashboard/profile/${item._id}`, {
                                                state: {
                                                    results,
                                                    filters,
                                                    page,
                                                    query,
                                                },
                                            })
                                        }
                                    >
                                        {item.first_name + " " + item.last_name || "-"}
                                    </td>

                                    <td className="p-3 border">{item.designation || "-"}</td>
                                    <td className="p-3 border">{item.company_name || "-"}</td>
                                    <td className="p-3 border">{item.city || "-"}</td>
                                    <td className="p-3 border">{item.state || "-"}</td>
                                    <td className="p-3 border">{item.country || "-"}</td>
                                    <td className="p-3 border">{item.company_type || "-"}</td>
                                    <td className="p-3 border">{item.company_industry || "-"}</td>

                                    <td className="p-3 border">
                                        <div className="flex items-center justify-between gap-2">

                                            <span className="truncate">
                                                {visibleFields[item._id]?.email
                                                    ? item.personal_email || "-"
                                                    : "•••••••"}
                                            </span>

                                            <button
                                                onClick={() => toggleField(item._id, "email")}
                                                className="p-1.5 rounded-md hover:bg-gray-100 transition"
                                                title={visibleFields[item._id]?.email ? "Hide email" : "Show email"}
                                            >
                                                {visibleFields[item._id]?.email ? (
                                                    <EyeOff size={18} className="text-gray-700" />
                                                ) : (
                                                    <Eye size={18} className="text-gray-700" />
                                                )}
                                            </button>

                                        </div>
                                    </td>

                                    <td className="p-3 border">
                                        <div className="flex items-center justify-between gap-2">

                                            <span className="tracking-wider">
                                                {visibleFields[item._id]?.phone
                                                    ? item.phone || "-"
                                                    : "•••••••"}
                                            </span>

                                            <button
                                                onClick={() => toggleField(item._id, "phone")}
                                                className="p-1.5 rounded-md hover:bg-gray-100 transition"
                                                title={visibleFields[item._id]?.phone ? "Hide phone" : "Show phone"}
                                            >
                                                {visibleFields[item._id]?.phone ? (
                                                    <EyeOff size={18} className="text-gray-700" />
                                                ) : (
                                                    <Eye size={18} className="text-gray-700" />
                                                )}
                                            </button>

                                        </div>
                                    </td>

                                    <td className="p-3 border">
                                        <button
                                            onClick={() =>
                                                navigate(`/dashboard/profile/${item._id}`, {
                                                    state: {
                                                        results,
                                                        filters,
                                                        page,
                                                        query,
                                                    },
                                                })
                                            }
                                            className="px-3 py-1 bg-blue-600 text-white rounded"
                                        >
                                            View Full Details
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </table>
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