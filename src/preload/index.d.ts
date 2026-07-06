import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    versions: {
      minimize(): Promise<string>
      maximize(): Promise<string>
      close(): Promise<string>
    }
  }
}
