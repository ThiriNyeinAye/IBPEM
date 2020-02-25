import Anormalies from "../pages/anormalies"
import AnormaliesDevice from "../pages/anormalies-device"
import AnormaliesHistory from "../pages/anormalies-history"
import Solutions from "../pages/solutions"
import Login from "../pages/login"

export const routeName = {
    routeSolutions: "solutions",
    routeAnormaliesDevice: "anormalies-device",
    routeAnormaliesHistory: "anormalies-history",
    routeAnormalies: "anormalies",
    routeLogin: "login"
}

export default {
    routes: {
        [routeName.routeSolutions]: {
            component: Solutions, 
        },
        [routeName.routeAnormaliesHistory]: {
            component: AnormaliesHistory
        },
        [routeName.routeAnormaliesDevice]: {
            component: AnormaliesDevice
        },
        [routeName.routeAnormalies]: {
            component: Anormalies
        },
        [routeName.routeLogin]: {
            component: Login
        }    
    }, 
    default: routeName.routeLogin
}