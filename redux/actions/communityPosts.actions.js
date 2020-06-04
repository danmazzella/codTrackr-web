import {
  RESTORE_FETCH_COMMUNITY_POSTS_STATE,
  FETCH_COMMUNITY_POSTS,
  IS_FETCHING_COMMUNITY_POSTS,
  CREATE_COMMUNITY_POSTS,
  IS_CREATING_COMMUNITY_POSTS,
} from '../constants/communityPosts.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchCommunityPostsAction = (posts) => (
  {
    type: FETCH_COMMUNITY_POSTS,
    posts,
  }
);

export const isFetchingCommunityPostsAction = (isFetching) => (
  {
    type: IS_FETCHING_COMMUNITY_POSTS,
    value: isFetching,
  }
);

export const restoreState = (fetchCommunityPostsState) => (
  {
    type: RESTORE_FETCH_COMMUNITY_POSTS_STATE,
    payload: fetchCommunityPostsState,
  }
);

export const createCommunityPostsAction = (data) => (
  {
    type: CREATE_COMMUNITY_POSTS,
    data,
  }
);

export const isCreatingCommunityPostsAction = (isCreatingPost) => (
  {
    type: IS_CREATING_COMMUNITY_POSTS,
    value: isCreatingPost,
  }
);

export const fetchCommunityPosts = () => async (dispatch) => {
  try {
    dispatch(isFetchingCommunityPostsAction(true));

    const res = await fetch(`${apiUrl}/api/communityPosts/posts`);
    const data = await res.json();

    dispatch(fetchCommunityPostsAction(data.posts));
  } catch (e) {
    dispatch(isFetchingCommunityPostsAction(false));
  }
};

export const createCommunityPosts = (author, title, content) => async (dispatch) => {
  try {
    dispatch(isCreatingCommunityPostsAction(true));

    const res = await fetch(`${apiUrl}/api/communityPosts/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author,
        title,
        content,
      }),
    });

    const data = await res.json();

    if (data && data.success) {
      return dispatch(createCommunityPostsAction({
        success: true,
      }));
    }

    return dispatch(isCreatingCommunityPostsAction(false));
  } catch (e) {
    return dispatch(isCreatingCommunityPostsAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
