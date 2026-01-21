// =====================
// TOKEN HELPERS
// =====================
export const saveToken = (token) => {
    localStorage.setItem("access_token", token.access);
    localStorage.setItem("refresh_token", token.refresh);
};

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

// =====================
// AUTH FETCH (CORE)
// =====================
export const authFetch = async (url, options = {}) => {
    const token = getAccessToken();

    const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};
