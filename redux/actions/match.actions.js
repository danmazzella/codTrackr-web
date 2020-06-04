import { RESTORE_FETCH_MATCH_STATE, FETCH_MATCH, IS_FETCHING_MATCH, CLEAR_MATCH } from '../constants/match.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchMatchAction = (match) => (
  {
    type: FETCH_MATCH,
    payload: match,
  }
);

export const isFetchingMatchAction = (isFetching) => (
  {
    type: IS_FETCHING_MATCH,
    value: isFetching,
  }
);

export const clearMatchAction = () => (
  {
    type: CLEAR_MATCH,
    payload: {},
  }
);

export const restoreState = (fetchMatchState) => (
  {
    type: RESTORE_FETCH_MATCH_STATE,
    payload: fetchMatchState,
  }
);

export const fetchMatch = (gamertag, matchId) => async (dispatch) => {
  try {
    dispatch(isFetchingMatchAction(true));

    const res = await fetch(`${apiUrl}/api/match/${matchId}?gamertag=${gamertag}`);
    const data = await res.json();

    dispatch(fetchMatchAction(data.match));
  } catch (e) {
    dispatch(isFetchingMatchAction(false));
  }
};

export const clearMatch = () => async (dispatch) => {
  dispatch(clearMatchAction());
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
