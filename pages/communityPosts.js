// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

// Material Icons
import EditIcon from '@material-ui/icons/Edit';

// Constants
import { FETCH_COMMUNITY_POSTS } from '../redux/constants/communityPosts.constants';

// Utils
import { formatDate } from '../utils/commonHelpers';

// Components
import CommunityPostEdit from '../components/communityPostEditor';
import Drawer from '../components/drawer';
import Layout from '../components/layout';

// Actions
import {
  fetchCommunityPosts,
} from '../redux/actions/communityPosts.actions';

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

class CommunityPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openEditor: false,
      posts: [],
      successSnackOpen: false,
    };
  }

  componentDidMount() {
    const {
      fetchCommunityPosts: propsFetchCommunityPosts,
    } = this.props;

    propsFetchCommunityPosts();
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isFetching,
      posts,
      type,
    } = nextProps;

    if (type === FETCH_COMMUNITY_POSTS) {
      return {
        isFetching,
        posts,
      };
    }

    return {};
  }

  handleModalIsOpening = () => {
    this.setState({
      openEditor: true,
    });
  }

  handleModalIsClosing = (isSubmitted) => {
    const {
      fetchCommunityPosts: propsFetchCommunityPosts,
    } = this.props;

    this.setState({
      openEditor: false,
      successSnackOpen: isSubmitted,
    });

    propsFetchCommunityPosts();
  }

  handleSnackClose = () => {
    this.setState({
      successSnackOpen: false,
    });
  }

  render() {
    const {
      openEditor,
      posts,
      successSnackOpen,
    } = this.state;

    const {
      classes,
    } = this.props;

    return (
      <div>
        <Layout>
          <Drawer>
            <Container maxWidth="sm">
              <Box my={4}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                  >
                    Community Posts
                  </Typography>
                  <EditIcon onClick={() => this.handleModalIsOpening()} />
                </Grid>
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
        </Layout>
        <CommunityPostEdit
          modalIsClosing={(isSubmitted = false) => this.handleModalIsClosing(isSubmitted)}
          open={openEditor}
        />
        <Snackbar open={successSnackOpen} autoHideDuration={3000} onClose={this.handleSnackClose}>
          <Alert severity="success">
            Email sent to Dan for approval!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

CommunityPosts.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  fetchCommunityPosts: PropTypes.func.isRequired,
  posts: PropTypes.array,
  type: PropTypes.string.isRequired,
};

CommunityPosts.defaultProps = {
  isFetching: false,
  posts: [],
};

const mapStateToProps = (state) => (
  {
    isFetching: state.communityPosts.isFetching,
    posts: state.communityPosts.posts,
    type: state.communityPosts.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchCommunityPosts: () => {
      dispatch(fetchCommunityPosts());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(CommunityPosts));