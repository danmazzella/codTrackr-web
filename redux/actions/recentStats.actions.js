import { RESTORE_FETCH_RECENT_STATS_STATE, FETCH_RECENT_STATS, IS_FETCHING_RECENT_STATS } from '../constants/recentStats.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchRecentStatsAction = (recentStats, totalCount, modeType, pageNumber, players) => {
  return {
    modeType,
    type: FETCH_RECENT_STATS,
    pageNumber,
    payload: recentStats,
    totalCount,
    players,
  };
};

export const isFetchingRecentStatsAction = (isFetching) => (
  {
    type: IS_FETCHING_RECENT_STATS,
    value: isFetching,
  }
);

export const restoreState = (fetchRecentStatsState) => (
  {
    type: RESTORE_FETCH_RECENT_STATS_STATE,
    payload: fetchRecentStatsState,
  }
);

export const fetchRecentStats = (modeType = 'all', pageNumber = 1, pageSize = 25, players, sortColumn = 'avgOcaScore', sortDir = 'desc') => async (dispatch) => {
  try {
    dispatch(isFetchingRecentStatsAction(true));

    const res = await fetch(`${apiUrl}/api/player/stats/recent?modeType=${modeType}&page=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortDir=${sortDir}&players=${encodeURIComponent(players)}`);
    const data = await res.json();

    dispatch(fetchRecentStatsAction(data.stats, data.totalCount, modeType, pageNumber, players));
  } catch (e) {
    dispatch(isFetchingRecentStatsAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
