import YouTube from "react-youtube";

export default function YouTubePlayer({ videoId, onReady }) {

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0
    }
  };

  const handleReady = (event) => {
    const player = event.target;

    if (onReady) {
      onReady(player);
    }
  };

  return (
    <div className="w-full h-[520px] bg-black rounded-lg overflow-hidden">

      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        className="w-full h-full"
      />

    </div>
  );
}