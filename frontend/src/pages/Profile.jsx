import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/profile/")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl">Profile</h1>
      <p>Name: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}