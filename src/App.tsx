import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './components/Home/HomePage'

const Layout: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      }
    ]
  }
])

function App () {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
