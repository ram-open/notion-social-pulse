import { AuthForm } from "@/components/AuthForm";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate("/portfolios");
  };

  return <AuthForm onAuth={handleAuth} />;
};

export default Auth;