import { ApiConstants } from "../../network/ApiConstants";
import { UserSession } from "../../network/auth/UserSession";
import { HttpRequestMaker } from "../../network/HttpRequestMaker";
import { SearchButtonPanel } from "../panels/user/SearchButtonPanel";
import { SearchUserPanel } from "../panels/user/SearchUserPanel";
import { UiConstants } from "../UiConstants";
import { IUiController } from "./IUiController";

interface UserResponse {
    id: string;
    username: string;
}

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
    //models
    private _httpRequestMaker: HttpRequestMaker;
    private _userSession: UserSession;

    private _searchInProgress: boolean;

    constructor(httpRequestMaker: HttpRequestMaker, searchButtonPanel: SearchButtonPanel, searchUserPanel: SearchUserPanel) {
        this._httpRequestMaker = httpRequestMaker;
        this._searchButtonPanel = searchButtonPanel;
        this._searchUserPanel = searchUserPanel;    
        this._searchInProgress = false;
        
        this._setActivePanel(PanelType.NONE);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    activate() {
        this._setActivePanel(PanelType.SEARCH_BUTTON);

        this._searchButtonPanel.searchButton.node.on(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.on(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
        this._searchUserPanel.searchButton.node.on(UiConstants.buttonClickEvent, this._onSearchUserClicked, this);
        this._searchUserPanel.searchText.node.on(UiConstants.editingReturn, this._onSearchUserClicked, this);
    }

    deactivate() {
        this._setActivePanel(PanelType.NONE);

        this._searchButtonPanel.searchButton.node.off(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.off(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
        this._searchUserPanel.searchButton.node.off(UiConstants.buttonClickEvent, this._onSearchUserClicked, this);
        this._searchUserPanel.searchText.node.off(UiConstants.editingReturn, this._onSearchUserClicked, this);
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
            return;
        }
        
        this._searchInProgress = true;
        this._searchUserPanel.searchText.string = "";
        let url = ApiConstants.buildRestAddr(this._userSession.baseServerUrl, ApiConstants.FIND_USER_ROOT) + "/" + searchString;
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, "GET", this._userSession, (error, message) => {
            this._searchInProgress = false;
            if (error) {
                console.log("Error: " + message);
                return;
            }

            let resp: UserResponse[] = JSON.parse(message.toString());
            let usernames: string[] = [];
            for (let i = 0; i < resp.length; i++) {
                usernames.push(resp[i].username);
                console.log(resp[i].username);
            }

            this._searchUserPanel.setResults(usernames);
        });
        req.send();
    }
    // ================== SEARCH BUTTON METHODS ==================

    private _onMoveToSearchPanelClicked() {
        this._setActivePanel(PanelType.SEARCH);
    }

    // ================== SWITCHING PANELS ==================

    private _setActivePanel(panelType: PanelType) {
        switch (panelType) {
            case PanelType.NONE: {
                this._searchButtonPanel.node.active = false;
                this._searchUserPanel.node.active = false;
                break;
            }
            case PanelType.SEARCH_BUTTON: {
                this._searchButtonPanel.node.active = true;
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