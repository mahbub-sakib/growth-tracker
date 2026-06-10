
import React, { useState } from 'react';

const ROLES = [
  { value: "LEARNER", label: "Learner" },
  { value: "MANAGER", label: "Manager" },
] as const;

type Role = typeof ROLES[number]["value"];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Operations",
  "HR",
  "Other",
] as const;

type Department = typeof DEPARTMENTS[number];

const EXPERIENCE_LEVELS = [
  { value: "JUNIOR", label: "Junior", description: "0–2 years of experience" },
  { value: "MID", label: "Mid", description: "2–5 years of experience" },
  { value: "SENIOR", label: "Senior", description: "5+ years of experience" },
] as const;

type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]["value"];


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<Role>(ROLES[0].value);
  const [teamName, setTeamName] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");
  const [bio, setBio] = useState("");

  const BIO_MAX = 250;

  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: wire up submission
    console.log({
      email,
      password,
      role,
      ...(bio ? { bio } : {}),
    });
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

        {/* Department */}
        <div className="flex flex-col gap-1">
          <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
          <select
            id="department"
            data-testid="department-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value as Department)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
          >
            <option value="" disabled>Please select a department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-gray-700 mb-1">Experience Level</legend>
          {EXPERIENCE_LEVELS.map((level) => (
            <label
              key={level.value}
              className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors
                ${experienceLevel === level.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="experienceLevel"
                data-testid={`experience-${level.value.toLowerCase()}`}
                value={level.value}
                checked={experienceLevel === level.value}
                onChange={() => setExperienceLevel(level.value)}
                className="mt-0.5 accent-indigo-600"
                aria-describedby={`exp-desc-${level.value}`}
              />
              <div>
                <span className="text-sm font-medium text-gray-800">{level.label}</span>
                <p id={`exp-desc-${level.value}`} className="text-xs text-gray-500 mt-0.5">{level.description}</p>
              </div>
            </label>
          ))}
        </fieldset>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="bio"
            data-testid="bio-input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={BIO_MAX}
            rows={4}
            placeholder="Tell us a little about yourself..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
          />
          <span
            data-testid="bio-char-count"
            className={`text-xs text-right ${bio.length >= BIO_MAX * 0.9 ? "text-amber-500" : "text-gray-400"}`}
          >
            {bio.length} / {BIO_MAX}
          </span>
        </div>

        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">Sign Up</button>

      </form>
    </div>
  );
};

export default Signup;