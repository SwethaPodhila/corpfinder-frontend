import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`https://corpfinder-backend.onrender.com/employee/${id}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [id]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p>{user.designation}</p>
            <p>{user.company}</p>
            <p>{user.email}</p>
            <p>{user.city}, {user.state}, {user.country}</p>
        </div>
    );
};

export default ProfilePage;