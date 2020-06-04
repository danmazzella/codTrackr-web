import { RESTORE_FETCH_PLAYERS_STATE, FETCH_PLAYERS, IS_FETCHING_PLAYERS, FETCHING_LATEST_STATS_PLAYERS } from '../constants/players.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchPlayersAction = (players, lastFetch) => (
  {
    type: FETCH_PLAYERS,
    payload: players,
    lastFetch: parseInt(lastFetch, 10),
  }
);

export const isFetchingPlayersAction = (isFetching) => (
  {
    type: IS_FETCHING_PLAYERS,
    value: isFetching,
  }
);

export const restoreState = (fetchPlayersState) => (
  {
    type: RESTORE_FETCH_PLAYERS_STATE,
    payload: fetchPlayersState,
  }
);

export const fetchLatestForEveryone = (message) => (
  {
    type: FETCHING_LATEST_STATS_PLAYERS,
    message,
  }
);

export const fetchPlayers = () => async (dispatch) => {
  try {
    dispatch(isFetchingPlayersAction(true));

    const res = await fetch(`${apiUrl}/api/players`);
    const data = await res.json();

    dispatch(fetchPlayersAction(data.players, data.lastFetch));
  } catch (e) {
    dispatch(isFetchingPlayersAction(false));
  }
};

export const fetchLatestStatsMatches = () => async (dispatch) => {
  try {
    const res = await fetch(`${apiUrl}/api/players/fetchLatestStatsMatches`, { method: 'post' });
    const data = await res.json();

    if (data && data.success) {
      return dispatch(fetchLatestForEveryone('Fetch Started'));
    }

    return dispatch(fetchLatestForEveryone('Last fetch less than 10 min'));
  } catch (e) {
    return dispatch('Error Fetching');
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
