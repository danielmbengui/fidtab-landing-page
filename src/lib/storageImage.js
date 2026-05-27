import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/lib/firebaseConfig'

export async function getStorageDownloadUrl(storagePath) {
  const path = String(storagePath ?? '').trim()
  if (!path) return null
  try {
    return await getDownloadURL(ref(storage, path))
  } catch {
    return null
  }
}

export async function uploadStorageImage(storagePath, file) {
  const path = String(storagePath ?? '').trim()
  if (!path) throw new Error('storage_path_missing')
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' })
  return getDownloadURL(storageRef)
}

export async function deleteStorageImage(storagePath) {
  const path = String(storagePath ?? '').trim()
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch (error) {
    if (error?.code !== 'storage/object-not-found') throw error
  }
}

export function isImageFile(file) {
  return Boolean(file?.type?.startsWith('image/'))
}
