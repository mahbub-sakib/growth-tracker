import { useAuth } from "@/context/AuthContext";



function Home() {
  const { logout } = useAuth();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-neutral-900">Home</h1>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Log Out
      </button>
    </div>


  );
}

export default Home;
