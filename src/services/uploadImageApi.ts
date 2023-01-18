import axios from 'axios'
import { CLOUDINARY_URL, UPLOAD_PRESET_CLOUDINARY } from 'utils/constants'

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET_CLOUDINARY)
  const { data } = await axios.post<{ url: string }>(CLOUDINARY_URL, formData)
  return data?.url
}
