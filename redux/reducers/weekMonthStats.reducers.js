import { RESTORE_FETCH_WEEK_MONTH_STATS_STATE, FETCH_WEEK_MONTH_STATS, IS_FETCHING_WEEK_MONTH_STATS } from '../constants/weekMonthStats.constants';

const initialState = {
  isFetching: false,
  weekMonthStats: [],
  modeType: 'all',
  totalCount: 0,
};

const fetchWeekMonthReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_WEEK_MONTH_STATS:
      return {
        isFetching: action.value,
        weekMonthStats: [],
        totalCount: 0,
        type: IS_FETCHING_WEEK_MONTH_STATS,
      };

    case FETCH_WEEK_MONTH_STATS:
      return {
        isFetching: false,
        weekMonthStats: action.payload,
        modeType: action.modeType,
        pageNumber: parseInt(action.pageNumber, 10),
        players: action.players,
        totalCount: action.totalCount,
        type: FETCH_WEEK_MONTH_STATS,
      };

    case RESTORE_FETCH_WEEK_MONTH_STATS_STATE:
      return {
        isFetching: false,
        weekMonthStats: action.payload,
        totalCount: action.totalCount,
        type: RESTORE_FETCH_WEEK_MONTH_STATS_STATE,
      };

    default:
      return state;
  }
};

export default fetchWeekMonthReducer;
