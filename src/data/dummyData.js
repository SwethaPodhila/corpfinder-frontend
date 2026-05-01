export const companies = [
    { id: 1, name: "TechNova Solutions", industry: "Technology", location: "San Francisco, CA, USA", employees: 1250, website: "technova.com", logo: "TN" },
    { id: 2, name: "Meridian Health Group", industry: "Healthcare", location: "New York, NY, USA", employees: 3400, website: "meridianhealth.com", logo: "MH" },
    { id: 3, name: "Atlas Financial Corp", industry: "Finance", location: "Chicago, IL, USA", employees: 890, website: "atlasfinancial.com", logo: "AF" },
    { id: 4, name: "GreenLeaf Energy", industry: "Energy", location: "Austin, TX, USA", employees: 560, website: "greenleaf.com", logo: "GL" },
    { id: 5, name: "Pinnacle Marketing", industry: "Marketing", location: "Los Angeles, CA, USA", employees: 320, website: "pinnaclemktg.com", logo: "PM" },
    { id: 6, name: "CloudBridge Systems", industry: "Technology", location: "Seattle, WA, USA", employees: 780, website: "cloudbridge.io", logo: "CB" },
    { id: 7, name: "Vertex Consulting", industry: "Consulting", location: "Boston, MA, USA", employees: 450, website: "vertexconsult.com", logo: "VC" },
    { id: 8, name: "Horizon Logistics", industry: "Logistics", location: "Dallas, TX, USA", employees: 2100, website: "horizonlog.com", logo: "HL" },
    { id: 9, name: "Sapphire Retail", industry: "Retail", location: "Miami, FL, USA", employees: 1800, website: "sapphireretail.com", logo: "SR" },
    { id: 10, name: "NovaTech AI", industry: "Technology", location: "San Jose, CA, USA", employees: 340, website: "novatechai.com", logo: "NA" },
];

export const people = [
    { id: 1, name: "Sarah Johnson", role: "CEO", company: "TechNova Solutions", location: "San Francisco, CA", email: "sarah@technova.com", industry: "Technology" },
    { id: 2, name: "Michael Chen", role: "CTO", company: "TechNova Solutions", location: "San Francisco, CA", email: "michael@technova.com", industry: "Technology" },
    { id: 3, name: "Emily Rodriguez", role: "HR Director", company: "Meridian Health Group", location: "New York, NY", email: "emily@meridian.com", industry: "Healthcare" },
    { id: 4, name: "David Kim", role: "VP of Sales", company: "Atlas Financial Corp", location: "Chicago, IL", email: "david@atlas.com", industry: "Finance" },
    { id: 5, name: "Jessica Liu", role: "Marketing Manager", company: "Pinnacle Marketing", location: "Los Angeles, CA", email: "jessica@pinnacle.com", industry: "Marketing" },
    { id: 6, name: "Robert Taylor", role: "CFO", company: "GreenLeaf Energy", location: "Austin, TX", email: "robert@greenleaf.com", industry: "Energy" },
    { id: 7, name: "Amanda Foster", role: "Product Manager", company: "CloudBridge Systems", location: "Seattle, WA", email: "amanda@cloudbridge.io", industry: "Technology" },
    { id: 8, name: "James Wilson", role: "HR Manager", company: "Vertex Consulting", location: "Boston, MA", email: "james@vertex.com", industry: "Consulting" },
    { id: 9, name: "Lisa Park", role: "Operations Director", company: "Horizon Logistics", location: "Dallas, TX", email: "lisa@horizon.com", industry: "Logistics" },
    { id: 10, name: "Daniel Brown", role: "CEO", company: "Sapphire Retail", location: "Miami, FL", email: "daniel@sapphire.com", industry: "Retail" },
    { id: 11, name: "Nicole Adams", role: "CTO", company: "NovaTech AI", location: "San Jose, CA", email: "nicole@novatech.com", industry: "Technology" },
    { id: 12, name: "Chris Martinez", role: "Manager", company: "TechNova Solutions", location: "San Francisco, CA", email: "chris@technova.com", industry: "Technology" },
    { id: 13, name: "Karen White", role: "HR Manager", company: "Atlas Financial Corp", location: "Chicago, IL", email: "karen@atlas.com", industry: "Finance" },
    { id: 14, name: "Brian Lee", role: "CEO", company: "Vertex Consulting", location: "Boston, MA", email: "brian@vertex.com", industry: "Consulting" },
    { id: 15, name: "Sophia Patel", role: "Designer", company: "Pinnacle Marketing", location: "Los Angeles, CA", email: "sophia@pinnacle.com", industry: "Marketing" },
    { id: 16, name: "Alex Turner", role: "VP Engineering", company: "CloudBridge Systems", location: "Seattle, WA", email: "alex@cloudbridge.io", industry: "Technology" },
];

export const industries = ["Technology", "Healthcare", "Finance", "Energy", "Marketing", "Consulting", "Logistics", "Retail"];

export const designations = [
    "CEO",
    "CTO",
    "CFO",
    "HR Director",
    "HR Manager",
    "VP of Sales",
    "VP Engineering",
    "Marketing Manager",
    "Product Manager",
    "Operations Director",
    "Manager",
    "Designer"
];

export const countries = ["USA"];

export const states = {
    USA: ["California", "New York", "Illinois", "Texas", "Washington", "Massachusetts", "Florida"]
};

export const cities = {
    California: ["San Francisco", "Los Angeles", "San Jose"],
    "New York": ["New York City"],
    Illinois: ["Chicago"],
    Texas: ["Austin", "Dallas"],
    Washington: ["Seattle"],
    Massachusetts: ["Boston"],
    Florida: ["Miami"],
};

export const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        credits: 50,
        tagline: "Get started",
        features: [
            "Unlimited search",
            "Basic filters",
            "50 contact unlocks",
            "Download up to 50 contacts",
            "Blurred contact details"
        ],
        cta: "Start Free"
    },
    {
        name: "Pro",
        price: "$39",
        credits: 2500,
        tagline: "Most Popular",
        features: [
            "Unlimited search",
            "Advanced filters",
            "2500 contact unlocks",
            "Download up to 2500 contacts",
            "Email, Phone, LinkedIn access",
            "Export to Excel"
        ],
        cta: "Upgrade to Pro",
        highlight: true
    },
    {
        name: "Premium",
        price: "$79",
        credits: 5000,
        tagline: "For power users",
        features: [
            "Everything in Pro",
            "5000 contact unlocks",
            "Download up to 5000 contacts",
            "Full profile insights",
            "Bulk export (Excel + CSV)",
            "API access"
        ],
        cta: "Go Premium"
    }
];

export const searchHistory = [
    { id: 1, query: "Technology companies in California", date: "2026-04-12", results: 24 },
    { id: 2, query: "HR Directors in Healthcare", date: "2026-04-11", results: 8 },
    { id: 3, query: "CEOs in Finance sector", date: "2026-04-10", results: 15 },
    { id: 4, query: "Marketing agencies in Los Angeles", date: "2026-04-09", results: 12 },
    { id: 5, query: "Software engineers in Seattle", date: "2026-04-08", results: 42 },
];