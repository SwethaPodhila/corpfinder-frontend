const FILTER_DATA = {

    // 🌍 COUNTRIES
    countries: [
        "India",
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "China",
        "United Arab Emirates",
        "Singapore",
        "Brazil",
        "Russia",
        "South Korea",
        "Italy",
        "Spain",
        "Netherlands",
        "Saudi Arabia",
        "South Africa",
        "Mexico"
    ],

    // 🏛 STATES (COUNTRY → STATES)
    states: {
        India: [
            "Andhra Pradesh",
            "Telangana",
            "Karnataka",
            "Tamil Nadu",
            "Maharashtra",
            "Delhi",
            "Gujarat",
            "Kerala",
            "Uttar Pradesh"
        ],

        "United States": [
            "California",
            "Texas",
            "New York",
            "Florida",
            "Illinois",
            "Washington",
            "Massachusetts"
        ],

        Canada: [
            "Ontario",
            "Quebec",
            "British Columbia"
        ],

        "United Kingdom": [
            "England",
            "Scotland",
            "Wales"
        ],

        Australia: [
            "New South Wales",
            "Victoria",
            "Queensland"
        ],

        Germany: [
            "Bavaria",
            "Berlin",
            "Hesse"
        ],

        France: [
            "Île-de-France",
            "Provence-Alpes-Côte d'Azur"
        ],

        Japan: [
            "Tokyo",
            "Osaka",
            "Kyoto"
        ],

        China: [
            "Beijing",
            "Shanghai",
            "Guangdong"
        ],

        "United Arab Emirates": [
            "Dubai",
            "Abu Dhabi",
            "Sharjah",
            "Ajman"
        ],

        Singapore: ["Central Region"],
        Brazil: ["São Paulo", "Rio de Janeiro"],
        Russia: ["Moscow", "Saint Petersburg"],
        "South Korea": ["Seoul", "Busan"],
        Italy: ["Lazio", "Lombardy"],
        Spain: ["Madrid", "Catalonia"],
        Netherlands: ["North Holland", "South Holland"],
        "Saudi Arabia": ["Riyadh", "Makkah"],
        "South Africa": ["Gauteng", "Western Cape"],
        Mexico: ["Mexico City", "Jalisco"]
    },

    // 🏙 CITIES (STATE → CITIES)
    cities: {

        // 🇮🇳 India
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
        Telangana: ["Hyderabad", "Warangal"],
        Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
        Maharashtra: ["Mumbai", "Pune", "Nagpur"],
        Delhi: ["New Delhi", "Noida", "Gurgaon"],
        Gujarat: ["Ahmedabad", "Surat"],
        Kerala: ["Kochi", "Thiruvananthapuram"],
        "Uttar Pradesh": ["Lucknow", "Kanpur"],

        // 🇺🇸 USA
        California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
        Texas: ["Houston", "Dallas", "Austin"],
        "New York": ["New York City", "Buffalo"],
        Florida: ["Miami", "Orlando", "Tampa"],
        Illinois: ["Chicago"],
        Washington: ["Seattle"],
        Massachusetts: ["Boston"],

        // 🇨🇦 Canada
        Ontario: ["Toronto", "Ottawa", "Mississauga"],
        Quebec: ["Montreal", "Quebec City"],
        "British Columbia": ["Vancouver", "Victoria"],

        // 🇬🇧 UK
        England: ["London", "Manchester", "Birmingham"],
        Scotland: ["Edinburgh", "Glasgow"],
        Wales: ["Cardiff"],

        // 🇦🇺 Australia
        "New South Wales": ["Sydney", "Newcastle"],
        Victoria: ["Melbourne"],
        Queensland: ["Brisbane"],

        // 🇩🇪 Germany
        Bavaria: ["Munich"],
        Berlin: ["Berlin"],
        Hesse: ["Frankfurt"],

        // 🇫🇷 France
        "Île-de-France": ["Paris"],
        "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice"],

        // 🇯🇵 Japan
        Tokyo: ["Tokyo"],
        Osaka: ["Osaka"],
        Kyoto: ["Kyoto"],

        // 🇨🇳 China
        Beijing: ["Beijing"],
        Shanghai: ["Shanghai"],
        Guangdong: ["Guangzhou", "Shenzhen"],

        // 🇦🇪 UAE
        Dubai: ["Dubai"],
        "Abu Dhabi": ["Abu Dhabi"],
        Sharjah: ["Sharjah"],
        Ajman: ["Ajman"],

        // 🌐 Others
        Singapore: ["Singapore"],
        "São Paulo": ["São Paulo"],
        "Rio de Janeiro": ["Rio de Janeiro"],
        Moscow: ["Moscow"],
        "Saint Petersburg": ["Saint Petersburg"],
        Seoul: ["Seoul"],
        Busan: ["Busan"],
        Madrid: ["Madrid"],
        Catalonia: ["Barcelona"],
        "North Holland": ["Amsterdam"],
        "South Holland": ["Rotterdam"],
        Riyadh: ["Riyadh"],
        Makkah: ["Mecca"],
        Gauteng: ["Johannesburg"],
        "Western Cape": ["Cape Town"],
        "Mexico City": ["Mexico City"],
        Jalisco: ["Guadalajara"]
    },

    // 👔 DESIGNATIONS
    designations: [
        "CEO", "CTO", "CFO", "COO",
        "VP Engineering", "VP Sales",
        "Director", "Senior Manager", "Manager",
        "HR Manager", "Team Lead",
        "Project Manager",
        "Software Architect",
        "Senior Software Engineer",
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DevOps Engineer",
        "Data Analyst",
        "Data Scientist",
        "QA Engineer",
        "UI/UX Designer",
        "Intern"
    ],

    // 🏢 INDUSTRIES
    industries: [
        "IT / Software Development",
        "Banking & Financial Services",
        "Healthcare & Pharmaceuticals",
        "Education & EdTech",
        "Manufacturing",
        "Retail & E-commerce",
        "Real Estate & Construction",
        "Telecommunications",
        "Automotive",
        "Energy & Utilities",
        "Consulting",
        "Marketing & Advertising",
        "Media & Entertainment",
        "Logistics & Supply Chain",
        "Travel & Hospitality",
        "Government",
        "Agriculture",
        "Cybersecurity",
        "Artificial Intelligence / ML",
        "Blockchain / Web3"
    ]

};

export default FILTER_DATA;