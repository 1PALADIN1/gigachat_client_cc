import { _decorator, Component, Node, Prefab, instantiate, EventTarget } from 'cc';
import { IChatInfo } from '../../../entity/IChatInfo';
import { EventConstants } from '../../../EventConstants';
import { ChatItem } from './ChatItem';
const { ccclass, property } = _decorator;

@ccclass('ChatPanel')
export class ChatPanel extends Component {
    eventTarget: EventTarget = new EventTarget();

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
            instance.setup(chats[i], chats[i].title, "");
            instance.eventTarget.on(EventConstants.CHAT_SELECTED, this._onChatSelected, this);
            this.contentNode.addChild(node);
        }
    }

    private _clearChats() {
        let childNodes = this.contentNode.children;
        for (let i = 0; i < childNodes.length; i++) {
            let chatItem = childNodes[i].getComponent(ChatItem);
            chatItem.eventTarget.off(EventConstants.CHAT_SELECTED, this._onChatSelected, this);
            childNodes[i].destroy();
        }
    }

    private _onChatSelected(chat: IChatInfo) {
        this.eventTarget.emit(EventConstants.CHAT_SELECTED, chat);
    }
}

