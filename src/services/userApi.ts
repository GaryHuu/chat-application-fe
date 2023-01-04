import { Friend } from 'domain/friend'
import { Group } from 'domain/group'
import axiosClient from './axiosClient'

const userApi = {
  getFriends(userId: UniqueId): Promise<Friend[]> {
    const url = `/users/${userId}/friends`
    return axiosClient.get(url)
  },
  getGroups(userId: UniqueId): Promise<Group[]> {
    const url = `/users/${userId}/groups`
    return axiosClient.get(url)
  },
}

export default userApi
