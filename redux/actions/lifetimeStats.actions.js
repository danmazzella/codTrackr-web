import { RESTORE_FETCH_LIFETIME_STATS_STATE, FETCH_LIFETIME_STATS, IS_FETCHING_LIFETIME_STATS } from '../constants/lifetimeStats.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchLifetimeStatsAction = (lifetimeStats, totalCount, modeType) => (
  {
    modeType,
    type: FETCH_LIFETIME_STATS,
    payload: lifetimeStats,
    totalCount,
  }
);

export const isFetchingLifetimeStatsAction = (isFetching) => (
  {
    type: IS_FETCHING_LIFETIME_STATS,
    value: isFetching,
  }
);

export const restoreState = (fetchLifetimeStatsState) => (
  {
    type: RESTORE_FETCH_LIFETIME_STATS_STATE,
    payload: fetchLifetimeStatsState,
  }
);

export const fetchLifetimeStats = (modeType = 'br', pageNumber = 0, pageSize = 25, players, sortColumn = 'avgOcaScore', sortDir = 'desc') => async (dispatch) => {
  try {
    dispatch(isFetchingLifetimeStatsAction(true));

    const res = await fetch(`${apiUrl}/api/player/stats/lifetime?modeType=${modeType}&page=${pageNumber}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortDir=${sortDir}&players=${players}`);
    const data = await res.json();

    dispatch(fetchLifetimeStatsAction(data.stats, data.totalCount, modeType));
  } catch (e) {
    dispatch(isFetchingLifetimeStatsAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
