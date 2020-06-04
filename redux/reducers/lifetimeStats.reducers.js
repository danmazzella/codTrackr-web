import { RESTORE_FETCH_LIFETIME_STATS_STATE, FETCH_LIFETIME_STATS, IS_FETCHING_LIFETIME_STATS } from '../constants/lifetimeStats.constants';

const initialState = {
  isFetching: false,
  lifetimeStats: [],
  modeType: 'br',
  totalCount: 0,
};

const fetchLifetimeStatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_LIFETIME_STATS:
      return {
        type: IS_FETCHING_LIFETIME_STATS,
        isFetching: action.value,
        lifetimeStats: [],
        modeType: state.modeType,
        totalCount: 0,
      };

    case FETCH_LIFETIME_STATS:
      return {
        type: FETCH_LIFETIME_STATS,
        isFetching: false,
        lifetimeStats: action.payload,
        modeType: action.modeType,
        totalCount: action.totalCount,
      };

    case RESTORE_FETCH_LIFETIME_STATS_STATE:
      return {
        type: RESTORE_FETCH_LIFETIME_STATS_STATE,
        isFetching: false,
        lifetimeStats: action.payload,
        totalCount: action.totalCount,
      };

    default:
      return state;
  }
};

export default fetchLifetimeStatsReducer;
