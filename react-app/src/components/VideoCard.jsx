import { Link } from 'react-router-dom';
import React from 'react';
import './VideoCard.css';

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import thumbnail from '../template/default-video-screen.jpg'

class VideoCard extends React.Component {
    constructor(props) {
        super(props);

        this.type = "Video";

        this.url = "";
        if (this.props.videoId) {
            this.url = `/video/${props.videoId}`
        }
        else if (props.playlistId) {
            this.url = `/playlist/${props.playlistId}`
            this.type = "Playlist";
        }
        else {
            this.url = `/video/dQw4w9WgXcQ`;
        }
       
        this.state = {
            img: thumbnail
        };

        this.interval = null; 
    }

    componentDidMount() {
        let img = this.props.src; 
        if (img !== null && img !== "" && img !== []) {
            if (typeof this.props.src === 'object') {
                let index = 0;
                img = this.props.src[index];
                this.setState({ img: img });
                this.interval = setInterval(() => {
                    index += 1;
                    if (index >= this.props.src.length) { index = 0; }
                    img = this.props.src[index];
                    this.setState({ img: img })
                }, 1500)
            }
            else {
                this.setState({ img: img });
            }
        }
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const styles = { 
            textDecoration: 'none',
            display: 'inline-block',
        }

        return(
            <div>
            <Link to={this.url} state={{data: this.props.data}} style={styles}>
                <div className="video-card">
                    <img alt={this.props.title} src={this.state.img}/>
                    <div>
                        <strong>{this.props.title}</strong> ({this.type})<br/>
                        <u>{this.props.channel}</u>
                    </div>
                </div>
            </Link>

            {/* <Card as="link" to={this.url} style={{ width: '24rem', height: '12rem' }}>
            <Card.Img variant="top" src={this.state.img} />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
            </Card> */}
            </div>
        );
    }
}

VideoCard.defaultProps = {
    videoId: null,
    playlistId: null,
    title: "Unknown",
    src: null,
    data: null,
    channel: "Unknown"
}

export default VideoCard;