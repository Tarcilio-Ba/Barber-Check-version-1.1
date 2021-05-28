export const TOKEN_KEY = "@barber_check-Token"
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token)
}
export const logout = () => {
    /* localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('EMAIL')
    localStorage.removeItem('EMP')
    localStorage.removeItem('USUARIO') */
    localStorage.clear()
}