import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { socket } from "../socket";
import { toast } from "react-toastify";
import YouTubePlayer from "../components/YouTubePlayer";
import getVideoId from "../utils/getVideoId";

export default function Room() {

  const { roomId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  const handleChangeVideo = () => {

    const id = getVideoId(videoUrl);

    if (!id) {
      toast.error("Invalid YouTube link");
      return;
    }

    setVideoId(id);
    setVideoUrl("");

  };

  useEffect(() => {

    socket.emit("get_participant", { roomId });

    const handleParticipants = (data) => {
      setParticipants(data);
    };

    const handleUserJoined = (username) => {
      toast.success(`${username} joined the room`);
    };

    socket.on("participants_list", handleParticipants);
    socket.on("user_joined", handleUserJoined);

    return () => {
      socket.off("participants_list", handleParticipants);
      socket.off("user_joined", handleUserJoined);
    };

  }, [roomId]);

  return (

    <div className="min-h-screen font-[satoshi] bg-orange-50 p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <Link to="/" className="font-semibold text-lg">
          WatchParty
        </Link>

        <span className="text-gray-600">
          Room ID: {roomId}
        </span>

      </div>

      {/* Layout */}

      <div className="grid grid-cols-3 gap-6">

        {/* Video Section */}

        <div className="col-span-2 bg-white p-4 rounded-xl shadow">

          {/* Player */}

          <div className="w-full h-150 rounded-lg overflow-hidden">

            {videoId ? (
              <YouTubePlayer className="w-full h-full object-cover" videoId={videoId} />
            ) : (
              <div className="h-full flex items-center justify-center text-white">
                No video selected
              </div>
            )}

          </div>

          {/* Video Input */}

          <div className="flex mt-4 gap-3">

           <input
  type="text"
  placeholder="Paste YouTube link"
  value={videoUrl}
  onChange={(e) => setVideoUrl(e.target.value)}
  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
/>

           <button
  onClick={handleChangeVideo}
  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
>
  Change
</button>

          </div>

          {/* Controls (future socket sync) */}

        </div>

        {/* Participants */}

        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="text-lg font-medium mb-3">
            Participants ({participants.length})
          </h2>

          <ul className="flex flex-col gap-3">

            {participants.map((p, index) => (

              <li
                key={index}
                className={`flex items-center justify-between px-3 py-2 rounded-lg 
                ${p.role === "host" ? "bg-orange-100" : "bg-gray-100"}`}
              >

                <div className="flex items-center gap-2">

                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-sm font-semibold">
                    {p.username[0].toUpperCase()}
                  </div>

                  <span className="font-medium">
                    {p.username}
                  </span>

                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full 
                  ${p.role === "host"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-700"}`}
                >
                  {p.role === "host" ? "Host 👑" : "Participant"}
                </span>

              </li>

            ))}

          </ul>

        </div>

      </div>

    </div>

  );

}