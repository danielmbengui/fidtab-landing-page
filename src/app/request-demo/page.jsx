import { redirect } from 'next/navigation'
import { DOWNLOAD_APP_PATH } from '@/context/constants/constants_app'

export default function RequestDemoRedirect() {
  redirect(DOWNLOAD_APP_PATH)
}
