import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import YoutubeService from './services/YoutubeService';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomeHeader from './components/HomeHeader';
import HomeSearch from './components/HomeSearch';
import VideoPage from './components/VideoPage';
import ChannelPage from './components/ChannelPage';

let youtubeService = new YoutubeService();

function App() {
  return(
    <Router>
      <Routes>
          <Route path="/"
              element={
                <div>
                  <HomeHeader service={youtubeService}/><br/>
                  <HomeSearch service={youtubeService}/>
                </div>
              }
          />
          <Route path={`/video/:videoId`}
              element={
                <div>
                  <HomeHeader service={youtubeService}/>
                  <VideoPage/>
                </div>
              }
          />
          <Route path={`/playlist/:playlistId`}
            element={
              <div>
                <HomeHeader service={youtubeService}/>
                <VideoPage/>
              </div>
            }
          />
          <Route path={`/channel/:channelName`}
            element={
              <div>
                <HomeHeader service={youtubeService}/>
                <ChannelPage service={youtubeService}/>
              </div>
            }
          />
          <Route path={`/channel/:channelId`}
            element={
              <div>
                <HomeHeader service={youtubeService}/>
                <ChannelPage service={youtubeService}/>
              </div>
            }
          />
      </Routes>
    </Router>
  );
}

export default App;
