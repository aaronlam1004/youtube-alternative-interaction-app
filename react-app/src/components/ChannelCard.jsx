import { Link } from 'react-router-dom';

import './ChannelCard.css';
import icon from '../template/default-youtube-icon.jpg';

function ChannelCard(props) {
    let url = "/channel/;_;";
    if (props.user !== "") {
        url = `/channel/${props.user}`;
    }
    else if (props.id) {
        url = `/channel/${props.id}`;
    }

    let title = "?";
    if (props.title !== "") {
        title = props.title;
    }

    let subscribers = "?";
    if (props.subscribers) {
        subscribers = props.subscribers;
    }

    let views = "?";
    if (props.views) {
        views = props.views;
    }

    const styles = { 
        textDecoration: 'none',
        display: 'inline-block'
    }

    return(
        <Link className="channel-card" to={url} state={{data: props.data}} style={styles}>
            <div>
                <img alt="Profile" src={props.icon}/> <strong>{title}</strong><br/>
                Subscribers: {subscribers}<br/>
                Views: {views}
            </div>
        </Link>
    );
}

ChannelCard.defaultProps = {
    user: "",
    title: "",
    subscribers: null,
    views: null,
    data: null,
    icon: icon
}

export default ChannelCard;