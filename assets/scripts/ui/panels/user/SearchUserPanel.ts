import { _decorator, Component, Node, Button, EditBox } from 'cc';
import { IUserInfo } from '../../../entity/IUserInfo';
import { SearchResults } from './SearchResults';
const { ccclass, property } = _decorator;

@ccclass('SearchUserPanel')
export class SearchUserPanel extends Component {
    @property({
        type: SearchResults
    })
    searchResults: SearchResults = null;
    @property({
        type: Button
    })
    closeButton: Button = null;
    @property({
        type: Button
    })
    searchButton: Button = null;
    @property({
        type: EditBox
    })
    searchText: EditBox = null;

    onDisable() {
        this.searchText.string = "";
    }

    setResults(users: IUserInfo[]) {
        this.searchResults.setResults(users);
    }
}

