import React, { useEffect, useState } from "react"
import  routeTo from "../../helper/routeTo.js"
import localStorage from "../../helper/localStorage.js"
// import { withLStorage } from "../../components/hoc.js"

const Login = props => {
    const [loginForm, setLoginForm] = useState({ email: "phyokoko@gmail.com", password: "phyokoko99" })
    const [errorMessage, setErrorMeesage] = useState("")
    
    useEffect(() => {  
        const key = localStorage.readLogin()
        const isAuthorized = localStorage.checkAuthorized(key)
            
        if(isAuthorized) {
            return routeTo.solutions(props)
        }   
        return () => {  }
    }, [loginForm, setLoginForm])

    const handleLogin = e => {
        e.preventDefault()
        const authorizedKey = localStorage.checkAuthorizedLogin(loginForm)
        if(authorizedKey!==null) {
            localStorage.saveLogin(authorizedKey)
            return window.location.href = "/"
        } else {
            return setErrorMeesage("Email or password does not matched!")
        }
        // 
    }

    return (
        <div className="container-fluid h-100">
            <div className="row justify-content-center  align-items-center h-100">
                <div className="col col-md-10 col-lg-8 col-xl-4 py-4">
                    <div className="h3 text-primary text-center py-3">Evercomm IBPEM</div>
                    <form onSubmit={ handleLogin }>
                        <div className="p-2">
                            <div className="text-danger px-1">{errorMessage}</div>
                        </div>
                        <div className="p-2">
                            <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value })} className="form-control" placeholder="Email address"  />
                        </div>
                        <div className="p-2">
                            <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value })}  className="form-control" placeholder="Password" />
                        </div>
                        <div className="p-2">
                            <input type="submit" className="btn btn-block btn-primary" value="LOGIN"/>
                        </div>
                        <div className="py-4"></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login 
//withLStorage(Login)