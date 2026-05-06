import React, { createContext, useContext, useState, useEffect } from "react";

const CreditsContext = createContext();

export const CreditsProvider = ({ children }) => {
    const [credits, setCredits] = useState(0);

    const fetchCredits = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                "https://corpfinder-backend.onrender.com/user/status",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                const data = await res.json();
                setCredits(data.credits); // 🔥 triggers re-render everywhere
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    return (
        <CreditsContext.Provider
            value={{ credits, setCredits, fetchCredits }} // 🔥 add setCredits
        >
            {children}
        </CreditsContext.Provider>
    );
};

export const useCredits = () => useContext(CreditsContext);