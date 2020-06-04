import { RESTORE_FETCH_MATCHES_STATE, FETCH_MATCHES, IS_FETCHING_MATCHES } from '../constants/recentMatches.constants';

const initialState = {
  isFetching: false,
  matches: [],
  modeType: 'all',
  totalCount: 0,
};

const fetchMatchesReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_MATCHES:
      return {
        isFetching: action.value,
        matches: [],
        totalCount: 0,
        type: IS_FETCHING_MATCHES,
      };

    case FETCH_MATCHES:
      return {
        isFetching: false,
        matches: action.payload,
        modeType: action.modeType,
        pageNumber: parseInt(action.pageNumber, 10),
        players: action.players,
        totalCount: action.totalCount,
        type: FETCH_MATCHES,
      };

    case RESTORE_FETCH_MATCHES_STATE:
      return {
        isFetching: false,
        matches: action.payload,
        totalCount: action.totalCount,
        type: RESTORE_FETCH_MATCHES_STATE,
      };

    default:
      return state;
  }
};

export default fetchMatchesReducer;
