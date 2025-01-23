const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
};

export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};

export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const token = getToken();
        return !!token;
    }
    return false;
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            removeToken();
            removeUser();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}; 