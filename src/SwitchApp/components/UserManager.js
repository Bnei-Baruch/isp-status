import Keycloak from 'keycloak-js';
import mqtt from "../libs/mqtt";

const userManagerConfig = {
    url: 'https://accounts.kab.info/auth',
    realm: 'main',
    clientId: 'galaxy'
};

const initOptions = {
    onLoad: "check-sso",
    checkLoginIframe: false,
    flow: "standard",
    pkceMethod: "S256",
    enableLogging: true
};

export const kc = new Keycloak(userManagerConfig);

kc.onTokenExpired = () => {
    renewToken(0);
};

kc.onAuthLogout = () => {
    kc.logout();
};

const renewToken = (retry) => {
    retry++;
    kc.updateToken(5)
        .then(refreshed => {
            if (refreshed) {
                //api.setAccessToken(kc.token);
            }
        })
        .catch(() => {
            if (retry > 10) {
                kc.clearToken();
            } else {
                setTimeout(() => {
                    renewToken(retry);
                }, 10000);
            }
        });
};

const renewRetry = (retry) => {
    if (retry > 50) {
        kc.clearToken();
    } else {
        setTimeout(() => {
            renewToken(retry);
        }, 10000);
    }
};

const setData = () => {
    const {realm_access: {roles}, sub, given_name, name, email} = kc.tokenParsed;
    const user = {display: name, email, roles, id: sub, username: given_name};
    mqtt.setToken(kc.token);
    return user;
}

export const getUser = (callback) => {
    kc.init(initOptions)
        .then((authenticated) => {
            if (authenticated) {
                const user = setData();
                callback(user);
            } else {
                callback(null);
            }
        })
        .catch((err) => callback(null));
};

export default kc;
