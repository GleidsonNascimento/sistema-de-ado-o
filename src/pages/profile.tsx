import { useUser } from "./UserContext";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./profile.css";

const UserProfile: React.FC = () => {
  const { user, userData } = useUser();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <div>
      {user ? (
        <div className="profile-box">
          {userData?.profilePic ? (
            <img
              className="profile-pic"
              src={userData.profilePic}
              alt="Perfil"
            />
          ) : (
            <div className="placeholder-pic">Adicionar Foto</div>
          )}
          <div className="profile-info">
            <h3 className="profile-name">
              Olá, {userData?.name || "Usuário"}!
            </h3>
            <Button
              className="btn-logout"
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <p className="not-logged-in">
          <Link to="/cadastro">Faça login</Link>
        </p>
      )}
    </div>
  );
};

export default UserProfile;
