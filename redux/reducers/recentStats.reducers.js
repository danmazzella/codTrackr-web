import { RESTORE_FETCH_RECENT_STATS_STATE, FETCH_RECENT_STATS, IS_FETCHING_RECENT_STATS } from '../constants/recentStats.constants';

const initialState = {
  isFetching: false,
  recentStats: [],
  modeType: 'all',
  totalCount: 0,
};

const fetchMatchesReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_RECENT_STATS:
      return {
        isFetching: action.value,
        recentStats: [],
        totalCount: 0,
        type: IS_FETCHING_RECENT_STATS,
      };

    case FETCH_RECENT_STATS:
      return {
        isFetching: false,
        recentStats: action.payload,
        modeType: action.modeType,
        pageNumber: parseInt(action.pageNumber, 10),
        players: action.players,
        totalCount: action.totalCount,
        type: FETCH_RECENT_STATS,
      };

    case RESTORE_FETCH_RECENT_STATS_STATE:
      return {
        isFetching: false,
        recentStats: action.payload,
        totalCount: action.totalCount,
        type: RESTORE_FETCH_RECENT_STATS_STATE,
      };

    default:
      return state;
  }
};

export default fetchMatchesReducer;
