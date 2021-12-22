import * as handTrack from 'handtrackjs';

class HandtrackService {
    constructor() {
        this.defaultParams = {
            flipHorizontal: true, // flip e.g. for video
            maxNumBoxes: 20, // maximum number of boxes to detect
            iouThreshold: 0.5, // ioU threshold for non-max suppression
            scoreThreshold: 0.6 // confidence threshold for predictions.
        }

        this.SAMPLERATE = 500;
        this.runInterval = null;

        this.video = null; 

        this.detected = "None";

        handTrack.load(this.defaultParams).then((model) => {
            this.model = model;
            // console.log(this.model);
        });
    }

    addVideo(videoDom) {
        this.video = videoDom;
    }

    startVideo() {
        return handTrack.startVideo(this.video).then((status) => {
            return status;
        }, (error) => {
            return error;
        });
    }

    startDetection(callbacks) {
        console.log("Starting predictions...");
        this.startVideo().then((status) => {
            this.video.style.height = "200px";
            this.video.style.width = "200px";
            this.runInterval = setInterval(() => {
                this.makePrediction();
                for (let callback of callbacks) {
                    callback(this.detected);
                }
            }, this.SAMPLERATE);
        }, (error) => {
            console.error(error)
        });
    }

    stopDetection(callbacks) {
        console.log("Stopping predictions...");
        clearInterval(this.runInterval);
        this.detected = "None";
        handTrack.stopVideo(this.video);
        for (let callback of callbacks) {
            callback(this.detected);
        }
    }

    makePrediction() {
        if (this.model != null) {
            this.model.detect(this.video).then((predictions) => {
                if (predictions.length === 0) { return; }

                let openhands = 0;
                let closedhands = 0;
                let pointing = 0;
                let pinching = 0;
                
                for (let p of predictions) {
                    console.log(`${p.label} at (${p.bbox[0]}, ${p.bbox[1]}), (${p.bbox[2]}, ${p.bbox[3]})`);
                    if (p.label === "open") openhands++;
                    if (p.label === "closed") closedhands++;
                    if (p.label === "point") pointing++;
                    if (p.label === "pinch") pinching++;

                    if (openhands > 1) this.detected = "Two Open Hands";
                    else if (openhands === 1) this.detected = "Open Hand";

                    if (closedhands > 1) this.detected = "Two Closed Hands";
                    else if (closedhands === 1) this.detected = "Closed Hand";

                    if (pointing > 1) this.detected = "Two Hands Pointing";
                    else if (pointing === 1) {
                        if (p.bbox[2] - p.bbox[0] > 20) {
                            this.detected = "Pointing Right";
                        }
                        else if (p.bbox[2] - p.bbox[0] < -20) {
                            this.detected = "Pointing Left"
                        }
                        else {
                            this.detected = "Hand Pointing";
                        }
                    }

                    if (pinching > 1) this.detected = "Two Hands Pinching";
                    else if (pinching === 1) this.detected = "Hand Pinching";

                    if (openhands === 0 && closedhands === 0 && pointing === 0 && pinching === 0) {
                        this.detected = "None";
                    }
                }                
            }, (error) => {
                console.error(error); 
            });
        }
        else {
            console.log("No model enabled!");
        }
    }
}

export default HandtrackService;