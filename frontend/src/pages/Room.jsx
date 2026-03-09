import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { socket } from "../socket";
import { toast } from "react-toastify";
import YouTubePlayer from "../components/YouTubePlayer";
import getVideoId from "../utils/getVideoId";

export default function Room() {

  const { roomId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [myRole, setMyRole] = useState("participant");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  const playerRef = useRef(null);

  /* ------------------ PLAYER READY ------------------ */

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  /* ------------------ VIDEO CHANGE ------------------ */

  const handleChangeVideo = () => {

    const id = getVideoId(videoUrl);

    if (!id) {
      toast.error("Invalid YouTube link");
      return;
    }

    socket.emit("change_video", { roomId, videoId: id });

    setVideoUrl("");

  };

  /* ------------------ PLAY ------------------ */

  const handlePlay = () => {

    const player = playerRef.current;

    if (!player) return;

    const time = player.getCurrentTime();

    player.playVideo();

    socket.emit("play", { roomId, time });

  };

  /* ------------------ PAUSE ------------------ */

  const handlePause = () => {

    const player = playerRef.current;

    if (!player) return;

    const time = player.getCurrentTime();

    player.pauseVideo();

    socket.emit("pause", { roomId, time });

  };

  /* ------------------ SOCKET EVENTS ------------------ */

  useEffect(() => {

    socket.emit("get_participant", { roomId });

    const handleParticipants = (data) => {
       console.log("participants:", data);
  setParticipants(data);

  const me = data.find(
    p => p.socketId === socket.id
  );

  if (me) {
    console.log("my role:", me.role);
    setMyRole(me.role);
  }

    };

    const handleUserJoined = (username) => {
      toast.success(`${username} joined the room`);
    };

    const handleVideoChange = (videoId) => {
      setVideoId(videoId);
    };

    const handlePlayEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);
      player.playVideo();

    };

    const handlePauseEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);
      player.pauseVideo();

    };

    const handleSeekEvent = ({ time }) => {

      const player = playerRef.current;

      if (!player) return;

      player.seekTo(time, true);

    };
    const handleKicked = () => {
  toast.error("You were removed from the room");
  window.location.href = "/";
};


socket.on("kicked", handleKicked);
    socket.on("participants_list", handleParticipants);
    socket.on("user_joined", handleUserJoined);
    socket.on("change_video", handleVideoChange);
    socket.on("play", handlePlayEvent);
    socket.on("pause", handlePauseEvent);
    socket.on("seek", handleSeekEvent);

    return () => {

      socket.off("participants_list", handleParticipants);
      socket.off("user_joined", handleUserJoined);
      socket.off("change_video", handleVideoChange);
      socket.off("play", handlePlayEvent);
      socket.off("pause", handlePauseEvent);
      socket.off("seek", handleSeekEvent);
      socket.off("kicked", handleKicked);

    };

  }, [roomId]);

  /* ------------------ UI ------------------ */

  return (

    <div className="min-h-screen bg-orange-50 p-6">

      {/* Header */}

      <div className="flex justify-between mb-6">

        <Link to="/" className="font-semibold text-lg">
          WatchParty
        </Link>

        <span className="text-gray-600">
          Room ID: {roomId}
        </span>

      </div>

      {/* Layout */}

      <div className="grid grid-cols-3 gap-6">

        {/* VIDEO SECTION */}

        <div className="col-span-2 bg-white p-4 rounded-xl shadow">

          <div className="w-full h-[520px] rounded-lg overflow-hidden">

            {videoId ? (

              <YouTubePlayer
                videoId={videoId}
                onReady={handlePlayerReady}
              />

            ) : (

              <div className="h-full flex items-center justify-center text-gray-500">
                No video selected
              </div>

            )}

          </div>

          {/* VIDEO INPUT */}

          <div className="flex mt-4 gap-3">

            <input
              type="text"
              placeholder="Paste YouTube link"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />

            <button
              onClick={handleChangeVideo}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Change
            </button>

          </div>

          {/* CONTROLS */}

          <div className="flex gap-4 mt-4">

            <button
            disabled={myRole === "participant"}
              onClick={handlePlay}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Play
            </button>

            <button
            disabled={myRole === "participant"}
              onClick={handlePause}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Pause
            </button>

          </div>

        </div>

        {/* PARTICIPANTS */}

        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="text-lg font-medium mb-3">
            Participants ({participants.length})
          </h2>

          <ul className="flex flex-col gap-3">

     {participants.map((p) => (

  <li
    key={p.socketId}
    className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-lg"
  >

    <div className="flex gap-2 items-center">

      <span>{p.username}</span>

      {p.role === "host" && <span>👑</span>}
      {p.role === "moderator" && <span>⭐</span>}

    </div>

    {myRole === "host" && p.socketId !== socket.id && (

      <div className="flex gap-2">

        {/* Promote button */}
        {p.role === "participant" && (

          <button
            onClick={() =>
              socket.emit("assign_role", {
                roomId,
                userId: p.socketId,
                role: "moderator"
              })
            }
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            Promote
          </button>

        )}

        {/* Kick button */}

        <button
          onClick={() =>
            socket.emit("remove_participant", {
              roomId,
              userId: p.socketId
            })
          }
          className="text-sm bg-red-500 text-white px-2 py-1 rounded"
        >
          Kick
        </button>

      </div>

    )}

  </li>

))}

          </ul>

        </div>

      </div>

    </div>

  );
}