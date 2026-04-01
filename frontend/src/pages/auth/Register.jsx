import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h1 className="text-xl mb-4">Register</h1>

      <input placeholder="Username" className="border p-2 w-full mb-2"
        onChange={e => setForm({...form, username: e.target.value})} />

      <input placeholder="Email" className="border p-2 w-full mb-2"
        onChange={e => setForm({...form, email: e.target.value})} />

      <input type="password" placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={e => setForm({...form, password: e.target.value})} />

      <button className="bg-green-500 text-white px-4 py-2">
        Register
      </button>
    </form>
  );
}