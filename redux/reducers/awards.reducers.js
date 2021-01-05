import {
  RESTORE_FETCH_AWARDS_STATE,
  FETCH_AWARDS,
  IS_FETCHING_AWARDS,
} from '../constants/awards.constants';

const initialState = {
  createData: {},
  isFetching: false,
  awards: {},
  type: '',
};

const fetchAwardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_AWARDS:
      return {
        type: IS_FETCHING_AWARDS,
        isFetching: action.value,
        awards: {},
      };

    case FETCH_AWARDS:
      return {
        type: FETCH_AWARDS,
        isFetching: false,
        awards: action.awards,
      };

    case RESTORE_FETCH_AWARDS_STATE:
      return {
        type: RESTORE_FETCH_AWARDS_STATE,
        isFetching: false,
        awards: action.awards,
      };

    default:
      return state;
  }
};

export default fetchAwardsReducer;
