export function isAuthenticated() {
    try {
        let auth = JSON.parse(localStorage.getItem("auth"))
        return auth.access_token != null;
    } catch (error) {
        return false
    }
}

export function store(data) {
    localStorage.setItem("auth", JSON.stringify(data));
}

export function unset() {
    localStorage.removeItem("auth");
}

export function get(column = null) {
    try {
        let data = JSON.parse(localStorage.getItem("auth"))
        let user = data.user
        if (data.hasOwnProperty(column)) {
            return data[column]
        } else if (user.hasOwnProperty(column)) {
            return user[column]
        }
        return data
    } catch (error) {
        return null
    }
}