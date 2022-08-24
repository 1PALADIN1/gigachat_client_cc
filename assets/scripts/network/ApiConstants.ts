export class ApiConstants {
    static readonly REST_PREFIX = "http://";
    static readonly WS_PREFIX = "ws://";

    //routes
    //auth
    static readonly SIGN_IN_ROUTE = "/api/auth/sign-in";
    static readonly SIGN_UP_ROUTE = "/api/auth/sign-up";

    static buildRestAddr(baseUrl: string, route: string) {
        return ApiConstants.REST_PREFIX + baseUrl + route;
    }

    static buildWsAddr(baseUrl: string, route: string) {
        return ApiConstants.WS_PREFIX + baseUrl + route;
    }
}