import { parseCookies } from "nookies";

const getAuthHeaders = () => {
  const { token } = parseCookies();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",

  async getCourses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();

    const response = await fetch(
      `${this.baseUrl}/courses${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    return response.json();
  },

  async getUsersForAccess() {
    const response = await fetch(`${this.baseUrl}/users/access`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to fetch course");
    }

    return response.json();
  },

  async getCourseForAccess() {
    const response = await fetch(`${this.baseUrl}/courses/access`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to fetch course");
    }

    return response.json();
  },

  async getCourseById(id: string) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to fetch course");
    }

    return response.json();
  },

  async createCourse(formData: FormData) {
    const response = await fetch(`${this.baseUrl}/courses`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to create course");
    }

    return response.json();
  },

  async createModule(moduleData: { title: string; id_course: string }) {
    const response = await fetch(`${this.baseUrl}/modules`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to create module");
    }

    return response.json();
  },

  async editModule(moduleData: { title: string }, id_module: string) {
    const response = await fetch(`${this.baseUrl}/modules/${id_module}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(moduleData),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to update module");
    }

    return response.json();
  },

  async createClass(classData: {
    title: string;
    url: string;
    description: string;
    content: string;
    id_module: string;
  }) {
    const response = await fetch(`${this.baseUrl}/classes`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to create class");
    }

    return response.json();
  },

  async editClass(
    classData: {
      title: string;
      url: string;
      description: string;
      content: string;
    },
    id_class: string,
  ) {
    const response = await fetch(`${this.baseUrl}/classes/${id_class}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to update class");
    }

    return response.json();
  },

  async editCourse(formData: FormData, id: string) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to update course");
    }

    return response.json();
  },

  async deleteCourse(id: string) {
    const response = await fetch(`${this.baseUrl}/courses/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to delete course");
    }

    return response.json();
  },

  async getConfirmedAccounts() {
    const response = await fetch(`${this.baseUrl}/users/bb/confirmed`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to get accounts");
    }
    return response.json();
  },

  async getNotConfirmedAccounts() {
    const response = await fetch(`${this.baseUrl}/users/bb/not-confirmed`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to get accounts");
    }

    return response.json();
  },

  async editAccount(formData: FormData, id: string) {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to update account");
    }

    return response.json();
  },

  async deleteAccount(id_user: string) {
    const response = await fetch(`${this.baseUrl}/users/${id_user}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to cancel account");
    }

    return response.json();
  },

  async createNote(notes: {
    note: string;
    id_user: string;
    id_course: string;
  }) {
    const response = await fetch(`${this.baseUrl}/notes`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notes),
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to create note");
    }

    return response.json();
  },

  async getNotes(id_user: string, id_course: string) {
    const response = await fetch(
      `${this.baseUrl}/notes/${id_user}/${id_course}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to return notes");
    }

    return response.json();
  },

  async deleteNotes(id_note: number) {
    const response = await fetch(`${this.baseUrl}/notes/${id_note}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to delete note");
    }
    return response.json();
  },

  async getDashboardMetrics() {
    const response = await fetch(`${this.baseUrl}/dashboard/basic`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  async markAsFinished(id_class: string, id_course: string) {
    const response = await fetch(
      `${this.baseUrl}/classes/finish/${id_class}/${id_course}`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      },
    );
    return response.json();
  },
};

export default api;
