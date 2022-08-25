import { SearchButtonPanel } from "../panels/user/SearchButtonPanel";
import { SearchUserPanel } from "../panels/user/SearchUserPanel";
import { UiConstants } from "../UiConstants";
import { IUiController } from "./IUiController";

enum PanelType {
    NONE,
    SEARCH_BUTTON,
    SEARCH
}

export class UserController implements IUiController {
    
    private _searchButtonPanel: SearchButtonPanel;
    private _searchUserPanel: SearchUserPanel;

    constructor(searchButtonPanel: SearchButtonPanel, searchUserPanel: SearchUserPanel) {
        this._searchButtonPanel = searchButtonPanel;
        this._searchUserPanel = searchUserPanel;     
        
        this._setActivePanel(PanelType.NONE);
    }

    // TODO:
    // 1. Show panels
    // 2. Sign up events
    activate() {
        this._setActivePanel(PanelType.SEARCH_BUTTON);

        this._searchButtonPanel.searchButton.node.on(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.on(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
    }

    // TODO:
    // 1. Hide panels
    // 2. Sign off events
    deactivate() {
        this._setActivePanel(PanelType.NONE);

        this._searchButtonPanel.searchButton.node.off(UiConstants.buttonClickEvent, this._onMoveToSearchPanelClicked, this);
        this._searchUserPanel.closeButton.node.off(UiConstants.buttonClickEvent, this._onCloseSearchPanelClicked, this);
    }

    // ================== SEARCH PANEL METHODS ==================

    private _onCloseSearchPanelClicked() {
        this._setActivePanel(PanelType.SEARCH_BUTTON);
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