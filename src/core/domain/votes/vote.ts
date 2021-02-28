import { BaseDomain } from 'core/domain/common/baseDomain';

export class Vote extends BaseDomain {
    /**
     * Vote identifirer
     */
    public id?: string;

    /**
     * Post identifire which vote on
     */
    public postId: string;

    /**
     * Vote date
     */
    public creationDate: number;

    /**
     * Voter full name
     */
    public ownerDisplayName: string;

    /**
     * Avatar of voter
     */
    public ownerAvatar: string;

    /**
     * Voter identifier
     */
    public ownerUserId: string;

    /**
     * The identifier of the user who receive the vote
     */
    public receiverId: string;
}
