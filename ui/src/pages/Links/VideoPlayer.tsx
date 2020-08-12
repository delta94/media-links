import React, { useContext, useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { LinksContext } from "../../contexts/LinksContext";
import { MediaPlayerContext } from "../../contexts/MediaPlayerContext";
import BigNumber from "bignumber.js";

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const VideoWrapper = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  .react-video-player {
    height: 100%;
    min-height: 100%;
    background: black;
    width: 100% !important;
  }
`;

type VideoPlayerProps = {};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ }) => {
  const { currentVideo } = useContext(LinksContext);
  const { playing, autoplay, volume, seek, duration, setDuration, setProgress, setPlaying, playVideoByCurrent, loop } = useContext(MediaPlayerContext);
  const [ended, setEnded] = useState<boolean>(false);
  const ref: any = useRef();

  const handleAutoPlay = () => {
    if (loop) {
      setPlaying(false);
      ref.current.seekTo(0);
      setPlaying(true);
    } else {
      if (autoplay) {
        setProgress(0);
        setDuration(0);
        playVideoByCurrent(currentVideo, 1);
        setEnded(false);
      }
    };
  };

  useEffect(() => {
    if (ended) {
      handleAutoPlay();
    }
  }, [ended]);

  useEffect(() => {
    if (seek && ref.current) {
      setPlaying(false);
      const p1 = new BigNumber(seek).multipliedBy(duration).dividedBy(100).toNumber();
      ref.current.seekTo(p1);
      setPlaying(true);
    }
  }, [seek]);

  return (
    <Container>
      <VideoWrapper>
        <ReactPlayer
          ref={ref}
          volume={volume}
          playing={playing}
          url={currentVideo.author_url}
          className="react-video-player"
          onEnded={() => setEnded(true)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onProgress={(event) => setProgress(event.playedSeconds)}
          onDuration={(e) => setDuration(e)}
        />
      </VideoWrapper>
    </Container>
  )
}