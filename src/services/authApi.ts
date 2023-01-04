import { PayloadLoginType } from 'app/ports'
import { User } from 'domain/user'
import axiosClient from './axiosClient'

const authAdapter = {
  login(data: PayloadLoginType): Promise<User> {
    const url = '/users/login'
    return axiosClient.post(url, data)
  }
}

export default authAdapter
