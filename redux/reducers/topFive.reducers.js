import { RESTORE_FETCH_TOP_FIVE_STATE, FETCH_TOP_FIVE, IS_FETCHING_TOP_FIVE } from '../constants/topFive.constants';

const initialState = {
  isFetching: false,
  topFive: [],
  modeType: 'all',
  totalCount: 0,
};

const fetchTopFiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_TOP_FIVE:
      return {
        isFetching: action.value,
        topFive: [],
        totalCount: 0,
        type: IS_FETCHING_TOP_FIVE,
      };

    case FETCH_TOP_FIVE:
      return {
        isFetching: false,
        topFive: action.payload,
        modeType: action.modeType,
        pageNumber: parseInt(action.pageNumber, 10),
        players: action.players,
        totalCount: action.totalCount,
        type: FETCH_TOP_FIVE,
      };

    case RESTORE_FETCH_TOP_FIVE_STATE:
      return {
        isFetching: false,
        topFive: action.payload,
        totalCount: action.totalCount,
        type: RESTORE_FETCH_TOP_FIVE_STATE,
      };

    default:
      return state;
  }
};

export default fetchTopFiveReducer;
