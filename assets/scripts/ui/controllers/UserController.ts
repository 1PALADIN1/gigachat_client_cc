import { SearchButtonPanel } from "../panels/user/SearchButtonPanel";
import { SearchUserPanel } from "../panels/user/SearchUserPanel";
import { UiConstants } from "../UiConstants";
import { EventConstants } from "../../EventConstants";
import { IChat } from "../../chat/Chat";
import { IUiController } from "./IUiController";
import { IUser } from "../../user/User";
import { IUserInfo } from "../../entity/IUserInfo";
import { LogOutButtonPanel } from "../panels/user/LogOutButtonPanel";
import { IWsManager } from "../../network/ws/WsManager";
import { EventTarget } from "cc";

enum PanelType {
    NONE,
    SEARCH_BUTTON,
    SEARCH
}

const minSearchSymbols: number = 3;

export class UserController implements IUiController {
    //panels
    private _searchButtonPanel: SearchButtonPanel;
    private _searchUserPanel: SearchUserPanel;
    private _logOutButtonPanel: LogOutButtonPanel;
    //models
    private _chat: IChat;
    private _user: IUser;
    private _wsManager: IWsManager;

    private _searchInProgress: boolean;

    eventTarget: EventTarget = new EventTarget();

    constructor(chat: IChat, user: IUser, wsManager: IWsManager, searchButtonPanel: SearchButtonPanel, searchUserPanel: SearchUserPanel, logOutButtonPanel: LogOutButtonPanel) {
        this._chat = chat;
        this._user = user;
        this._wsManager = wsManager;
        this._searchButtonPanel = searchButtonPanel;
        this._searchUserPanel = searchUserPanel;
        this._logOutButtonPanel = logOutButtonPanel;
        this._searchInProgress = false;
        
        this._setActivePanel(PanelType.NONE);
    }

    activate() {
        this._setActivePanel(PanelType.SEARCH_BUTTON);

        this._user.eventTarget.on(EventConstants.USER_FOUND, this._onUserFound, this);
        this._searchButtonPanel.searchButton.node.on(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.on(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
        this._searchUserPanel.searchButton.node.on(UiConstants.buttonClickEvent, this._onSearchUserClicked, this);
        this._searchUserPanel.searchText.node.on(UiConstants.editingReturn, this._onSearchUserClicked, this);
        this._searchUserPanel.searchResults.startChatEvent.on(EventConstants.CHAT_START, this._onStartChat, this);
        this._logOutButtonPanel.logOutButton.node.on(UiConstants.buttonClickEvent, this._onLogOutButtonClicked, this);
    }

    deactivate() {
        this._setActivePanel(PanelType.NONE);

        this._user.eventTarget.off(EventConstants.USER_FOUND, this._onUserFound, this);
        this._searchButtonPanel.searchButton.node.off(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.off(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
        this._searchUserPanel.searchButton.node.off(UiConstants.buttonClickEvent, this._onSearchUserClicked, this);
        this._searchUserPanel.searchText.node.off(UiConstants.editingReturn, this._onSearchUserClicked, this);
        this._searchUserPanel.searchResults.startChatEvent.off(EventConstants.CHAT_START, this._onStartChat, this);
        this._logOutButtonPanel.logOutButton.node.off(UiConstants.buttonClickEvent, this._onLogOutButtonClicked, this);
    }

    // ================== MODEL CALLBACKS ==================

    private _onUserFound(users: IUserInfo[]) {
        this._searchInProgress = false;
        this._searchUserPanel.setResults(users);
    }

    // ================== SEARCH PANEL METHODS ==================

    private _onCloseSearchPanelClicked() {
        this._setActivePanel(PanelType.SEARCH_BUTTON);
    }

    private _onSearchUserClicked() {
        if (this._searchInProgress) {
            return;
        }

        let searchString = this._searchUserPanel.searchText.string.trim();
        if (searchString.length < minSearchSymbols) {
            console.error("Requires min " + minSearchSymbols + " symbols to perform searching!");
            this.eventTarget.emit(EventConstants.USER_ERROR, "Requires min " + minSearchSymbols + " symbols to perform searching!");
            return;
        }
        
        this._searchInProgress = true;
        this._searchUserPanel.searchText.string = "";
        this._user.findUser(searchString);
    }

    private _onStartChat(userId: number, username: string) {
        this._chat.startChatWithUser(userId, username);
        this._setActivePanel(PanelType.SEARCH_BUTTON);
    }

    // ================== SEARCH BUTTON METHODS ==================

    private _onMoveToSearchPanelClicked() {
        this._setActivePanel(PanelType.SEARCH);
        this._searchUserPanel.searchText.focus();
    }

    // ================== LOG OUT BUTTON METHODS ==================

    private _onLogOutButtonClicked() {
        this._wsManager.dispose();
    }

    // ================== SWITCHING PANELS ==================

    private _setActivePanel(panelType: PanelType) {
        switch (panelType) {
            case PanelType.NONE: {
                this._searchButtonPanel.node.active = false;
                this._searchUserPanel.node.active = false;
                this._logOutButtonPanel.node.active = false;
                break;
            }
            case PanelType.SEARCH_BUTTON: {
                this._searchButtonPanel.node.active = true;
                this._logOutButtonPanel.node.active = true;
                this._searchUserPanel.node.active = false;
                break;
            }
            case PanelType.SEARCH: {
                this._searchUserPanel.node.active = true;
                this._searchButtonPanel.node.active = false;
                break;
            }
        }
    }
}