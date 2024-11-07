// import { useEffect, useState } from 'react'
import { Album as AlbumTypes, Emotion } from '../types'
import { BeatLoader } from 'react-spinners'
const Album: React.FC<{
  albums: AlbumTypes[]
  setAlbums: (albums: AlbumTypes[]) => void
  emotions: Emotion
  isLoading: boolean
}> = ({ albums, setAlbums, emotions, isLoading }) => {
  const emotionArray = emotions ? Object.entries(emotions) : []
  if (emotionArray.length) emotionArray.sort((a, b) => b[1] - a[1])

  const hanleClick = async () => {
    const res = await fetch(`api/albums/${emotionArray[0][0]}`)
    if (res.ok) {
      const data = await res.json()
      setAlbums(data)
    }
  }

  return (
    <div className='flex flex-col items-center p-4 bg-yellow-50 rounded-lg shadow-md'>
      {emotionArray.length > 0 && (
        <p className='text-center text-lg text-teal-700 mb-4'>
          It looks like you are feeling
          <span className='font-bold text-xl'>
            {' '}
            {emotionArray[0][1].toFixed()}% {emotionArray[0][0]}
          </span>{' '}
          and
          <span className='font-bold text-xl'>
            {' '}
            {emotionArray[1][1].toFixed()}% {emotionArray[1][0]}
          </span>
        </p>
      )}
      {albums.length > 0 ? (
        <div>
          <div className='text-center'>
            <button
              onClick={hanleClick}
              className='bg-red-700 hover:bg-red-900 text-white mb-3 font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105'
            >
              Re-Generate
            </button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {albums.map(album => (
              <iframe
                key={album.album.id}
                src={`https://open.spotify.com/embed/album/${album.album.id}`}
                width='100%'
                height='380'
                allow='encrypted-media'
                className='rounded-md shadow-lg'
              ></iframe>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <div className='flex justify-center items-center'>
          <BeatLoader color='#36d7b7' />
        </div>
      ) : null}
    </div>
  )
}
export default Album
