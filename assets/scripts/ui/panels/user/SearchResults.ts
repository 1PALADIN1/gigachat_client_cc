import { _decorator, Component, Node, Prefab, instantiate, EventTarget } from 'cc';
import { IUserInfo } from '../../../entity/IUserInfo';
import { UiConstants } from '../../UiConstants';
import { SearchResultsItem } from './SearchResultsItem';
const { ccclass, property } = _decorator;

@ccclass('SearchResults')
export class SearchResults extends Component {
    startChatEvent: EventTarget = new EventTarget();

    @property({
        type: Prefab
    })
    searchResultItemPrefab: Prefab = null;
    @property({
        type: Node
    })
    resultsRoot: Node = null;

    onDisable() {
        this._clearResults();
    }

    setResults(users: IUserInfo[]) {
        this._clearResults();
        
        for (let i = 0; i < users.length; i++) {
            let node = instantiate(this.searchResultItemPrefab);
            this.resultsRoot.addChild(node);
            let searchItem = node.getComponent(SearchResultsItem);
            searchItem.setup(users[i].id, users[i].username);
            searchItem.startChatEvent.on(UiConstants.startChatEvent, this._onChatButtonClicked, this);
        }
    }

    private _clearResults() {
        let childs = this.resultsRoot.children;
        if (this.resultsRoot == null || childs == null) {
            return;
        }

        for (let i = 0; i < childs.length; i++) {
            let searchItem = childs[i].getComponent(SearchResultsItem);
            searchItem.startChatEvent.off(UiConstants.startChatEvent, this._onChatButtonClicked, this);
            childs[i].destroy();
        }
    }

    private _onChatButtonClicked(userId: number, username: string) {
        this.startChatEvent.emit(UiConstants.startChatEvent, userId, username);
    }
}

