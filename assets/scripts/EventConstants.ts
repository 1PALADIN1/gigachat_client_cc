export class EventConstants {
    static readonly CHAT_START: string = "chat-start";
    static readonly CHAT_SET_ACTIVE: string = "chat-set-active";
    static readonly CHAT_SELECTED: string = "chat-selected";

    static readonly USER_FOUND: string = "user-found";
    static readonly USER_ERROR: string = "user-error";

    static readonly WS_ERROR: string = "ws-error";
    static readonly WS_GOT_MESSAGE: string = "ws-got-message";
    static readonly WS_CLOSED: string = "ws-closed";

    static readonly AUTH_SUCCESS: string = "success";
    static readonly AUTH_ERROR: string = "error";
}