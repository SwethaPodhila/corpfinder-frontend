import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search as SearchIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("people");

    const [industries, setIndustries] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [filters, setFilters] = useState({
        industry: "",
        designation: "",
        country: "",
        state: "",
        city: ""
    });

    const items = Array.isArray(results) ? results : [];

    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

    const paged = items.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

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

    const handleSearch = async () => {
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
                `http://localhost:5000/filters/search?${params.toString()}`
            );

            const data = await res.json();

            setResults(data);
            setPage(1);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        const fetchFilters = async () => {
            const res = await fetch("http://localhost:5000/filters/filters");
            const data = await res.json();

            setIndustries(data.industries || []);
            setDesignations(data.designations || []);
            setCountries(data.countries || []);
            setStates(data.states || []);
            setCities(data.cities || []);
        };

        fetchFilters();
    }, []);

    return (
        <div className="p-6">

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold">Search Directory</h1>
                <p className="text-gray-500">Find companies and professionals</p>
            </motion.div>

            {/* SEARCH BAR */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border p-3">
                <SearchIcon className="text-gray-500" />

                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search by name, company..."
                    className="flex-1 outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="px-5 py-2 bg-black text-white rounded-lg"
                >
                    Search
                </button>
            </div>

            {/* FILTERS */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">

                <select className="input-styled" value={filters.industry} onChange={(e) => updateFilter("industry", e.target.value)}>
                    <option value="">Industry</option>
                    {industries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-styled" value={filters.designation} onChange={(e) => updateFilter("designation", e.target.value)}>
                    <option value="">Designation</option>
                    {designations.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-styled" value={filters.country} onChange={(e) => updateFilter("country", e.target.value)}>
                    <option value="">Country</option>
                    {countries.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-styled" value={filters.state} onChange={(e) => updateFilter("state", e.target.value)}>
                    <option value="">State</option>
                    {states.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

                <select className="input-styled" value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}>
                    <option value="">City</option>
                    {cities.map((i, idx) => <option key={idx}>{i}</option>)}
                </select>

            </div>

            {/* TABS */}
            <div className="mt-6 flex gap-3">
                {["people", "companies"].map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setTab(t);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg ${tab === t ? "bg-black text-white" : "bg-gray-200"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* RESULTS */}
            <div className="mt-6 grid md:grid-cols-3 gap-4">

                {!searched ? (
                    <p className="col-span-full text-center text-gray-400">
                        🔍 Start searching
                    </p>
                ) : loading ? (
                    <p className="col-span-full text-center">Loading...</p>
                ) : paged.length === 0 ? (
                    <p className="col-span-full text-center">No results found</p>
                ) : (
                    paged.map((item) => (
                        <div key={item._id} className="card-elevated p-4">
                            <h3 className="font-semibold text-lg">{item.name}</h3>

                            {tab === "people" ? (
                                <>
                                    <p>{item.designation} at {item.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.city}, {item.state}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500">
                                        {item.city}, {item.state}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.description?.slice(0, 60)}
                                    </p>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* PAGINATION */}
            {searched && totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-3">

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