import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Search as SearchIcon,
    MapPin,
    Building2,
    Mail,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    companies,
    people,
    industries,
    designations,
    countries,
    states,
    cities,
} from "../data/dummyData";

const ITEMS_PER_PAGE = 6;

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("people");
    const [filters, setFilters] = useState({
        industry: "",
        designation: "",
        country: "",
        state: "",
        city: "",
    });
    const [page, setPage] = useState(1);

    const filteredPeople = useMemo(() => {
        return people.filter((p) => {
            const q = query.toLowerCase();

            const matchQ =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.company.toLowerCase().includes(q) ||
                p.role.toLowerCase().includes(q);

            const matchInd = !filters.industry || p.industry === filters.industry;
            const matchDes = !filters.designation || p.role === filters.designation;

            return matchQ && matchInd && matchDes;
        });
    }, [query, filters]);

    const filteredCompanies = useMemo(() => {
        return companies.filter((c) => {
            const q = query.toLowerCase();

            const matchQ =
                !q ||
                c.name.toLowerCase().includes(q) ||
                c.industry.toLowerCase().includes(q);

            const matchInd = !filters.industry || c.industry === filters.industry;

            return matchQ && matchInd;
        });
    }, [query, filters]);

    const items = tab === "people" ? filteredPeople : filteredCompanies;

    const totalPages = Math.max(
        1,
        Math.ceil(items.length / ITEMS_PER_PAGE)
    );

    const paged = items.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const updateFilter = (key, value) => {
        setPage(1);

        if (key === "country") {
            setFilters((f) => ({
                ...f,
                country: value,
                state: "",
                city: "",
            }));
        } else if (key === "state") {
            setFilters((f) => ({
                ...f,
                state: value,
                city: "",
            }));
        } else {
            setFilters((f) => ({
                ...f,
                [key]: value,
            }));
        }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Search Directory
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Find companies and professionals
                </p>
            </motion.div>

            {/* Search Bar */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <SearchIcon className="ml-2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Search by name, company, role..."
                    className="flex-1 bg-transparent outline-none"
                />
                <button className="btn-primary px-6 py-2">Search</button>
            </div>

            {/* Filters */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <select
                    value={filters.industry}
                    onChange={(e) => updateFilter("industry", e.target.value)}
                    className="input-styled"
                >
                    <option value="">All Industries</option>
                    {industries.map((i) => (
                        <option key={i}>{i}</option>
                    ))}
                </select>

                <select
                    value={filters.designation}
                    onChange={(e) => updateFilter("designation", e.target.value)}
                    className="input-styled"
                >
                    <option value="">All Designations</option>
                    {designations.map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>

                <select
                    value={filters.country}
                    onChange={(e) => updateFilter("country", e.target.value)}
                    className="input-styled"
                >
                    <option value="">Country</option>
                    {countries.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>

                <select
                    value={filters.state}
                    onChange={(e) => updateFilter("state", e.target.value)}
                    disabled={!filters.country}
                    className="input-styled"
                >
                    <option value="">State</option>
                    {(states[filters.country] || []).map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>

                <select
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                    disabled={!filters.state}
                    className="input-styled"
                >
                    <option value="">City</option>
                    {(cities[filters.state] || []).map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-2">
                {["people", "companies"].map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setTab(t);
                            setPage(1);
                        }}
                        className={`px-5 py-2 ${tab === t ? "bg-primary text-white" : "bg-muted"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paged.map((item) => (
                    <motion.div key={item.id} className="card-elevated">
                        <h3>{item.name}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <ChevronLeft />
                </button>

                <button onClick={() => setPage(page + 1)}>
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default SearchPage;