
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

const ROLES = [
  { value: "LEARNER", label: "Learner" },
  { value: "MANAGER", label: "Manager" },
] as const;

type Role = (typeof ROLES)[number]["value"];

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Operations",
  "HR",
  "Other",
] as const;

type Department = (typeof DEPARTMENTS)[number];

const EXPERIENCE_LEVELS = [
  { value: "JUNIOR", label: "Junior", description: "0–2 years of experience" },
  { value: "MID", label: "Mid", description: "2–5 years of experience" },
  { value: "SENIOR", label: "Senior", description: "5+ years of experience" },
] as const;

type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];

interface Address {
  label: string;
  street1: string;
  street2: string;
  city: string;
  zipCode: string;
}

interface SignupFormValues {
  email: string;
  password: string;
  role: Role;
  teamName: string;
  department: Department | "";
  experienceLevel: ExperienceLevel | "";
  bio: string;
  addresses: Address[];
  bdYear: string;
  bdMonth: string;
  bdDay: string;
}

const BIO_MAX = 250;

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1940;
const MAX_YEAR = CURRENT_YEAR - 10;

const YEARS = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MAX_YEAR - i // newest first
);

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

// Returns the number of days in a given month, automatically accounting
// for leap years. Passing day 0 of "next month" rolls back to the last
// day of the target month — a neat trick built into the Date object.
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getDayOptions(year: string, month: string): string[] {
  const daysCount =
    year !== "" && month !== ""
      ? getDaysInMonth(Number(year), Number(month))
      : 31; // fallback while year/month aren't picked yet

  return Array.from({ length: daysCount }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
}

const Signup = () => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      password: "",
      role: "LEARNER",
      teamName: "",
      department: "",
      experienceLevel: "",
      bio: "",
      addresses: [],
      bdYear: "",
      bdMonth: "",
      bdDay: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Watch values needed for derived UI
  const role = watch("role");
  const password = watch("password");
  const bio = watch("bio") ?? "";

  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const bdYear = watch("bdYear");
  const bdMonth = watch("bdMonth");
  const bdDay = watch("bdDay");

  const dayOptions = getDayOptions(bdYear, bdMonth);

  // Drop the day if it becomes invalid after year/month change
  useEffect(() => {
    if (bdDay !== "" && !dayOptions.includes(bdDay)) {
      setValue("bdDay", "");
    }
  }, [bdYear, bdMonth]);

  const isBirthdateComplete = bdYear !== "" && bdMonth !== "" && bdDay !== "";
  const birthdate = isBirthdateComplete ? `${bdYear}-${bdMonth}-${bdDay}` : "";

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMessage("");
    setIsSubmitting(true);

    const { bdYear, bdMonth, bdDay, bio: bioValue, teamName, ...rest } = data;
    const birthdate = `${bdYear}-${bdMonth}-${bdDay}`;
    const payload = {
      ...rest,
      birthdate,
      ...(bioValue ? { bio: bioValue } : {}),
      ...(teamName ? { teamName } : {}),
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // accept the refresh token cookie set by the server
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setErrorMessage(responseData.message ?? "Something went wrong. Please try again.");
        return;
      }

      localStorage.setItem("accessToken", responseData.accessToken);
      navigate("/");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              data-testid="email-input"
              autoComplete="email"
              placeholder="your@email.com"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                validate: async (value) => {
                  try {
                    const res = await fetch(
                      `http://localhost:8000/api/auth/check-email?email=${encodeURIComponent(value)}`
                    );
                    const data = await res.json();
                    if (!data.available) return "This email is already in use.";
                  } catch {
                    // silently ignore network errors on blur — submit will catch it anyway
                  }
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              data-testid="password-input"
              autoComplete="new-password"
              placeholder="Create a password"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              {...register("password", {
                required: "Password is required",
                validate: {
                  length: (v) => v.length >= 8 || "At least 8 characters",
                  upper: (v) => /[A-Z]/.test(v) || "At least one capital letter",
                  special: (v) =>
                    /[^A-Za-z0-9]/.test(v) || "At least one special character",
                },
              })}
            />
            {/* Password rules — shown once the field has been touched */}
            {touchedFields.password && (
              <ul className="mt-2 flex flex-col gap-1">
                {[
                  { key: "length", label: "At least 8 characters", met: passwordRules.length },
                  { key: "upper", label: "At least one capital letter", met: passwordRules.upper },
                  { key: "special", label: "At least one special character", met: passwordRules.special },
                ].map(({ key, label, met }) => (
                  <li
                    key={key}
                    data-testid={`password-rule-${key}`}
                    data-met={String(met)}
                    className={`flex items-center gap-2 text-sm ${met ? "text-green-600" : "text-gray-400"}`}
                  >
                    <span>{met ? "✓" : "○"}</span>
                    {label}
                  </li>
                ))}
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
                  ${role === r.value ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    data-testid={`role-${r.value.toLowerCase()}`}
                    value={r.value}
                    className="sr-only"
                    {...register("role")}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          {/* Team Name — only shown for MANAGER */}
          {role === "MANAGER" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="team-name" className="text-sm font-medium text-gray-700">
                Team Name
              </label>
              <input
                id="team-name"
                type="text"
                data-testid="team-name-input"
                placeholder="e.g. Platform Team"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                {...register("teamName")}
              />
            </div>
          )}

          {/* Department */}
          <div className="flex flex-col gap-1">
            <label htmlFor="department" className="text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              data-testid="department-select"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
              {...register("department", { required: "Please select a department" })}
            >
              <option value="" disabled>
                Please select a department
              </option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-red-500">{errors.department.message}</p>
            )}
          </div>

          {/* Experience Level */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </legend>
            {EXPERIENCE_LEVELS.map((level) => {
              const currentLevel = watch("experienceLevel");
              return (
                <label
                  key={level.value}
                  className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors
                  ${currentLevel === level.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    data-testid={`experience-${level.value.toLowerCase()}`}
                    value={level.value}
                    className="mt-0.5 accent-indigo-600"
                    aria-describedby={`exp-desc-${level.value}`}
                    {...register("experienceLevel", {
                      required: "Please select an experience level",
                    })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{level.label}</span>
                    <p id={`exp-desc-${level.value}`} className="text-xs text-gray-500 mt-0.5">
                      {level.description}
                    </p>
                  </div>
                </label>
              );
            })}
            {errors.experienceLevel && (
              <p className="text-xs text-red-500">{errors.experienceLevel.message}</p>
            )}
          </fieldset>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="bio"
              data-testid="bio-input"
              maxLength={BIO_MAX}
              rows={4}
              placeholder="Tell us a little about yourself..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
              {...register("bio", { maxLength: BIO_MAX })}
            />
            <span
              data-testid="bio-char-count"
              className={`text-xs text-right ${bio.length >= BIO_MAX * 0.9 ? "text-amber-500" : "text-gray-400"}`}
            >
              {bio.length} / {BIO_MAX}
            </span>
          </div>

          {/* Birthdate */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Birthdate</span>
            <div className="flex gap-3">

              <select
                data-testid="birthdate-year"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white flex-1"
                {...register("bdYear", { required: true })}
              >
                <option value="" disabled>Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select
                data-testid="birthdate-month"
                disabled={bdYear === ""}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white flex-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                {...register("bdMonth", { required: true })}
              >
                <option value="" disabled>Month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                data-testid="birthdate-day"
                disabled={bdMonth === ""}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white flex-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                {...register("bdDay", { required: true })}
              >
                <option value="" disabled>Day</option>
                {dayOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

            </div>

            {/* Show error only if any part failed validation after submit attempt */}
            {(errors.bdYear || errors.bdMonth || errors.bdDay) && (
              <span className="text-xs text-red-500">Please select a full date.</span>
            )}
          </div>

          {/* Addresses */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Addresses <span className="text-gray-400 font-normal">(optional)</span>
              </span>
              <button
                type="button"
                data-testid="add-address-btn"
                onClick={() =>
                  append({ label: "", street1: "", street2: "", city: "", zipCode: "" })
                }
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                + Add an address
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                data-testid="address-group"
                className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    Address {index + 1}
                  </span>
                  <button
                    type="button"
                    data-testid="remove-address-btn"
                    onClick={() => remove(index)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Label</label>
                  <input
                    type="text"
                    data-testid="address-label-input"
                    placeholder="e.g. Home, Work"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    {...register(`addresses.${index}.label`)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Street Address</label>
                  <input
                    type="text"
                    data-testid="address-street1-input"
                    placeholder="123 Main St"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    {...register(`addresses.${index}.street1`)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">
                    Street Line 2 <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Apt, suite, floor..."
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    {...register(`addresses.${index}.street2`)}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-medium text-gray-600">City</label>
                    <input
                      type="text"
                      data-testid="address-city-input"
                      placeholder="City"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      {...register(`addresses.${index}.city`)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-28">
                    <label className="text-xs font-medium text-gray-600">ZIP Code</label>
                    <input
                      type="number"
                      data-testid="address-zip-input"
                      placeholder="12345"
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      {...register(`addresses.${index}.zipCode`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg text-sm transition-colors"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;