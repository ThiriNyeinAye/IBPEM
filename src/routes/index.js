import Anormalies from "../pages/anormalies"
import AnormaliesDevice from "../pages/anormalies-device"
import AnormaliesHistory from "../pages/anormalies-history"
import Solutions from "../pages/solutions"

export const routeName = {
    routeSolutions: "solutions",
    routeAnormaliesDevice: "anormalies-device",
    routeAnormaliesHistory: "anormalies-history",
    routeAnormalies: "anormalies",
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
    }, 
    default: "solutions"
}