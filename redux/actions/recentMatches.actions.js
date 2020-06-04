import { RESTORE_FETCH_MATCHES_STATE, FETCH_MATCHES, IS_FETCHING_MATCHES } from '../constants/recentMatches.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchMatchesAction = (matches, totalCount, modeType, pageNumber, players) => {
  return {
    modeType,
    type: FETCH_MATCHES,
    pageNumber,
    payload: matches,
    totalCount,
    players,
  };
};

export const isFetchingMatchesAction = (isFetching) => (
  {
    type: IS_FETCHING_MATCHES,
    value: isFetching,
  }
);

export const restoreState = (fetchMatchesState) => (
  {
    type: RESTORE_FETCH_MATCHES_STATE,
    payload: fetchMatchesState,
  }
);

export const fetchMatches = (modeType = 'all', pageNumber = 1, pageSize = 25, players) => async (dispatch) => {
  try {
    dispatch(isFetchingMatchesAction(true));

    const res = await fetch(`${apiUrl}/api/matches?modeType=${modeType}&page=${pageNumber}&pageSize=${pageSize}&players=${players}`);
    const data = await res.json();

    dispatch(fetchMatchesAction(data.matches, data.totalCount, modeType, pageNumber, players));
  } catch (e) {
    dispatch(isFetchingMatchesAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
