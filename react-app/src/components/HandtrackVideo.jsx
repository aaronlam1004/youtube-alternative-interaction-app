import HandtrackService from '../services/HandtrackService';
import React from 'react';
import Button from 'react-bootstrap/Button';

import './HandtrackVideo.css';

class HandtrackVideo extends React.Component {
    constructor(props) {
        super(props);
        this.handtrackService = new HandtrackService();

        this.enabled = false;
        this.state = {
            detected: "None"
        }
    }

    componentDidMount() {
        let video = document.getElementById("handtracking-video");
        this.handtrackService.addVideo(video);
    }

    updateMessage(message) {
        this.setState({detected: message});
    }

    setDetection() {
        let detection = document.getElementById("detection-button");
        if (!this.enabled) {
            detection.innerHTML = "Stop Detection"
            this.handtrackService.startDetection([this.updateMessage.bind(this)].concat(this.props.callbacks));
        }
        else {
            detection.innerHTML = "Start Detection";
            this.handtrackService.stopDetection([this.updateMessage.bind(this)]);
        }
        this.enabled = !this.enabled;
    }

    render() {
        return(
            <div id="handtracking-container">
                <span>{this.state.detected}</span><br/>
                <video id="handtracking-video"></video><br/>
                <ul style={{listStyle: "none", textAlign: "left"}}>
                    <li><strong>Open Hand</strong> - Play</li>
                    <li><strong>Closed Hand</strong> - Pause</li>
                    <li><strong>Pointing Right</strong> - Skip 5 Seconds</li>
                    <li><strong>Pointing Left</strong> - Go Back 5 Seconds</li>
                    <li><strong>Pinching</strong> - Set Video to Loop</li>
                    <li><strong>Two Hands Pinching</strong> - Turn Loop Off</li>
                    <li><strong>Two Open Hands</strong> - Go to Next Video in Playlist</li>
                    <li><strong>Two Closed Hands</strong> - Go to Previous Video in Playlist</li>
                </ul><br/>
                <Button variant="outline-secondary" id="detection-button" onClick={this.setDetection.bind(this)}>Start Detection</Button>
                <br/>
            </div>
        );
    }
}

HandtrackVideo.defaultProps = {
    callbacks: []
}

export default HandtrackVideo;