import { useState } from 'react'
import CaptureImage from '../CaptureImage/CaptureImage'
import Album from '../Album/Album'
import { Album as AlbumTypes, Emotion } from '../types'

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [albums, setAlbums] = useState<AlbumTypes[]>([])
  const [emotions, setEmotions] = useState<Emotion>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='bg-emerald-50 min-h-screen flex flex-col items-center '>
      <header className='w-full py-6 bg-emerald-100 shadow'>
        <h1 className='text-center text-5xl text-amber-500 font-bold mb-2'>
          FaceTunes: Your Emotional Soundtrack
        </h1>
        <p className='text-center text-lg text-gray-500'>
          Discover melodies that resonate with your emotions. Capture your mood and let the music flow through you.
        </p>
      </header>
      <main className='flex flex-col items-center flex-grow w-full'>
        <section className='my-12 text-center max-w-5xl'>
          <p className='text-lg font-medium text-sky-500 mb-6 leading-relaxed'>
            FaceTunes harnesses cutting-edge emotion recognition technology to
            deeply understand your mood and curate music that beautifully
            aligns with your feelings. Capture your current emotional state,
            and allow us to craft a personalized playlist just for you.
          </p>
          <p className='my-6 text-lg text-rose-400'>
            Start your musical journey
          </p>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6'
            onClick={openModal}
          >
            Capture Your Mood
          </button>
          <p className='text-sm text-gray-600'>
            Note: Your captured images are processed in real-time
            and NOT stored.
          </p>
        </section>
        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/4 max-h-3/4 rounded-lg p-6 overflow-y-auto'>
              <div className='flex justify-end'>
                <button
                  className='text-gray-500 hover:text-gray-700 text-2xl'
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>
              <CaptureImage
                closeModal={closeModal}
                setAlbums={setAlbums}
                setEmotions={setEmotions}
                emotions={emotions}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        )}
        {isLoading && (
          <div className='mt-8'>
            <Album
              albums={albums}
              setAlbums={setAlbums}
              emotions={emotions}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
      <footer className='w-full py-4 bg-emerald-100 text-center text-sm text-gray-600'>
        <div className='flex justify-center space-x-4 mb-2'>
          <a
            href='https://www.linkedin.com/in//'
            target='_blank'
            rel='noopener noreferrer'
            className='a-links text-gray-800 hover:text-blue-800 transition-colors duration-300'
          >
            <span className='a-div'>LinkedIn</span>
          </a>
          <a
            href='mailto:yaduvanshiigaurav086@gmail.com'
            className='a-links text-gray-800 hover:text-blue-800 transition-colors duration-300'
          >
            <span className='a-div'>Email</span>
          </a>
        </div>
        <p className='mt-2'>
          &copy; {new Date().getFullYear()} FaceTunes. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default HomePage
