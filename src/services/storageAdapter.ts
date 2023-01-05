import { FriendsStorageService, GroupsStorageService, UserStorageService } from 'app/ports'
import { useStore } from 'services/store'

export function useUserStorage(): UserStorageService {
  return useStore()
}

export function useFriendsStorage(): FriendsStorageService {
  return useStore()
}

export function useGroupsStorage(): GroupsStorageService {
  return useStore()
}
