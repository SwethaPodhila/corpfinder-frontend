import React from "react";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaYoutube,
    FaPinterest,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="border-t bg-card">
            <div className="container mx-auto px-6 py-16">
                {/* Top Section */}
                <div className="grid gap-10 md:grid-cols-4">
                    {/* Logo & Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
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

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>

                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#features"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Features
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#pricing"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Pricing
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#how-it-works"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    How It Works
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>

                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#contact"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Contact
                                </a>
                            </li>

                            <li>
                                <Link
                                    to="/refund-policy"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>

                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/privacy-policy"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terms-and-conditions"
                                    className="text-sm text-muted-foreground hover:text-primary transition"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CorpFinder. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">
                        <a
                            href="https://www.facebook.com/profile.php?id=61591137336427"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href="https://x.com/GrowMatrixtbiz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <FaTwitter size={18} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/grow-matrix-145030419/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <FaLinkedin size={18} />
                        </a>

                        <a
                            href="https://www.youtube.com/@GrowMatrix-l3r"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <FaYoutube size={18} />
                        </a>

                        <a
                            href="https://pin.it/70XQneABu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition"
                        >
                            <FaPinterest size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;