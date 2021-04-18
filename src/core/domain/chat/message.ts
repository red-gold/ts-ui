import { BaseDomain } from 'core/domain/common/baseDomain';
import { MessageType } from 'core/domain/chat/MessageType';

export class Message extends BaseDomain {
    constructor(public objectId: string, public roomId: string, public text: string, public type: MessageType.Text) {
        super();
    }
}
