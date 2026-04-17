import React, { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("people");

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

    return (
        <div className="p-6">

            {/* SEARCH */}
            <div className="flex items-center gap-3 border p-3 rounded-xl">
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
                    className="flex-1 outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-black text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* FILTERS */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">

                <select value={filters.industry} onChange={(e) => updateFilter("industry", e.target.value)}>
                    <option value="">Industry</option>
                    {options.industries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select value={filters.designation} onChange={(e) => updateFilter("designation", e.target.value)}>
                    <option value="">Designation</option>
                    {options.designations.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select value={filters.country} onChange={(e) => updateFilter("country", e.target.value)}>
                    <option value="">Country</option>
                    {options.countries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select value={filters.state} onChange={(e) => updateFilter("state", e.target.value)}>
                    <option value="">State</option>
                    {options.states.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}>
                    <option value="">City</option>
                    {options.cities.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

            </div>

            {/* TABS */}
            <div className="mt-4 flex gap-3">
                {["people", "companies"].map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setTab(t);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded ${tab === t ? "bg-black text-white" : "bg-gray-200"}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* RESULTS */}
            {/* RESULTS TABLE */}
            <div className="mt-6 overflow-x-auto">

                {!searched ? (
                    <p className="text-center text-gray-400">Start searching...</p>
                ) : loading ? (
                    <p className="text-center">Loading...</p>
                ) : paged.length === 0 ? (
                    <p className="text-center">No results found</p>
                ) : (
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">

                        {/* HEADER */}
                        <thead className="bg-gray-100 text-left text-sm">
                            <tr>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Designation</th>
                                <th className="p-3 border">Company</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Phone</th>
                                <th className="p-3 border">Industry</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">State</th>
                                <th className="p-3 border">Country</th>
                                <th className="p-3 border">Description</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="text-sm">

                            {paged.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">

                                    {/* NAME */}
                                    <td className="p-3 border font-medium">
                                        {item.name || "-"}
                                    </td>

                                    {/* DESIGNATION */}
                                    <td className="p-3 border">
                                        {item.designation || "-"}
                                    </td>

                                    {/* COMPANY */}
                                    <td className="p-3 border">
                                        {item.company || item.name || "-"}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="p-3 border">
                                        {item.email || "-"}
                                    </td>

                                    {/* PHONE */}
                                    <td className="p-3 border">
                                        {item.phone || "-"}
                                    </td>

                                    {/* INDUSTRY */}
                                    <td className="p-3 border">
                                        {item.industry || "-"}
                                    </td>

                                    {/* CITY */}
                                    <td className="p-3 border">
                                        {item.city || "-"}
                                    </td>

                                    {/* STATE */}
                                    <td className="p-3 border">
                                        {item.state || "-"}
                                    </td>

                                    {/* COUNTRY */}
                                    <td className="p-3 border">
                                        {item.country || "-"}
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="p-3 border text-gray-600 max-w-xs truncate">
                                        {item.description || "-"}
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
