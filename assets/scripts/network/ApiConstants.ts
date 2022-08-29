export class ApiConstants {
    static readonly REST_PREFIX = "http://";
    static readonly WS_PREFIX = "ws://";

    //routes
    //auth
    static readonly SIGN_IN_ROUTE = "/api/auth/sign-in";
    static readonly SIGN_UP_ROUTE = "/api/auth/sign-up";
    //user
    static readonly FIND_USER_ROUTE = "/api/user";
    //chat
    static readonly CHAT_ROUTE = "/api/chat";
    //ws
    static readonly WS_ROUTE = "/ws";

    //methods
    static readonly HTTP_POST = "POST";
    static readonly HTTP_GET = "GET";

    static buildRestAddr(baseUrl: string, route: string): string {
        return ApiConstants.REST_PREFIX + baseUrl + route;
    }

    static buildWsAddr(baseUrl: string, route: string): string {
        return ApiConstants.WS_PREFIX + baseUrl + route;
    }

    static buildChatMessagesRoute(baseUrl: string, chatId: number) {
        return ApiConstants.REST_PREFIX + baseUrl + "/api/chat/" + chatId + "/message";
    }
}