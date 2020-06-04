import {
  RESTORE_FETCH_COMMUNITY_POSTS_STATE,
  FETCH_COMMUNITY_POSTS,
  IS_FETCHING_COMMUNITY_POSTS,
  CREATE_COMMUNITY_POSTS,
  IS_CREATING_COMMUNITY_POSTS,
} from '../constants/communityPosts.constants';

const initialState = {
  createData: {},
  isCreating: false,
  isFetching: false,
  posts: [],
  type: '',
};

const fetchCommunityPostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_FETCHING_COMMUNITY_POSTS:
      return {
        type: IS_FETCHING_COMMUNITY_POSTS,
        isFetching: action.value,
        posts: [],
      };

    case FETCH_COMMUNITY_POSTS:
      return {
        type: FETCH_COMMUNITY_POSTS,
        isFetching: false,
        posts: action.posts,
      };

    case CREATE_COMMUNITY_POSTS:
      return {
        type: CREATE_COMMUNITY_POSTS,
        isCreating: false,
        createData: action.data,
      };

    case IS_CREATING_COMMUNITY_POSTS:
      return {
        type: IS_CREATING_COMMUNITY_POSTS,
        isCreating: action.value,
        createData: {},
      };

    case RESTORE_FETCH_COMMUNITY_POSTS_STATE:
      return {
        type: RESTORE_FETCH_COMMUNITY_POSTS_STATE,
        createData: action.createData,
        isFetching: false,
        isCreating: false,
        posts: action.posts,
      };

    default:
      return state;
  }
};

export default fetchCommunityPostsReducer;
