import { _decorator, Component, Node, Prefab, Label, instantiate, ScrollView } from 'cc';
import { IMessageInfo } from '../../../entity/IMessageInfo';
import { MessageItem } from './MessageItem';
const { ccclass, property } = _decorator;

@ccclass('ChatMessagePanel')
export class ChatMessagePanel extends Component {
    @property({
        type: Label
    })
    chatNameLabel: Label = null;
    @property({
        type: ScrollView
    })
    scrollView: ScrollView = null;
    @property({
        type: Node
    })
    contentNode: Node = null;
    @property({
        type: Prefab
    })
    userMessageItemPrefab: Prefab = null;
    @property({
        type: Prefab
    })
    friendMessageItemPrefab: Prefab = null;

    onDisable() {
        this._clearMessages();
    }

    setChatName(chatName: string) {
        this.chatNameLabel.string = chatName;
    }

    refreshMessages(messages: IMessageInfo[]) {
        this._clearMessages();

        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];
            let prefab = message.isUser ? this.userMessageItemPrefab : this.friendMessageItemPrefab;
            let node = instantiate(prefab);
            let messageItem = node.getComponent(MessageItem);
            messageItem.setup(message.username, message.message, message.sendTime);
            this.contentNode.addChild(node);
        }

        this.scrollView.scrollToBottom();
    }

    private _clearMessages() {
        let childNodes = this.contentNode.children;
        for (let i = 0; i < childNodes.length; i++) {
            childNodes[i].destroy();
        }
    }
}

