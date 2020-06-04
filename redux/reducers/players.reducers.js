import { RESTORE_FETCH_PLAYERS_STATE, FETCH_PLAYERS, IS_FETCHING_PLAYERS, FETCHING_LATEST_STATS_PLAYERS } from '../constants/players.constants';

const initialState = {
  isFetching: false,
  players: [],
  lastFetch: undefined,
  message: '',
  type: '',
};

const fetchPlayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_PLAYERS:
      return {
        type: IS_FETCHING_PLAYERS,
        isFetching: action.value,
        players: [],
      };

    case FETCH_PLAYERS:
      return {
        type: FETCH_PLAYERS,
        isFetching: false,
        players: action.payload,
        lastFetch: action.lastFetch,
      };

    case RESTORE_FETCH_PLAYERS_STATE:
      return {
        type: RESTORE_FETCH_PLAYERS_STATE,
        isFetching: false,
        players: action.payload,
      };

    case FETCHING_LATEST_STATS_PLAYERS:
      return {
        type: FETCHING_LATEST_STATS_PLAYERS,
        isFetching: false,
        message: action.message,
      };

    default:
      return state;
  }
};

export default fetchPlayersReducer;
