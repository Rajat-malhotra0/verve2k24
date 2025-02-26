const  API_URL = "/api";

export const login = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const getCurrentUser = async (token) => {
    const response = await fetch(`${API_URL}/auth/user`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message);
    }
    return data;
};