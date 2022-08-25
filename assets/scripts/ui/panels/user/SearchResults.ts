import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { SearchResultsItem } from './SearchResultsItem';
const { ccclass, property } = _decorator;

@ccclass('SearchResults')
export class SearchResults extends Component {
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

    //TODO: set userIds
    setResults(users: string[]) {
        this._clearResults();
        
        for (let i = 0; i < users.length; i++) {
            let node = instantiate(this.searchResultItemPrefab);
            this.resultsRoot.addChild(node);
            node.getComponent(SearchResultsItem).setup(i, users[i]);
        }
    }

    private _clearResults() {
        let childs = this.resultsRoot.children;
        if (this.resultsRoot == null || childs == null) {
            return;
        }

        for (let i = 0; i < childs.length; i++) {
            childs[i].destroy();
        }
    }
}

