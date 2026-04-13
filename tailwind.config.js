/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#f9fafb",
                foreground: "#111827",

                card: "#ffffff",
                muted: "#f3f4f6",

                primary: "rgba(10, 132, 162, 1)",
                "primary-foreground": "#ffffff",

                secondary: "rgba(13, 165, 199, 1)",

                accent: "rgba(236, 254, 255, 1)",

                border: "#e5e7eb",
                input: "#e5e7eb",
                ring: "rgba(10, 132, 162, 1)",
            },

            borderRadius: {
                xl: "0.75rem",
                "2xl": "1rem",
            },

            boxShadow: {
                card: "0 4px 24px -4px rgba(79, 70, 229, 0.08)",
                "card-hover": "0 12px 40px -8px rgba(79, 70, 229, 0.18)",
                button: "0 4px 14px -2px rgba(79, 70, 229, 0.4)",
            },

            backgroundImage: {
                "gradient-primary": "linear-gradient(135deg, rgba(10,132,162,1), rgba(13,165,199,1))",
                "gradient-hero": "linear-gradient(135deg, rgba(10,132,162,1), rgba(6,182,212,1), rgba(13,165,199,1))",
                "gradient-cta": "linear-gradient(135deg, rgba(10,132,162,1), rgba(14,165,233,1))",
            },

            fontFamily: {
                inter: ["Inter", "sans-serif"],
                poppins: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [],
};