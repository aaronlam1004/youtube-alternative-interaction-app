import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import VideoCard from './VideoCard';
import './ChannelPage.css';

function ChannelPage(props) {
    const location = useLocation();
    const params = useParams();

    let styles = {
        color: "#FF0000"
    };

    let title = "Not logged in!";
    let description = "?";
    let subscribers = 0;
    let views = 0;

    let icon=<img/>
    let banner=<img/>

    if (params["channelName"] !== "null") {
        title = params["channelName"]
        styles = {};
    }

    let uploads = null;
    if (location.state && location.state.data) {
        const data = location.state.data;
        // console.log(data);
        if (data.snippet) {
            if (data.snippet.title) title = data.snippet.title; 
            if (data.snippet.description) description = data.snippet.description;
            if (data.snippet.thumbnails.high) {
                const stylings = {
                    width: "8em",
                    height: "8em"
                };
                icon = <img alt="Profile" src={data.snippet.thumbnails.high.url} style={stylings}/>;
            }
        }
        if (data.brandingSettings) {
            let branding = data.brandingSettings;
            if (branding.image && branding.image.bannerExternalUrl) {
                const stylings = {
                    objectFit: "cover",
                    width: "100%",
                    height: "8em"
                };
                banner = <img alt="Banner" src={branding.image.bannerExternalUrl} style={stylings}/>
            }
        }

        if (data.contentDetails && data.contentDetails.relatedPlaylists) {
            let related = data.contentDetails.relatedPlaylists;
            if (related.uploads) {
                uploads = related.uploads;
            }
        }

        if (data.statistics) {

            if (data.statistics.viewCount) views = parseInt(data.statistics.viewCount).toLocaleString();
            if (data.statistics.subscriberCount) subscribers = parseInt(data.statistics.subscriberCount).toLocaleString();
        }
    }

    const [uploadPlaylist, setPlaylist] = useState(<p></p>);
    const [callState, setCallState] = useState(false);

    useEffect(() => {
        // console.log(callState);
        if (!callState) {
            let youtubeService = props.service;
            if (uploads !== null) {
                youtubeService.getPlaylist(uploads).then((playlists) => {
                    try {
                        let playlist = playlists[0]
                        let video = <VideoCard key={uploads} playlistId={uploads} 
                                               title={playlist.snippet.title} src={playlist.snippet.thumbnails.high.url} 
                                               channel={title} data={playlist}/>
                        setPlaylist(video);
                    }
                    catch {
                        let video = <VideoCard key={uploads} playlistId={uploads} 
                                               title="Uploads" 
                                               channel={title}/>
                        setPlaylist(video);
                    }
                });
            }
        }
        setCallState(true); 
    });
        
    return(
        <div>
            {banner}
            <div id="channel-container">
                <div id="title-block">
                    {icon}<strong style={styles}>{title}</strong>
                    <ul>
                        <li><u>Subscribers:</u> <br/>{subscribers}</li>
                        <li><u>Views:</u> <br/>{views}</li>
                    </ul>
                </div>
                <div style={{display: "flex"}}>
                    <p style={{whiteSpace: "pre-wrap", width: "50%"}}>{description}</p>
                    {uploadPlaylist} 
                </div>
            </div>
        </div>
    );
}

export default ChannelPage;