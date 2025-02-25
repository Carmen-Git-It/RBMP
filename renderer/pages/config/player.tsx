import React from "react";
import ReactPlayer from "react-player/lazy";

export default function Player({
  player,
  content,
  muted,
  player_style,
  play,
  handleContentEnd,
}) {
  return (
    <ReactPlayer
      ref={player}
      className="react-player"
      url={content}
      width="100%"
      height="100%"
      muted={muted}
      style={player_style}
      playing={play}
      onEnded={handleContentEnd}
      controls={true}
    />
  );
}
