import { RESTORE_FETCH_TOP_FIVE_STATE, FETCH_TOP_FIVE, IS_FETCHING_TOP_FIVE } from '../constants/topFive.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchTopFiveAction = (topFive, totalCount, modeType, pageNumber, players) => {
  return {
    modeType,
    type: FETCH_TOP_FIVE,
    pageNumber,
    payload: topFive,
    totalCount,
    players,
  };
};

export const isFetchingTopFiveAction = (isFetching) => (
  {
    type: IS_FETCHING_TOP_FIVE,
    value: isFetching,
  }
);

export const restoreState = (fetchTopFiveState) => (
  {
    type: RESTORE_FETCH_TOP_FIVE_STATE,
    payload: fetchTopFiveState,
  }
);

export const fetchTopFive = (modeType = 'all', _monthFilter = undefined, pageNumber = 1, pageSize = 25, players) => async (dispatch) => {
  try {
    dispatch(isFetchingTopFiveAction(true));

    let monthFilter = _monthFilter;
    if (monthFilter !== undefined) {
      monthFilter = JSON.stringify(monthFilter);
    }

    const res = await fetch(`${apiUrl}/api/matches/topFive?modeType=${modeType}&monthFilter=${monthFilter}&page=${pageNumber}&pageSize=${pageSize}&players=${encodeURIComponent(players)}`);
    const data = await res.json();

    dispatch(fetchTopFiveAction(data.userMatches, data.totalCount, modeType, pageNumber, players));
  } catch (e) {
    dispatch(isFetchingTopFiveAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
