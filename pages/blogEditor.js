// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';


// Constants
import { CREATE_BLOG_POST } from '../redux/constants/blog.constants';

// Utils

// Components
import Drawer from '../components/drawer';
import Layout from '../components/layout';

// Actions
import {
  createBlogPost,
} from '../redux/actions/blog.actions';

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

class BlogEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 'write',
      title: '',
      content: 'Hello World',
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isCreating,
      type,
    } = nextProps;

    if (type === CREATE_BLOG_POST) {
      return {
        isCreating,
        content: '',
      };
    }

    return {};
  }

  clickedCreateBlogPost() {
    const {
      author,
      content,
      imageUrl,
      password,
      title,
    } = this.state;

    const {
      createBlogPost: propsCreateBlogPost,
    } = this.props;

    propsCreateBlogPost(author, imageUrl, title, content, password);
  }


  render() {
    const {
      selectedTab,
      content,
    } = this.state;

    const {
      classes,
    } = this.props;

    return (
      <Layout>
        <Drawer>
          <Container maxWidth="lg">
            <Box my={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
              >
                Blog Editor
              </Typography>
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
                      onChange={(e) => this.setState({ title: e.target.value })}
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
                      onChange={(e) => this.setState({ author: e.target.value })}
                      style={{
                        width: '100%',
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    />
                    <TextField
                      id="outlined-required"
                      label="Header Image"
                      variant="outlined"
                      onChange={(e) => this.setState({ imageUrl: e.target.value })}
                      style={{
                        width: '100%',
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    />
                    <TextField
                      required
                      id="outlined-required"
                      label="Password"
                      variant="outlined"
                      onChange={(e) => this.setState({ password: e.target.value })}
                      style={{
                        width: '100%',
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    />
                    <ReactMde
                      value={content}
                      onChange={(newContent) => this.setState({ content: newContent })}
                      selectedTab={selectedTab}
                      onTabChange={(newTab) => this.setState({ selectedTab: newTab })}
                      generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                    />
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.clickedCreateBlogPost()}
                        style={{ marginTop: 20 }}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Drawer>
      </Layout>
    );
  }
}

BlogEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  isCreating: PropTypes.bool.isRequired,
  createBlogPost: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

BlogEditor.defaultProps = {
};

const mapStateToProps = (state) => (
  {
    isCreating: state.blog.isCreating,
    type: state.blog.type,
  }
);

const mapActions = (dispatch) => (
  {
    createBlogPost: (author, headerImage, title, content, password) => {
      dispatch(createBlogPost(author, headerImage, title, content, password));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(BlogEditor));