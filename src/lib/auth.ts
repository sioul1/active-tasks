import { parseCookies } from "nookies";

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  file: File;
  userType?:
    | "ADMIN"
    | "REALTOR"
    | "CLIENT"
    | "COLLABORATOR"
    | "COMPANY"
    | "PARTNER";
}

const authService = {
  async register(data: RegisterData) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("file", data.file);
      if (data.userType) {
        formData.append("userType", data.userType);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar conta");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async login(data: LoginData) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Credenciais inválidas");
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  getAuthHeader() {
    const { token } = parseCookies();
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

export default authService;
