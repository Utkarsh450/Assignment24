import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">

      <h1 className="text-6xl font-bold text-orange-500">404</h1>

      <p className="text-gray-600 mt-4 text-lg">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
      >
        Go Home
      </Link>

    </div>
  );
}