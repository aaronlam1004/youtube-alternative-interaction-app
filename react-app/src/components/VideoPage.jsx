import { useParams, useLocation } from 'react-router-dom';
import React from 'react';
import YouTube from 'react-youtube';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRedo, 
         faStepBackward, faStepForward, faRecycle } from '@fortawesome/free-solid-svg-icons';

import HandtrackVideo from './HandtrackVideo';
import './VideoPage.css';

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);

        // Video specific variables
        this.videoId = (this.props.vid) ? this.props.vid : null;

        // Playlist specific 
        this.playlistId = (this.props.playlist) ? this.props.playlist : null;
        this.loaded = false;
        this.prevIndex = 0;
        this.loopPlaylist = false;

        // Playing variables
        this.playing = false;
        this.loop = false;
        this.interval = null;

        // Styling variables
        this.title = this.props.title;

        this.state = {
            statusIcon: faPlay
        }
    }

    getTimeString(seconds) {
        let minutes = 0;
        if (seconds >= 60) {
            minutes = parseInt(seconds / 60);
            seconds -= (60 * minutes);
        }
        return `${minutes}:${parseInt(seconds).toString().padStart(2, '0')}`
    }

    setTimeString(curr, duration) {
        return this.getTimeString(curr) + '/' + this.getTimeString(duration);
    }

    setLoopVideo(event) {
        this.loop = !this.loop;
        let loopButton = event.target;
        if (this.loop) {
            loopButton.style.color = "#FF0000";
        }
        else {
            loopButton.style.color = "#000000";
        }
    }

    setLoopPlaylist(event) {
        this.loopPlaylist = !this.loopPlaylist;
        let loopButton = event.target;
        if (this.loopPlaylist) {
            loopButton.style.color = "#FF0000";
        }
        else {
            loopButton.style.color = "#000000";
        }
    }

    setPlayPause() {
        if (this.playing) {
            let pauseButton = document.getElementById("pause-button");
            pauseButton.click();
        }
        else {
            let playButton = document.getElementById("play-button");
            playButton.click();
        }
        this.playing = !this.playing;
    }

    setPlayerEvents(event) {
        let player = event.target;
        
        let pauseButton = document.getElementById("pause-button");
        pauseButton.onclick = () => { player.pauseVideo(); };

        let playButton = document.getElementById("play-button");
        playButton.onclick = () => { player.playVideo(); };

        let forwardButton = document.getElementById("fast-forward");
        forwardButton.onclick = () => { player.seekTo(player.getCurrentTime() + 5); };

        let backButton = document.getElementById("go-back");
        backButton.onclick = () => { player.seekTo(player.getCurrentTime() - 5); };

        let slider = document.getElementById("video-slider");
        let time = document.getElementById("current-time");

        let duration = player.getDuration();
        slider.max = duration;

        slider.onchange = () => {
            clearInterval(this.interval);
            player.seekTo(slider.value);
            if (slider.value !== slider.max) {
                this.interval = setInterval(() => {
                    slider.value = player.getCurrentTime();
                    time.innerHTML = this.setTimeString(parseInt(player.getCurrentTime()), player.getDuration());
                    let percent = slider.value / player.getDuration() * 100;
                    slider.style.setProperty("--progress", `${percent}%`);
                });
            } 
        }

        slider.oninput = () => {
            clearInterval(this.interval);
            time.innerHTML = this.setTimeString(parseInt(slider.value), player.getDuration());
            let percent = slider.value / player.getDuration() * 100;
            slider.style.setProperty("--progress", `${percent}%`);
        }

        // When video starts, make it so slider and timer updates video is playing
        this.interval = setInterval(() => {
            slider.value = player.getCurrentTime();
            time.innerHTML = this.setTimeString(player.getCurrentTime(), duration);
            let percent = slider.value / player.getDuration() * 100;
            slider.style.setProperty("--progress", `${percent}%`);
        });

        // For buttons to navigate through playlist
        if (this.playlistId) {
            let prev = document.getElementById("prev-video");
            let next = document.getElementById("next-video");
            prev.onclick = () => { player.previousVideo(); }
            next.onclick = () => { player.nextVideo(); }
        }
    }

    setPlaylistEvents(event) {
        let player = event.target;
        if (event.data === 1) {
            this.playing = true;
            this.setState({statusIcon: faPause});
        }
        else if (event.data === 2) {
            this.playing = false;
            this.setState({statusIcon: faPlay});
        }

        if (this.playlistId && event.data === 3) {
            this.loaded = true;
        }
        else if (this.playlistId && event.data === 1 && this.loaded) {
            this.loaded = false;

            let videoIndex = player.getPlaylistIndex();
            if (this.loop && videoIndex !== this.prevIndex) {
                player.playVideoAt(this.prevIndex);
            }
            else {
                this.prevIndex = videoIndex;
            }

            let slider = document.getElementById("video-slider");
            let time = document.getElementById("current-time");

            clearInterval(this.interval);

            let duration = player.getDuration();
            slider.max = duration;
            this.interval = setInterval(() => {
                slider.value = player.getCurrentTime();
                time.innerHTML = this.setTimeString(parseInt(player.getCurrentTime()), duration);
                let percent = slider.value / player.getDuration() * 100;
                slider.style.setProperty("--progress", `${percent}%`);
            });
        }
        else if (this.playlistId && event.data === 0) {
            let slider = document.getElementById("video-slider");
            let time = document.getElementById("current-time");

            clearInterval(this.interval);

            slider.value = slider.max;
            time.innerHTML = this.setTimeString(parseInt(slider.value), slider.max);
            slider.style.setProperty("--progress", '0');
        }

        // Loop individual video in a playlist
        if (this.playlistId && this.loopPlaylist) {
            player.setLoop(true);
        }
        else if (this.playlistId && !this.loopPlaylist) {
            player.setLoop(false);
        }
    }

    setVideoLoop(event) {
        let player = event.target;
        if (this.videoId && this.loop) {
            clearInterval(this.interval);

            player.seekTo(0);

            let slider = document.getElementById("video-slider");
            let time = document.getElementById("current-time");

            let duration = player.getDuration();
            slider.value = 0;
            time.innerHTML = this.setTimeString(parseInt(slider.value), duration);
            slider.style.setProperty("--progress", '0');

            this.interval = setInterval(() => {
                slider.value = player.getCurrentTime();
                time.innerHTML = this.setTimeString(player.getCurrentTime(), duration);
                let percent = slider.value / player.getDuration() * 100;
                slider.style.setProperty("--progress", `${percent}%`);
            });
        }
    }

    performHandGestures(detected) {
        if (detected === "Open Hand") {
            document.getElementById("play-button").click();
        }
        else if (detected === "Closed Hand") {
            document.getElementById("pause-button").click();
        }
        else if (detected === "Hand Pinching") {
            this.loop = true;
            document.getElementById("loop-button").style.color = "#FF0000";
        }
        else if (detected === "Two Hands Pinching") {
            this.loop = false;
            document.getElementById("loop-button").style.color = "#000000";
        }
        else if (this.playlistId && detected === "Two Open Hands") {
            document.getElementById("next-video").click();
        }
        else if (this.playlistId && detected === "Two Closed Hands") {
            document.getElementById("prev-video").click();
        }
        else if (detected === "Pointing Right") {
            document.getElementById("fast-forward").click();
        }
        else if (detected === "Pointing Left") {
            document.getElementById("go-back").click();
        }
    }

    render() {
        var opts = {
            height: "360",
            width: "720",
            playerVars: {
                autoplay: 1,
                controls: 1
            }
        }

        if (this.playlistId) {
            opts.playerVars.listType = 'playlist';
            opts.playerVars.list = this.playlistId; 
        }

        let ytPlayer = <YouTube videoId={this.videoId}
                               opts={opts} 
                               onReady={this.setPlayerEvents.bind(this)}
                               onStateChange={this.setPlaylistEvents.bind(this)}
                               onEnd={this.setVideoLoop.bind(this)}/>
        
        let repeatPlaylist = "";
        let navigatePlaylists = "";
        if (this.playlistId) {
            repeatPlaylist = <button className="video-button controller"
                                     onClick={this.setLoopPlaylist.bind(this)}
                                     style={{fontSize: "1.8em"}}>
                                    <FontAwesomeIcon icon={faRecycle}/>
                             </button>;
            navigatePlaylists = <div>
                                    <button className="video-button controller" 
                                            id="prev-video"
                                            style={{marginRight: "5em", marginLeft: "5em"}}>
                                        <FontAwesomeIcon icon={faStepBackward}/>
                                    </button>
                                    <button className="video-button controller" 
                                            id="next-video"
                                            style={{marginRight: "5em", marginLeft: "5em"}}>
                                        <FontAwesomeIcon icon={faStepForward}/>
                                    </button>
                                </div>;
            
        }
        const hidden = {
            visibility: "hidden",
            width: "0",
            height: "0",
            margin: "0",
            padding: "0"
        };

        const timeSkipStyles = {
            marginRight: "1em",
            marginLeft: "1em"
        }

        return(
            <div id="video-page">
                <h3>{this.title}</h3><br/>
                {repeatPlaylist}
                <div id="yt-player">
                    {ytPlayer} 
                    <HandtrackVideo callbacks={[this.performHandGestures.bind(this)]}/>
                </div>
                {navigatePlaylists}
                <button className="video-button controller"id="status-controller" onClick={this.setPlayPause.bind(this)}>
                    <FontAwesomeIcon icon={this.state.statusIcon}/>
                </button>
                <input id="video-slider" type="range" min="0" max="100" step="1" defaultValue="0"></input><br/>
                <div>
                    <button className="video-button controller" id="loop-button" onClick={this.setLoopVideo.bind(this)}>
                        <FontAwesomeIcon icon={faRedo}/>
                    </button><br/>
                    <Button variant="outline-secondary" id="go-back" style={timeSkipStyles}>-5</Button>
                    <span id="current-time"></span> 
                    <Button variant="outline-secondary" id="fast-forward" style={timeSkipStyles}>+5</Button>
                </div>
                <button id="play-button" style={hidden}>Play</button>
                <button id="pause-button" style={hidden}>Pause</button>
            </div>
        );
    }
}

function VideoPage() {
    const location = useLocation();
    const params = useParams();

    // console.log(location);
    let title = "";
    if (location.state && location.state.data) {
        const data = location.state.data;
        if (data !== null && data.snippet && data.snippet.title) {
            title = data.snippet.title;
        } 
    }

    let videoComponent = null;
    if (Object.keys(params)[0] === "playlistId") {
        if (title === "") {
            title = params["playlistId"];
        }
        videoComponent = <VideoComponent playlist={params["playlistId"]} title={title}/>
    }
    else {
        if (title === "") {
            title = params["videoId"];
        }
        videoComponent = <VideoComponent vid={params["videoId"]} title={title}/>
    }
    return(
        videoComponent
    );
}

export default VideoPage;