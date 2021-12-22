class YoutubeService {
    constructor() {
        this.baseUrl = "http://localhost:8080";
    }

    sendRequest(req) {
        return fetch(req, {method: 'GET'})
        .then((res) => { return res.json() })
        .catch((err) => {
            // console.error(err);
            return [];
        })
        .then((result) => {
            if (result.items) { return result.items; }
            return [];
        })
        .catch((err) => {
            // console.error(err);
            return [];
        });
    }

    login() {
        let url = `${this.baseUrl}/login`;
        this.sendRequest(url);
    }

    getMyChannel() {
        let url = `${this.baseUrl}/channel/mine`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    // Searching
    conductVideoSearch(query) {
        let url = `${this.baseUrl}/search/video/${query}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    conductPlaylistSearch(query) {
        let url = `${this.baseUrl}/search/playlist/${query}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    conductChannelSearch(query) {
        let url = `${this.baseUrl}/search/channel/${query}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    // Retrieving
    getVideo(id) {
        let url = `${this.baseUrl}/video/${id}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    getPlaylist(id) {
        let url = `${this.baseUrl}/playlist/${id}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    getPlaylistItems(id) {
        let url = `${this.baseUrl}/playlistItems/${id}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    getChannelById(channelId) {
        let url = `${this.baseUrl}/channel/id/${channelId}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }

    getChannelByName(channelName) {
        let url = `${this.baseUrl}/channel/name/${channelName}`;
        return this.sendRequest(url).then((result) => {
            return result;
        });
    }
}

export default YoutubeService;