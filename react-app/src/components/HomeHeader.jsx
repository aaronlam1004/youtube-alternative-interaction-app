import React from 'react';
import { Link } from 'react-router-dom';
import './HomeHeader.css';

import icon from '../template/default-youtube-icon.jpg';

class HomeHeader extends React.Component{
    constructor(props) {
        super(props);
        this.youtubeService = props.service;

        this.state = {
            icon: icon,
            name: "null",
            channel: "null",
            data: null
        }
    }
    
    componentDidMount() {
        console.log("Logging in...");
        this.youtubeService.getMyChannel().then((channels) => {
            console.log("Getting information...");
            try {
                let channel = channels[0];
                this.setState({
                    icon: channel.snippet.thumbnails.default.url,
                    name: channel.snippet.title,
                    channel: "null",
                    data: channel
                });
                this.data = channel;
                let logout = document.getElementById("login-button");
                logout.innerHTML = "Logout";
                logout.href = "http://localhost:8080/logout";
            }
            catch {
                return;
            }
        });
    }

    render() {
        return(
            <header>
                <Link id="home-button" to="/">Home</Link>
                <a href="http://localhost:8080/login" id="login-button">Login</a>
                <Link to={`/channel/${this.state.name}`} state={{data: this.state.data}}>
                    <span id="profile-section">
                        <img alt="Profile" src={this.state.icon}/>
                        <strong>{this.state.name}</strong>
                    </span>
                </Link>
            </header>
        );
    }
}

export default HomeHeader;