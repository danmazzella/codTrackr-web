import {
  RESTORE_FETCH_BLOG_STATE,
  FETCH_BLOG_POSTS,
  IS_FETCHING_BLOG_POSTS,
  CREATE_BLOG_POST,
  IS_CREATING_BLOG_POST,
} from '../constants/blog.constants';

const initialState = {
  createData: {},
  isCreating: false,
  isFetching: false,
  posts: [],
  type: '',
};

const fetchBlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_BLOG_POSTS:
      return {
        type: IS_FETCHING_BLOG_POSTS,
        isFetching: action.value,
        posts: [],
      };

    case FETCH_BLOG_POSTS:
      return {
        type: FETCH_BLOG_POSTS,
        isFetching: false,
        posts: action.posts,
      };

    case CREATE_BLOG_POST:
      return {
        type: CREATE_BLOG_POST,
        isCreating: false,
        createData: action.data,
      };

    case IS_CREATING_BLOG_POST:
      return {
        type: IS_CREATING_BLOG_POST,
        isCreating: action.value,
        createData: {},
      };

    case RESTORE_FETCH_BLOG_STATE:
      return {
        type: RESTORE_FETCH_BLOG_STATE,
        createData: action.createData,
        isFetching: false,
        isCreating: false,
        posts: action.posts,
      };

    default:
      return state;
  }
};

export default fetchBlogReducer;
