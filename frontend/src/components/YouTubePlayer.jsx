import { useState } from "react";
import YouTube from "react-youtube";

export default function YouTubePlayer({ videoId }) {

  const [player, setPlayer] = useState(null);

  const opts = {
    width: "100%",
    height: "100%", // important
    playerVars: {
      autoplay: 0
    }
  };

  const onPlayerReady = (e) => {
    setPlayer(e.target);
  };

  const playVideo = () => player?.playVideo();
  const pauseVideo = () => player?.pauseVideo();
  const stopVideo = () => player?.stopVideo();

  return (

    <div className="w-full flex flex-col">

      {/* Player container controls height */}
      <div className="w-full h-[542px] rounded-lg overflow-hidden">

        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          className="w-full h-full"
        />

      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={playVideo}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Play
        </button>

        <button
          onClick={pauseVideo}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          Pause
        </button>

        <button
          onClick={stopVideo}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Stop
        </button>

      </div>

    </div>

  );
}