import { BaseDomain } from 'core/domain/common/baseDomain';

export class Comment extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    /**
     * Post identifier that comment belong to
     */
    public postId?: string;

    /**
     * Comment text
     */
    public text?: string | null;

    /**
     * Comment score
     */
    public score?: number | null;

    /**
     * Comment creation date
     */
    public creationDate?: number;

    /**
     * Comment owner full name
     */
    public ownerDisplayName?: string;

    /**
     * Comment owner avater address
     */
    public ownerAvatar?: string;

    /**
     * Comment owner identifier
     */
    public ownerUserId?: string;
}
