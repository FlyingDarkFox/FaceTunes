export interface Emotion {
  [key: string]: number
}

export interface CaptureImageProps {
  closeModal: () => void
  setAlbums: (albums: Album[]) => void
  setEmotions: (emotions: Emotion) => void
  emotions: Emotion
  setIsLoading: (isLoading: boolean) => void
}

export interface EmotionProps {
  setEmotions?: (emotions: Emotion) => void
  emotions?: Emotion
}

export interface Album {
  album: {
    album_type: string
    artists: {
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      name: string
      type: string
      uri: string
    }[]
    available_markets: string[]
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    images: {
      height: number
      url: string
      width: number
    }[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
  }
}
