export const loginUser = (email) => {
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    sessionStorage.setItem('loginTimestamp', Date.now().toString());
    localStorage.setItem('userEmail', email);
};

export const logoutUser = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    sessionStorage.removeItem('loginTimestamp');
    localStorage.removeItem('userEmail');
};

export const isUserAuthenticated = () => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    const loginTimestamp = sessionStorage.getItem('loginTimestamp');
    if (isAuthenticated && loginTimestamp) {
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (now - parseInt(loginTimestamp) > twentyFourHours) {
            logoutUser();
            return false;
        }
        return true;
    }
    return false;
};
