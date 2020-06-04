import { RESTORE_FETCH_MATCH_STATE, FETCH_MATCH, IS_FETCHING_MATCH, CLEAR_MATCH } from '../constants/match.constants';

const initialState = {
  isFetching: false,
  match: {},
  type: '',
};

const fetchPlayersReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_MATCH:
      return {
        type: IS_FETCHING_MATCH,
        isFetching: action.value,
        match: {},
      };

    case FETCH_MATCH:
      return {
        type: FETCH_MATCH,
        isFetching: false,
        match: action.payload,
      };

    case RESTORE_FETCH_MATCH_STATE:
      return {
        type: RESTORE_FETCH_MATCH_STATE,
        isFetching: false,
        match: action.payload,
      };

    case CLEAR_MATCH:
      return {
        type: CLEAR_MATCH,
        isFetching: false,
        match: action.payload,
      };

    default:
      return state;
  }
};

export default fetchPlayersReducer;
