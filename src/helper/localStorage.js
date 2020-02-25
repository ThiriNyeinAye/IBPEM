import { writeStorage } from '@rehooks/local-storage';
import md5 from 'md5';
import {reactLocalStorage} from 'reactjs-localstorage';

const LoginDataKey = "LIG1"

const ky = "df22a5084e021c8b6eadd52ad009c398"

const readLogin = () => {
    return reactLocalStorage.get(LoginDataKey, '');
}

const saveLogin = (loginForm) => {
    return writeStorage(LoginDataKey, loginForm)
}

const checkAuthorizedLogin = (loginForm) => {
    const lgnForm = `${loginForm.email}-${loginForm.password}`
    const rky = md5(lgnForm)
    return (ky===rky) ? md5(rky) : null
}

const checkAuthorized = rky => {
    return md5(ky)===rky
}

export default {
    LoginDataKey,
    readLogin,
    saveLogin,
    checkAuthorized,
    checkAuthorizedLogin
}