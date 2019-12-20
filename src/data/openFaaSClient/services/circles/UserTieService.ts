// - Import react components
import { UserTie } from 'core/domain/circles';
import { SocialError } from 'core/domain/common';
import { Graph } from 'core/domain/graphs';
import { IUserTieService } from 'core/services/circles';
import { List, Map } from 'immutable';
import { inject, injectable } from 'inversify';

import { OpenFaaSClient } from '../../openFaaSClientTypes';
import { IGraphService } from '../graphs/IGraphService';
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';


/**
 * Firbase user service
 */
@injectable()
export class UserTieService implements IUserTieService {

  @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService
  @inject(OpenFaaSClient.GraphService) private _graphService: IGraphService
  // eslint-disable-next-line 
  constructor(
  ) {

  }

  /**
   * Tie users
   */
  public tieUseres = async (userTieSenderInfo: UserTie, userTieReceiveInfo: UserTie, circleIds: string[]) => {
     
      try {
       
        const leftUser = {
          userId: userTieSenderInfo.userId,
          fullName: userTieSenderInfo.fullName,
          avatar: userTieSenderInfo.avatar
        } 

        const rightUser = {
          userId: userTieReceiveInfo.userId,
          fullName: userTieReceiveInfo.fullName,
          avatar: userTieReceiveInfo.avatar
        } 

        const payload = {
          left: leftUser,
          right: rightUser,
          rel: [userTieReceiveInfo.userId, userTieSenderInfo.userId],
          circleIds: circleIds
        }

        const result = await this._httpService.post("user-rels/follow", payload)
        return result.objectId

      } catch (error) {
        throw new SocialError(error.code, 'firestore/tieUseres :' + error.message)
      }
        
    
    }

  /**
   * Update users tie
   */
  public updateUsersTie = async (userTieSenderInfo: UserTie, userTieReceiveInfo: UserTie, circleIds: string[]) => {
    try {
      const payload = {
        circleIds: circleIds,
        rightId: userTieReceiveInfo.userId
      }
      await this._httpService.put("user-rels/circles", payload)
    } catch (error) {
      throw new SocialError(error.code, 'firestore/updateUsersTie :' + error.message)
    }
    
    }

  /**
   * Remove users' tie
   */
  public removeUsersTie = async (firstUserId: string, secondUserId: string) => {
    try {
      await this._httpService.delete(`user-rels/unfollow/${secondUserId}`)
    } catch (error) {
      throw new SocialError(error.code, 'firestore/removeUsersTie :' + error.message)
    }
    
    }

  /**
   * Get user ties who current user followd
   */
  public getUserTies = async (userId: string) => {


    try {
      const result = await this._httpService.get(`user-rels/following`)
      let parsedData: Map<string, any> = Map({})
      if (!(result && result.length > 0)) {
        return parsedData
      }
      result.forEach((rel: any) => {
        const creationDate = rel["created_date"]
        const circleIdList = rel.circleIds
        const {userId, fullName, avatar} = rel.right
        const rightUserInfo: UserTie = new UserTie(userId, creationDate, fullName, avatar, true, circleIdList)
        parsedData = parsedData.set(rightUserInfo.userId!,
          Map({
            ...rightUserInfo,
            circleIdList: circleIdList ? List(circleIdList) : List([])
          }))
          
      })
      return parsedData
    } catch (error) {
      throw new SocialError(error.code, 'firestore/getUserTies :' + error.message)
    }

  }

  /**
   * Get the users who tied current user
   */
  public getUserTieSender = async (userId: string) => {

    try {
      const result = await this._httpService.get(`user-rels/followers`)
      let parsedData: Map<string, any> = Map({})
      if (!(result && result.length > 0)) {
        return parsedData
      }
      result.forEach((rel: any) => {
        const creationDate = rel["created_date"]
        const circleIdList = rel.circleIds
        const {userId, fullName, avatar} = rel.left
        const leftUserInfo: UserTie = new UserTie(userId, creationDate, fullName, avatar, true, circleIdList)
        parsedData = parsedData.set(leftUserInfo.userId!,
          Map({
            ...leftUserInfo,
            circleIdList: List([])
          }))
      })
      return parsedData
    } catch (error) {
      throw new SocialError(error.code, 'firestore/getUserTieSender :' + error.message)
    }

  }
}