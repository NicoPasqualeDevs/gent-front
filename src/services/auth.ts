import { AuthUser } from "@/types/Auth";

export const authStorage = () => {
  const saveAuth = (userData: AuthUser) => {
    localStorage.setItem("auth_email", userData.email);
    localStorage.setItem("auth_token", userData.token);
    localStorage.setItem("auth_uuid", userData.uuid);
  };

  const getAuth = () => {
    const email = localStorage.getItem("auth_email");
    const token = localStorage.getItem("auth_token");
    const uuid = localStorage.getItem("auth_uuid");

    if (!email || !token || !uuid) return null;

    return {
      email,
      token,
      uuid,
      first_name: "",  // Estos valores se pueden obtener del backend cuando sea necesario
      last_name: "",
      is_superuser: false
    };
  };

  const removeAuth = () => {
    localStorage.removeItem("auth_email");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_uuid");
  };

  return { saveAuth, getAuth, removeAuth };
}; 