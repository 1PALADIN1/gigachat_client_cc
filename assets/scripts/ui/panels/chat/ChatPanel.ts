import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { IChatInfo } from '../../../entity/IChatInfo';
import { ChatItem } from './ChatItem';
const { ccclass, property } = _decorator;

@ccclass('ChatPanel')
export class ChatPanel extends Component {
    @property({
        type: Prefab
    })
    chatItemPrefab: Prefab = null;
    @property({
        type: Node
    })
    contentNode: Node = null;

    onDisable() {
        this._clearChats();
    }

    refreshChats(chats: IChatInfo[]) {
        this._clearChats();

        for (let i = 0; i < chats.length; i++) {
            let node = instantiate(this.chatItemPrefab);
            let instance = node.getComponent(ChatItem);
            instance.setup(chats[i].id, chats[i].title, "");
            this.contentNode.addChild(node);
        }
    }

    private _clearChats() {
        let childNodes = this.contentNode.children;
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].destroy();
        }
    }
}

