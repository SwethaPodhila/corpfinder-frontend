import React, { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("people");
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        industry: "",
        designation: "",
        country: "",
        state: "",
        city: ""
    });

    const [options, setOptions] = useState({
        industries: [],
        designations: [],
        countries: [],
        states: [],
        cities: []
    });

    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const items = Array.isArray(results) ? results : [];
    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

    const paged = items.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -----------------------------
    // SMART SEARCH FUNCTION
    // -----------------------------
    const handleSearch = useCallback(async () => {
        setLoading(true);
        setSearched(true);

        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
            );

            const params = new URLSearchParams();

            if (query.trim()) params.append("query", query.trim());
            params.append("type", tab);

            Object.entries(cleanFilters).forEach(([k, v]) => {
                params.append(k, v);
            });

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/filters/search?${params.toString()}`
            );

            const data = await res.json();

            setResults(data);
            setPage(1);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    }, [query, tab, filters]);

    // -----------------------------
    // DEBOUNCE (AUTO SEARCH)
    // -----------------------------
    useEffect(() => {
        const isQueryEmpty = !query.trim();
        const areFiltersEmpty = Object.values(filters).every(v => !v);

        // ❌ Empty unte API call cheyyaku
        if (isQueryEmpty && areFiltersEmpty) {
            return;
        }

        const timer = setTimeout(() => {
            handleSearch();
        }, 600);

        return () => clearTimeout(timer);
    }, [query, filters, tab, handleSearch]);

    // -----------------------------
    // FILTER UPDATE
    // -----------------------------
    const updateFilter = (key, value) => {
        setPage(1);

        setFilters((prev) => {
            let updated = { ...prev, [key]: value };

            if (key === "country") {
                updated.state = "";
                updated.city = "";
            }
            if (key === "state") {
                updated.city = "";
            }

            return updated;
        });
    };

    // -----------------------------
    // LOAD FILTER OPTIONS
    // -----------------------------
    useEffect(() => {
        const fetchFilters = async () => {
            const res = await fetch("https://corpfinder-backend.onrender.com/filters/filters");
            const data = await res.json();

            setOptions({
                industries: data.industries || [],
                designations: data.designations || [],
                countries: data.countries || [],
                states: data.states || [],
                cities: data.cities || []
            });
        };

        fetchFilters();
    }, []);

    const downloadExcel = () => {
        if (!results || results.length === 0) {
            alert("No data available to download");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(file, "search-results.xlsx");
    };

    return (
        <div className="p-6">

            {/* SEARCH */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-200">
                <SearchIcon />
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search anything..."
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />

                <button
                    onClick={handleSearch}
                    className="btn-primary1"
                >
                    Search
                </button>
            </div>

            {/* FILTERS */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">

                <select className="input-pro" value={filters.industry} onChange={(e) => updateFilter("industry", e.target.value)}>
                    <option value="">Industry</option>
                    {options.industries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-pro" value={filters.designation} onChange={(e) => updateFilter("designation", e.target.value)}>
                    <option value="">Designation</option>
                    {options.designations.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-pro" value={filters.country} onChange={(e) => updateFilter("country", e.target.value)}>
                    <option value="">Country</option>
                    {options.countries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-pro" value={filters.state} onChange={(e) => updateFilter("state", e.target.value)}>
                    <option value="">State</option>
                    {options.states.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-pro" value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}>
                    <option value="">City</option>
                    {options.cities.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

            </div>

            {/* TABS */}
            <div className="mt-4 flex gap-3 items-center justify-between flex-wrap">
                <div className="mt-2 flex gap-3 bg-gray-100 p-1 rounded-xl w-fit">

                    {["people", "companies"].map((t) => (
                        <button
                            key={t}
                            onClick={() => {
                                setTab(t);
                                setPage(1);
                            }}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === t
                                    ? "bg-[rgba(10,132,162,1)] text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={downloadExcel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg 
               bg-emerald-600 text-white text-sm font-medium
               hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                >
                    <Download size={16} />
                    Export Excel
                </button>
            </div>

            {/* RESULTS TABLE */}
            <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

                {!searched ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-600 mb-20">

                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <SearchIcon size={28} className="text-gray-500" />
                        </div>

                        <p className="text-xl font-semibold">Start searching</p>

                        <p className="text-sm text-gray-400 mt-1 ">
                            Search people or companies by name, role, or location
                        </p>

                    </div>
                ) : loading ? (
                    <div className="text-center mt-20 flex flex-col items-center gap-3 mb-20">

                        {/* Spinner */}
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        {/* Text */}
                        <p className="text-lg font-semibold text-gray-700">
                            Searching...
                        </p>
                        <p className="text-sm text-gray-400">
                            We’re fetching the best results for you
                        </p>

                    </div>
                ) : paged.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">

                        {/* Icon */}
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>

                        {/* Title */}
                        <p className="text-xl font-semibold text-gray-700">
                            No results found
                        </p>

                        {/* Subtitle */}
                        <p className="text-sm text-gray-400 mt-2 max-w-sm">
                            We couldn’t find anything matching your search. Try different keywords or adjust your filters.
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                setQuery("");
                                setFilters({
                                    industry: "",
                                    designation: "",
                                    country: "",
                                    state: "",
                                    city: ""
                                });
                            }}
                            className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">

                        {/* HEADER */}
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Designation</th>
                                <th className="p-3 border">Company</th>

                                <th className="p-3 border">Industry</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">State</th>
                                <th className="p-3 border">Country</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="text-sm">

                            {paged.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">

                                    {/* NAME */}
                                    <td
                                        className="p-3 border font-medium cursor-pointer transition"
                                        style={{ color: "rgba(10, 132, 162, 1)" }}
                                        onClick={() => navigate(`/profile/${item._id}`)}
                                    >
                                        {item.name || "-"}
                                    </td>

                                    {/* DESIGNATION */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.designation || "-"}
                                    </td>

                                    {/* COMPANY */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.company || item.name || "-"}
                                    </td>

                                    {/* INDUSTRY */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.industry || "-"}
                                    </td>

                                    {/* CITY */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.city || "-"}
                                    </td>

                                    {/* STATE */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.state || "-"}
                                    </td>

                                    {/* COUNTRY */}
                                    <td className="px-4 py-3 text-gray-700">
                                        {item.country || "-"}
                                    </td>


                                </tr>
                            ))}

                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            {searched && totalPages > 1 && (
                <div className="mt-5 flex justify-center gap-3 items-center">

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
