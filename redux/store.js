import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import AuthReducer from './reducers/auth.reducers';
import BlogReducer from './reducers/blog.reducers';
import CommunityPostsReducer from './reducers/communityPosts.reducers';
import LifetimeStatsReducer from './reducers/lifetimeStats.reducers';
import MatchReducer from './reducers/match.reducers';
import PlayersReducer from './reducers/players.reducers';
import RecentMatchesReducer from './reducers/recentMatches.reducers';
import RecentStatsReducer from './reducers/recentStats.reducers';
import TopFiveReducer from './reducers/topFive.reducers';


const reducers = combineReducers({
  auth: AuthReducer,
  blog: BlogReducer,
  communityPosts: CommunityPostsReducer,
  lifetimeStats: LifetimeStatsReducer,
  match: MatchReducer,
  players: PlayersReducer,
  recentMatches: RecentMatchesReducer,
  recentStats: RecentStatsReducer,
  topFive: TopFiveReducer,
});

const initStore = (initialState = {}) => createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware, logger)),
);

export default initStore;