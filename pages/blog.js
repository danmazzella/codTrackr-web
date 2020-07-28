// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// Constants
import { FETCH_BLOG_POSTS } from '../redux/constants/blog.constants';

// Utils
import { formatDate } from '../utils/commonHelpers';

// Components
import Drawer from '../components/drawer';
import Layout from '../components/layout';

// Actions
import {
  fetchBlogPosts,
} from '../redux/actions/blog.actions';

const styles = (theme) => ({
  root: {
    margin: 'auto',
  },
  '@global': {
    img: {
      maxHeight: '200px',
      maxWidth: '500px',
    },
  },
});

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    const {
      fetchBlogPosts: propsFetchBlogPosts,
    } = this.props;

    propsFetchBlogPosts();
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isFetching,
      posts,
      type,
    } = nextProps;

    if (type === FETCH_BLOG_POSTS) {
      return {
        isFetching,
        posts,
      };
    }

    return {};
  }

  render() {
    const {
      classes,
      posts,
    } = this.props;

    return (
      <Layout>
        <Drawer>
          <Container maxWidth="sm">
            <Box my={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
              >
                Announcements
              </Typography>
              {
                posts.map((post) => (
                  <Card
                    className={classes.root}
                    style={{ maxWidth: 550, marginTop: 10, marginBottom: 10 }}
                    key={post._id}
                  >
                    <CardContent>
                      {/* <div
                          style={{
                            width: '100%',
                            height: '125px',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <img
                            style={{
                              position: 'absolute',
                              left: '-100%',
                              right: '-100%',
                              top: '-100%',
                              bottom: '-100%',
                              margin: 'auto',
                              height: 'auto',
                              width: 'auto',
                            }}
                            src={post.headerImage}
                          />
                        </div> */}
                      <Typography
                        variant="h4"
                      >
                        {post.title}
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        style={{ marginTop: 10, marginBottom: 10 }}
                      >
                        <Typography
                          variant="body2"
                        >
                          Author: {post.author}
                        </Typography>
                        <Typography
                          variant="body2"
                        >
                          {formatDate(new Date(post.epochTime))}
                        </Typography>
                      </Grid>
                      <Divider />
                      <ReactMarkdown
                        source={post.content}
                      />
                    </CardContent>
                  </Card>
                ))
              }
            </Box>
          </Container>
        </Drawer>
      </Layout >
    );
  }
}

Blog.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchBlogPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

Blog.defaultProps = {};

const mapStateToProps = (state) => (
  {
    isFetching: state.blog.isFetching,
    posts: state.blog.posts,
    type: state.blog.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchBlogPosts: () => {
      dispatch(fetchBlogPosts());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(Blog));