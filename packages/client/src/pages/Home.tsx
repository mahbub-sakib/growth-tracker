import { useAuth } from "@/context/AuthContext";



function Home() {
  const { logout } = useAuth();

  return (
    <div>
      <h1 className="font-semibold text-2xl text-neutral-900">Home</h1>
    </div>


  );
}

export default Home;
