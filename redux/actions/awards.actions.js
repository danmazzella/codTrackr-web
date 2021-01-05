import {
  RESTORE_FETCH_AWARDS_STATE,
  FETCH_AWARDS,
  IS_FETCHING_AWARDS,
} from '../constants/awards.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchAwardsAction = (awards) => (
  {
    type: FETCH_AWARDS,
    awards,
  }
);

export const isFetchingAwardsAction = (isFetching) => (
  {
    type: IS_FETCHING_AWARDS,
    value: isFetching,
  }
);

export const restoreState = (fetchBlogState) => (
  {
    type: RESTORE_FETCH_AWARDS_STATE,
    payload: fetchBlogState,
  }
);

export const fetchAwards = () => async (dispatch) => {
  try {
    dispatch(isFetchingAwardsAction(true));

    const res = await fetch(`${apiUrl}/api/players/awards`);
    const data = await res.json();

    dispatch(fetchAwardsAction(data.awards));
  } catch (e) {
    dispatch(isFetchingAwardsAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
