import { useAppAuth } from "../../context/AuthContext";

function Home() {
  const { user } = useAppAuth();
  return (
    <div>
      Welcome <span className="font-bold text-2xl">{user?.name}</span> to
      SkillBridge Learning Platform
    </div>
  );
}

export default Home;
