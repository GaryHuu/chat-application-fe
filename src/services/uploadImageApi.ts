import axios from 'axios'
import { CLOUD_NAME_CLOUDINARY, UPLOAD_PRESET_CLOUDINARY } from 'utils/constants'

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME_CLOUDINARY}/image/upload`

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET_CLOUDINARY)
  const { data } = await axios.post<{ url: string }>(CLOUDINARY_URL, formData)
  return data?.url
}
