import {
  RESTORE_FETCH_BLOG_STATE,
  FETCH_BLOG_POSTS,
  IS_FETCHING_BLOG_POSTS,
  CREATE_BLOG_POST,
  IS_CREATING_BLOG_POST,
} from '../constants/blog.constants';

import config from '../../config/config';

let apiUrl = config.production.api.url;
if (process.env.NODE_ENV === 'development') {
  apiUrl = config.dev.api.url;
}

export const fetchBlogPostsAction = (posts) => (
  {
    type: FETCH_BLOG_POSTS,
    posts,
  }
);

export const isFetchingBlogPostsAction = (isFetching) => (
  {
    type: IS_FETCHING_BLOG_POSTS,
    value: isFetching,
  }
);

export const restoreState = (fetchBlogState) => (
  {
    type: RESTORE_FETCH_BLOG_STATE,
    payload: fetchBlogState,
  }
);

export const createBlogPostAction = (data) => (
  {
    type: CREATE_BLOG_POST,
    data,
  }
);

export const isCreatingBlogPostAction = (isCreatingPost) => (
  {
    type: IS_CREATING_BLOG_POST,
    value: isCreatingPost,
  }
);

export const fetchBlogPosts = () => async (dispatch) => {
  try {
    dispatch(isFetchingBlogPostsAction(true));

    const res = await fetch(`${apiUrl}/api/blog/posts`);
    const data = await res.json();

    dispatch(fetchBlogPostsAction(data.posts));
  } catch (e) {
    dispatch(isFetchingBlogPostsAction(false));
  }
};

export const createBlogPost = (author, headerImage, title, content, password) => async (dispatch) => {
  try {
    dispatch(isCreatingBlogPostAction(true));

    const res = await fetch(`${apiUrl}/api/blog/post`, {
      method: 'POST',
      headers: {
        Authorization: password,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author,
        headerImage,
        title,
        content,
      }),
    });

    const data = await res.json();

    if (data && data.success) {
      return dispatch(createBlogPostAction({
        success: true,
      }));
    }

    return dispatch(isCreatingBlogPostAction(false));
  } catch (e) {
    return dispatch(isCreatingBlogPostAction(false));
  }
};

export const restore = (savedState) => (dispatch) => {
  dispatch(restoreState(savedState));
};
