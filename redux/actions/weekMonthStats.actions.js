import { RESTORE_FETCH_WEEK_MONTH_STATS_STATE, FETCH_WEEK_MONTH_STATS, IS_FETCHING_WEEK_MONTH_STATS } from '../constants/weekMonthStats.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchWeekMonthAction = (weekMonth, totalCount, modeType, pageNumber, players) => {
  return {
    modeType,
    type: FETCH_WEEK_MONTH_STATS,
    pageNumber,
    payload: weekMonth,
    totalCount,
    players,
  };
};

export const isFetchingWeekMonthAction = (isFetching) => (
  {
    type: IS_FETCHING_WEEK_MONTH_STATS,
    value: isFetching,
  }
);

export const restoreState = (fetchWeekMonthState) => (
  {
    type: RESTORE_FETCH_WEEK_MONTH_STATS_STATE,
    payload: fetchWeekMonthState,
  }
);

export const fetchWeekMonthStats = (modeType = 'all', _monthFilter = undefined, pageNumber = 1, pageSize = 25, players) => async (dispatch) => {
  try {
    dispatch(isFetchingWeekMonthAction(true));

    let monthFilter = _monthFilter;
    if (monthFilter !== undefined) {
      monthFilter = JSON.stringify(monthFilter);
    }

    const res = await fetch(`${apiUrl}/api/players/weekMonthStats?modeType=${modeType}&monthFilter=${monthFilter}&page=${pageNumber}&pageSize=${pageSize}&players=${encodeURIComponent(players)}`);
    const data = await res.json();

    dispatch(fetchWeekMonthAction(data.players, data.totalCount, modeType, pageNumber, players));
  } catch (e) {
    dispatch(isFetchingWeekMonthAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
