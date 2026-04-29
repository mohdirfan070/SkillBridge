import { Link } from 'react-router-dom'

function FallbackPage() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
     <span> There's Nothing Here!</span>
      <Link className='underline text-blue-500 ' to={"/"} > Go to Home Page</Link>
    </div>
  )
}

export default FallbackPage
