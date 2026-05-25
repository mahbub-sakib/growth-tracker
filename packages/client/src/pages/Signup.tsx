
import React, { useState } from 'react';

const ROLES = [
  { value: "LEARNER", label: "Learner" },
  { value: "MANAGER", label: "Manager" },
] as const;

type Role = typeof ROLES[number]["value"];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<Role>(ROLES[0].value);
  const [teamName, setTeamName] = useState("");

  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: wire up submission
    console.log({ email, password });
  }
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            placeholder="Create a password"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {submitted && (
            <ul className="mt-2 flex flex-col gap-1">
              <li
                data-testid="password-rule-length"
                data-met={String(passwordRules.length)}
                className={`flex items-center gap-2 text-sm ${passwordRules.length ? "text-green-600" : "text-gray-400"}`}
              >
                <span>{passwordRules.length ? "✓" : "○"}</span>
                At least 8 characters
              </li>
              <li
                data-testid="password-rule-upper"
                data-met={String(passwordRules.upper)}
                className={`flex items-center gap-2 text-sm ${passwordRules.upper ? "text-green-600" : "text-gray-400"}`}
              >
                <span>{passwordRules.upper ? "✓" : "○"}</span>
                At least one capital letter
              </li>
              <li
                data-testid="password-rule-special"
                data-met={String(passwordRules.special)}
                className={`flex items-center gap-2 text-sm ${passwordRules.special ? "text-green-600" : "text-gray-400"}`}
              >
                <span>{passwordRules.special ? "✓" : "○"}</span>
                At least one special character
              </li>
            </ul>
          )}
        </div>

        {/* Role Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Role</span>
          <div className="flex flex-col rounded-lg border border-gray-300 overflow-hidden">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors border-b border-gray-300 last:border-b-0
                  ${role === r.value
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="role"
                  data-testid={`role-${r.value.toLowerCase()}`}
                  value={r.value}
                  checked={role === r.value}
                  onChange={() => {
                    setRole(r.value);
                    if (r.value !== "MANAGER") setTeamName("");
                  }}
                  className="sr-only"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        {/* Team Name — only rendered when MANAGER is selected */}
        {role === "MANAGER" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="team-name" className="text-sm font-medium text-gray-700">Team Name</label>
            <input
              id="team-name"
              type="text"
              data-testid="team-name-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Platform Team"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        )}

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Sign Up</button>

      </form>
    </div>
  );
};

export default Signup;