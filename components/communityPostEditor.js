// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';


// Constants
import { CREATE_COMMUNITY_POSTS } from '../redux/constants/communityPosts.constants';

// Utils

// Actions
import {
  createCommunityPosts,
} from '../redux/actions/communityPosts.actions';

const styles = (theme) => ({
  root: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

class CommunityPostsEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: '',
      authorError: undefined,
      content: '',
      contentError: undefined,
      selectedTab: 'write',
      title: '',
      titleError: undefined,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isCreating,
      type,
    } = nextProps;

    if (type === CREATE_COMMUNITY_POSTS) {
      return {
        isCreating,
        content: '',
      };
    }

    return {};
  }

  clickedCreateCommunityPosts() {
    const {
      author,
      title,
      content,
    } = this.state;

    const {
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    let tmpTitleError;
    if (title === undefined || title.trim().length < 5) {
      tmpTitleError = 'Title must be must be 5 characters or more';
    }

    let tmpAuthorError;
    if (author === undefined || author.trim().length < 5) {
      tmpAuthorError = 'Author must be 5 characters or more';
    }

    let tmpContentError;
    if (content === undefined || content.trim().length < 10) {
      tmpContentError = 'Content must be 10 characters or more';
    }

    if (tmpTitleError !== undefined || tmpAuthorError !== undefined) {
      return this.setState({
        authorError: tmpAuthorError,
        titleError: tmpTitleError,
        contentError: tmpContentError,
      });
    }

    const {
      createCommunityPosts: propsCreateCommunityPosts,
    } = this.props;

    propsModalIsClosing(true);

    return propsCreateCommunityPosts(author, title, content);
  }

  handleClose = () => {
    const {
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    propsModalIsClosing();
  };

  render() {
    const {
      authorError,
      content,
      contentError,
      selectedTab,
      titleError,
    } = this.state;

    const {
      classes,
      open,
    } = this.props;

    return (
      <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Post Editor</DialogTitle>
        <DialogContent>
          <Card className={classes.root} style={{ maxWidth: 500 }}>
            <CardContent>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
              >
                <TextField
                  required
                  id="outlined-required"
                  label="Title"
                  variant="outlined"
                  onChange={(e) => this.setState({ title: e.target.value, titleError: undefined })}
                  error={!!titleError}
                  helperText={titleError}
                  style={{
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Author"
                  variant="outlined"
                  onChange={(e) => this.setState({ author: e.target.value, authorError: undefined })}
                  error={!!authorError}
                  helperText={authorError}
                  style={{
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <ReactMde
                  value={content}
                  onChange={(newContent) => this.setState({ content: newContent, contentError: undefined })}
                  selectedTab={selectedTab}
                  onTabChange={(newTab) => this.setState({ selectedTab: newTab })}
                  generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                />
                <p style={{ color: 'red' }}>{contentError}</p>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.clickedCreateCommunityPosts()}
                    style={{ marginTop: 20 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }
}

CommunityPostsEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  createCommunityPosts: PropTypes.func.isRequired,
  isCreating: PropTypes.bool,
  modalIsClosing: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

CommunityPostsEditor.defaultProps = {
  isCreating: false,
};

const mapStateToProps = (state) => (
  {
    isCreating: state.communityPosts.isCreating,
    type: state.communityPosts.type,
  }
);

const mapActions = (dispatch) => (
  {
    createCommunityPosts: (author, title, content) => {
      dispatch(createCommunityPosts(author, title, content));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(CommunityPostsEditor));