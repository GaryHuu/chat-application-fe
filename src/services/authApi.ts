import { FriendOfUserType, GroupOfUserType } from 'domain/user'
import {
  ParamsFetchFriendsType,
  PayloadLoginType,
  Response0fLoginType,
} from 'types/auth'
import axiosClient from './axiosClient'

const authApi = {
  login(data: PayloadLoginType): Promise<Response0fLoginType> {
    const url = '/users/login'
    return axiosClient.post(url, data)
  },
  getFriends(data: ParamsFetchFriendsType): Promise<Array<FriendOfUserType>> {
    const url = `/users/${data.userId}/friends`
    return axiosClient.get(url)
  },
  getGroups(data: ParamsFetchFriendsType): Promise<Array<GroupOfUserType>> {
    const url = `/users/${data.userId}/groups`
    return axiosClient.get(url)
  },
}

export default authApi
