import React from "react";
import { AwesomeButton } from "react-awesome-button";

import "react-awesome-button/dist/styles.css";
import InputGroup from "react-bootstrap/InputGroup";
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import VideoCard from "./VideoCard";
import ChannelCard from "./ChannelCard";
import "./HomeSearch.css";

// Images for template examples
import rickAstley from "../template/never-gonna.jpg";
import rickAstleyJSON from "../template/never-gonna.json";

import nba1 from "../template/nba-together/nba-together-1.jpg";
import nba2 from "../template/nba-together/nba-together-2.jpg";
import nba3 from "../template/nba-together/nba-together-3.jpg";
import nba4 from "../template/nba-together/nba-together-4.jpg";
import nba5 from "../template/nba-together/nba-together-5.jpg";
import nbaJSON from "../template/nba-together/nba-together.json";


import mrbeast from '../template/mrbeast.jpg';
import mrbeastJSON from '../template/MrBeast6000.json';

class HomeSearch extends React.Component{
  constructor(props) {
      super(props);
      this.youtubeService = props.service;

      this.formatter = new Intl.NumberFormat('en-US');

      this.state = {
          cards: [
              <VideoCard key="null"/>, 
              <VideoCard key="dQw4w9WgXcQ" videoId="dQw4w9WgXcQ"
                          title="Rick Astley - Never Gonna Give You Up (Official Music Video)" 
                          channel="Rick Astley" src={rickAstley} data={rickAstleyJSON.items[0]}/>,
              <VideoCard key="PLlVlyGVtvuVlhFfuSePtKSySrXW78mWXB" playlistId="PLlVlyGVtvuVlhFfuSePtKSySrXW78mWXB" 
                          title="#NBATogetherLive Classic Games" 
                          channel="NBA" src={[nba1, nba2, nba3, nba4, nba5]} data={nbaJSON.items[0]}/>
          ],
          channels: [
              <ChannelCard key="null"/>,
              <ChannelCard key="UCX6OQ3DkcsbYNE6H8uQQuVA" title="MrBeast" user="mrbeast6000"
                            icon={mrbeast} subscribers={this.formatter.format(83800000)}
                            views={this.formatter.format(13739251310)} data={mrbeastJSON.items[0]}/>
          ],
          select: "Videos"
      };
  }
  setThumbnail(thumbnails) {
    console.log(thumbnails);
    if (thumbnails.maxres) {
      return thumbnails.maxres.url;
    }
    else if (thumbnails.high) {
      return thumbnails.high.url;
    }
    else if (thumbnails.medium) {
      return thumbnails.medium.url;
    }
    else if (thumbnails.default) {
      return thumbnails.default.url
    }
    return null;
  }

  setVideoCards(query) {
    this.youtubeService.conductVideoSearch(query).then((results) => {
      let videoIds = "";
      let n = results.length;
      for (var i = 0; i < n; i++) {
        let result = results[i];
        videoIds += result.id.videoId;
        if (i < n - 1) {
          videoIds += ",";
        }
      }
      this.youtubeService.getVideo(videoIds).then((vids) => {
        let vidCards = [];
        for (let vid of vids) {
          var thumbnail = this.setThumbnail(vid.snippet.thumbnails);
          vidCards.push(
            <VideoCard
              key={vid.id}
              videoId={vid.id}
              title={vid.snippet.title}
              channel={vid.snippet.channelTitle}
              src={thumbnail}
              data={vid}
            />
          );
        }
        this.setState({ cards: vidCards });
      });
    });
  }

  setPlaylistCards(query) {
    this.youtubeService.conductPlaylistSearch(query).then((results) => {
      let playlistIds = "";
      let n = results.length;
      for (var i = 0; i < n; i++) {
        let result = results[i];
        playlistIds += result.id.playlistId;
        if (i < n - 1) {
          playlistIds += ",";
        }
      }

      this.youtubeService.getPlaylist(playlistIds).then((playlists) => {
        let playlistCards = [];
        let count = 0;
        for (var i = 0; i < n; i++) {
          let playlist = playlists[i];

          this.youtubeService.getPlaylistItems(playlist.id).then((items) => {
              return items;
          }).then((vids) => {
            let thumbnails = [];
            for (let vid of vids) {
              let thumbnail = this.setThumbnail(vid.snippet.thumbnails);
              thumbnails.push(thumbnail);
            }
            playlistCards.push(<VideoCard key={playlist.id} playlistId={playlist.id} 
                                          title={playlist.snippet.title} 
                                          channel={playlist.snippet.channelTitle} 
                                          src={thumbnails} data={playlist}/>);
            count += 1;
            if (count === n) {
                this.setState({cards: playlistCards})
            }
          });
            
        }
      });
    });
  }
  setChannelCards(query) {
    this.youtubeService.conductChannelSearch(query).then((results) => {
      let channelIds = "";
      let n = results.length;
      for (var i = 0; i < n; i++) {
          let result = results[i];
          channelIds += result.id.channelId;
          if (i < n - 1) {
              channelIds += ',';
          }
      }
      this.youtubeService.getChannelById(channelIds).then((channels) => {
          let channelCards = [];
          channels.sort((a, b) => {
              if (parseInt(a.statistics.viewCount) > parseInt(b.statistics.viewCount)) return -1;
              else return 1;
          });
          for (let channel of channels) {
              let icon = this.setThumbnail(channel.snippet.thumbnails);
              let subscribers = this.formatter.format(parseInt(channel.statistics.subscriberCount));
              let views = this.formatter.format(parseInt(channel.statistics.viewCount));
              channelCards.push(<ChannelCard key={channel.id} id={channel.id} title={channel.snippet.title}
                                              user={channel.snippet.customUrl} icon={icon} subscribers={subscribers} 
                                              views={views} data={channel}/>);
          }
          this.setState({channels: channelCards})
      });
    });
  }

  getSearchResults() {
    let input = document.getElementById("search-input");
    let query = input.value;

    if (this.state.select === "Videos") {
      this.setVideoCards(query);
    } else if (this.state.select === "Playlists") {
      this.setPlaylistCards(query);
    } else if (this.state.select === "Channels") {
      this.setChannelCards(query);
    }
  }
    
  handleSelect(event){
    console.log(event);
    this.setState({select: event});
  }

  render() {
    return (
    <div>
      <Container>
        <Row>
          <Col>
            <div id="searching-tools">
              <InputGroup className="mb-3">
                <Form.Control id="search-input" aria-label="Text input with dropdown button" onKeyDown={
                  (event) => {
                    if (event.key === "Enter") {
                      this.getSearchResults();
                    }
                  }
                }/>

                <DropdownButton
                  variant="outline-secondary"
                  title={this.state.select}
                  id="input-group-dropdown-2"
                  align="end"
                  onSelect={this.handleSelect.bind(this)}
                >
                <Dropdown.Item eventKey="Videos">Videos</Dropdown.Item>
                <Dropdown.Item eventKey="Playlists">Playlists</Dropdown.Item>
                <Dropdown.Item eventKey="Channels">Channels</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </div>
          </Col>
          <Col>
            <AwesomeButton
              id="aws-btn"
              onPress={this.getSearchResults.bind(this)}
            >
            Search
            </AwesomeButton>
          </Col>
        </Row>
      </Container>
        {/* hOemzdz67SQ */}
      <div id="search-container">{this.state.channels}</div>
      <div id="search-container">{this.state.cards}</div>
    </div>
    );
  }
}

export default HomeSearch;
