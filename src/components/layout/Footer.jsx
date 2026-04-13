import React from "react";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-16">

            {/* Top Section */}
            <div className="grid gap-12 md:grid-cols-4">

                {/* Logo + About */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>

                        <span className="text-xl font-bold">
                            Corp<span className="gradient-text">Finder</span>
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The modern company directory platform for professionals.
                        Find companies and people instantly.
                    </p>
                </div>

                {/* Links */}
                {[
                    {
                        title: "Product",
                        links: [
                            ["Features", "#features"],
                            ["Pricing", "#pricing"],
                            ["Search", "/dashboard/search"],
                        ],
                    },
                    {
                        title: "Company",
                        links: [
                            ["About", "#"],
                            ["Careers", "#"],
                            ["Contact", "#"],
                        ],
                    },
                    {
                        title: "Legal",
                        links: [
                            ["Privacy", "#"],
                            ["Terms", "#"],
                            ["Security", "#"],
                        ],
                    },
                ].map((col) => (
                    <div key={col.title}>
                        <h4 className="font-semibold mb-4">{col.title}</h4>

                        <ul className="space-y-3">
                            {col.links.map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        to={href}
                                        className="text-sm text-muted-foreground hover:text-primary transition"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

                <p className="text-sm text-muted-foreground">
                    © 2026 CorpFinder. All rights reserved.
                </p>

                <div className="flex gap-4">
                    {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                        <a
                            key={s}
                            href="#"
                            className="text-sm text-muted-foreground hover:text-primary transition"
                        >
                            {s}
                        </a>
                    ))}
                </div>

            </div>
        </div>
    </footer>
);

export default Footer;