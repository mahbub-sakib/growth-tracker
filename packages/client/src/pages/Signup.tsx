
import React, { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Sign Up</button>

      </form>
    </div>
  );
};

export default Signup;