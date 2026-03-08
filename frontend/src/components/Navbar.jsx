import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ roomId }) => {
  return (
    <nav className="w-full flex font-[satoshi] justify-between items-center px-10 py-5 bg-white shadow-sm">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-orange-500">
        WatchParty
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4">

        <Link to={`/lobby/${roomId}`} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
          Create Room
        </Link>

      </div>

    </nav>
  );
};

export default Navbar;