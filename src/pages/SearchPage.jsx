import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("people");
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("query");

        if (q) {
            setQuery(q);
            runSearch(q);
        }
    }, [location.search]);

    /* useEffect(() => {
         if (!query || query.trim() === "") return;
 
         runSearch(query);
     }, [query, tab]);*/

    const handleSearchFromHistory = async (q) => {
        setLoading(true);
        setSearched(true);

        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
            );

            const params = new URLSearchParams();

            params.append("query", q);
            params.append("type", tab);

            Object.entries(cleanFilters).forEach(([k, v]) => {
                params.append(k, v);
            });

            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/filters/search?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            setResults(data);
            setPage(1);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

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
    const lastQueryRef = useRef("");

    const runSearch = useCallback(async (searchText) => {
        // const cleanQuery = query.trim().toLowerCase();
        const cleanQuery = (searchText || query).trim().toLowerCase();

        console.log("🔵 FRONTEND SEARCH START");
        console.log("📝 Query:", cleanQuery);
        console.log("🏷️ Tab:", tab);
        console.log("🎛️ Filters:", filters);

        if (!cleanQuery) return;

        setLoading(true);
        setSearched(true);

        try {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
            );

            console.log("🧹 Clean Filters:", cleanFilters);

            const params = new URLSearchParams();
            params.append("query", cleanQuery);
            params.append("type", tab);

            Object.entries(cleanFilters).forEach(([k, v]) => {
                params.append(k, v);
            });

            console.log("📡 API PARAMS:", params.toString());

            const token = localStorage.getItem("token");

            const res = await fetch(
                `https://corpfinder-backend.onrender.com/filters/search?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            console.log("📥 RESPONSE:", data);

            setResults(data.data || []);
            setPage(1);

        } catch (err) {
            console.log("❌ FRONTEND ERROR:", err);
        }

        setLoading(false);
    }, [query, tab, filters]);

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

    useEffect(() => {
        if (!query) return;
        runSearch();
    }, [filters, tab]);

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


    const downloadExcel = async () => {
        if (!results || results.length === 0) {
            alert("No data available to download");
            return;
        }

        // 👉 create excel
        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        // 👉 dynamic file name (based on query)
        const cleanQuery = query
            ? query.replace(/\s+/g, "-").toLowerCase()
            : "results";

        const fileName = `${cleanQuery}-${Date.now()}.xlsx`;

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        // 👉 formdata
        const formData = new FormData();
        formData.append("file", file, fileName);
        formData.append("name", fileName);
        formData.append("recordCount", results.length);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("https://corpfinder-backend.onrender.com/downloads/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            console.log("Upload response:", data);

        } catch (err) {
            console.log("Upload error:", err);
        }

        // 👉 local download
        saveAs(file, fileName);
    };

    /* useEffect(() => {
         if (!query) return;
         runSearch();
     }, [filters, tab]); */


    return (
        <div className="p-6">

            {/* SEARCH */}
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-200">
                <SearchIcon />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            runSearch();
                        }
                    }} placeholder={`Search ${tab === "people" ? "people, roles, companies..." : "companies, industries..."}`}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />

                <button
                    onClick={runSearch}
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
            {/* RESULTS TABLE */}
            <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

                {!searched ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-600 mb-20">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <SearchIcon size={28} className="text-gray-500" />
                        </div>

                        <p className="text-xl font-semibold">Start searching</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Search people or companies by name, role, or location
                        </p>
                    </div>

                ) : loading ? (
                    <div className="text-center mt-20 flex flex-col items-center gap-3 mb-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-lg font-semibold text-gray-700">Searching...</p>
                    </div>

                ) : paged.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-700">No results found</p>
                    </div>

                ) : tab === "people" ? (

                    /* ================= PEOPLE TABLE ================= */
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">

                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Designation</th>
                                <th className="p-3 border">Company</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">State</th>
                                <th className="p-3 border">Country</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Phone</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">

                            {paged.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">

                                    <td
                                        className="p-3 border font-medium text-[rgba(10,132,162,1)] cursor-pointer"
                                        onClick={() => navigate(`/profile/${item._id}`)}
                                    >
                                        {item.first_name} {item.last_name || ""}
                                    </td>

                                    <td className="p-3 border">{item.designation || "-"}</td>

                                    <td className="p-3 border">{item.company_name || "-"}</td>

                                    <td className="p-3 border">{item.city || "-"}</td>

                                    <td className="p-3 border">{item.state || "-"}</td>

                                    <td className="p-3 border">{item.country || "-"}</td>

                                    <td className="p-3 border">
                                        {item.personal_email || item.business_email || "-"}
                                    </td>

                                    <td className="p-3 border">{item.phone || "-"}</td>

                                </tr>
                            ))}

                        </tbody>
                    </table>

                ) : (

                    /* ================= COMPANY TABLE ================= */
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">

                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="p-3 border">Company Name</th>
                                <th className="p-3 border">Type</th>
                                <th className="p-3 border">Industry</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">State</th>
                                <th className="p-3 border">Country</th>
                                <th className="p-3 border">Website</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">

                            {paged.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">

                                    <td className="p-3 border font-medium text-[rgba(10,132,162,1)]">
                                        {item.company_name || "-"}
                                    </td>

                                    <td className="p-3 border">{item.company_type || "-"}</td>

                                    <td className="p-3 border">{item.company_industry || "-"}</td>

                                    <td className="p-3 border">{item.company_city || "-"}</td>

                                    <td className="p-3 border">{item.company_state || "-"}</td>

                                    <td className="p-3 border">{item.company_country || "-"}</td>

                                    <td className="p-3 border">{item.company_website || "-"}</td>

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
