// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SocketIO from 'socket.io-client';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// Config
import Config from '../config/config';

// Constants
import { FETCH_PLAYERS, FETCHING_LATEST_STATS_PLAYERS } from '../redux/constants/players.constants';

// Utils
import { getCookie, setCookie, removeCookie } from '../utils/cookie';
import { formatDate } from '../utils/commonHelpers';

// Components
import Drawer from '../components/drawer';
import Layout from '../components/layout';

// Actions
import {
  fetchLatestStatsMatches,
  fetchPlayers,
} from '../redux/actions/players.actions';

let socketUrl = Config.production.socket.url;
if (process.env.NODE_ENV === 'development') {
  socketUrl = Config.dev.socket.url;
}

const styles = (theme) => ({
  root: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  paper: {
    width: 250,
    height: 430,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
});

const not = (a, b) => a.filter((value) => b.indexOf(value) === -1);

const intersection = (a, b) => a.filter((value) => b.indexOf(value) !== -1);

class Settings extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleAllRight = this.handleAllRight.bind(this);
    this.handleAllLeft = this.handleAllLeft.bind(this);
    this.handleCheckedRight = this.handleCheckedRight.bind(this);
    this.handleCheckedLeft = this.handleCheckedLeft.bind(this);

    const right = [];
    const left = [];
    const checked = [];
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    this.state = {
      checked,
      currentlyFetching: undefined,
      left,
      leftChecked,
      right,
      rightChecked,
    };
  }

  componentDidMount() {
    const {
      fetchPlayers: propsFetchPlayers,
    } = this.props;

    propsFetchPlayers();

    this.socket = SocketIO(`${socketUrl}`);
    this.socket.on('fetchingData', (data) => {
      this.setState({
        currentlyFetching: data,
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      type,
    } = nextProps;

    let tmpLeft = [];

    const cookiePlayers = getCookie('players');
    let tmpRight = [];
    if (nextProps.players.length > 0) {
      tmpRight = cookiePlayers !== undefined ? JSON.parse(cookiePlayers) : [];
    }

    if (nextProps.players !== undefined) {
      tmpLeft = nextProps.players
        .filter((left) => (
          tmpRight.indexOf(left.gamertag) === -1 && prevState.left.indexOf(left.gamerTag) === -1
        ))
        .map((left) => left.gamertag);
    }

    if (type === FETCH_PLAYERS) {
      return {
        isFetching: nextProps.isFetching,
        lastFetch: nextProps.lastFetch,
        left: tmpLeft,
        right: tmpRight,
      };
    }

    if (type === FETCHING_LATEST_STATS_PLAYERS) {
      return {
        lastFetch: prevState.lastFetch,
        message: nextProps.message,
      };
    }

    return {};
  }

  formatLastFetch = (lastFetchEpoch) => {
    const {
      currentlyFetching,
    } = this.state;

    if (lastFetchEpoch === undefined) {
      return '';
    }

    let lastFetchDate = new Date(lastFetchEpoch);
    lastFetchDate = formatDate(lastFetchDate);

    if (currentlyFetching === undefined || currentlyFetching === '') {
      return `Last Fetch: ${lastFetchDate}`;
    }

    return `Fetching: ${currentlyFetching}`;
  }

  fetchLatestClicked = () => {
    const {
      fetchLatestStatsMatches: fetchLatestStatsMatchesProps,
    } = this.props;

    fetchLatestStatsMatchesProps();
  }

  handleToggle(value) {
    const {
      right,
      left,
      checked,
    } = this.state;

    const currentIndex = checked.indexOf(value);

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
      rightChecked: intersection(newChecked, right),
      leftChecked: intersection(newChecked, left),
    });
  }

  handleAllRight() {
    const {
      right,
      left,
    } = this.state;

    setCookie(window.location.pathname, 'players', right.concat(left));

    this.setState({
      right: right.concat(left),
      left: [],
      checked: [],
    });
  }

  handleCheckedRight() {
    const {
      right,
      left,
      checked,
      leftChecked,
    } = this.state;

    setCookie(window.location.pathname, 'players', right.concat(leftChecked));

    this.setState({
      right: right.concat(leftChecked),
      left: not(left, leftChecked),
      checked: not(checked, leftChecked),
      leftChecked: [],
    });
  }

  handleCheckedLeft() {
    const {
      right,
      left,
      checked,
      rightChecked,
    } = this.state;

    setCookie(window.location.pathname, 'players', not(right, rightChecked));

    this.setState({
      left: left.concat(rightChecked),
      right: not(right, rightChecked),
      checked: not(checked, rightChecked),
      rightChecked: [],
    });
  }

  handleAllLeft() {
    const {
      right,
      left,
    } = this.state;

    removeCookie('players');

    this.setState({
      left: left.concat(right),
      right: [],
      checked: [],
    });
  }

  customList(items) {
    const {
      checked,
    } = this.state;

    const {
      classes,
    } = this.props;

    return (
      <Paper className={classes.paper}>
        <List dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <ListItem key={value} role="listitem" button onClick={() => this.handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Paper>
    );
  }

  render() {
    const {
      currentlyFetching,
      lastFetch,
      left,
      leftChecked,
      right,
      rightChecked,
    } = this.state;

    const {
      classes,
      message,
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
                Settings
              </Typography>
              <Card className={classes.root} style={{ maxWidth: 350 }}>
                <CardContent>
                  <Grid container justify="center" alignItems="center" direction="column" className={classes.root}>
                    <Typography
                      variant="h6"
                      component="h1"
                      gutterBottom
                    >
                      Fetch Latest Stats
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.fetchLatestClicked()}
                    >
                      Fetch Now
                    </Button>
                    <Typography
                      variant="subtitle2"
                      component="h1"
                      gutterBottom
                      style={{ marginTop: 10 }}
                    >
                      {this.formatLastFetch(lastFetch)}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="h1"
                      gutterBottom
                      style={{
                        marginTop: 10,
                        display: (message === 'Last fetch less than 10 min' ? 'block' : 'none'),
                        color: (message === 'Last fetch less than 10 min' ? 'red' : 'green'),
                      }}
                    >
                      {message}
                    </Typography>
                  </Grid>
                </CardContent>
              </Card>
              <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    component="h1"
                    gutterBottom
                  >
                    Hide these:
                  </Typography>
                  {this.customList(left)}
                </Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={this.handleAllRight}
                      disabled={left.length === 0}
                      aria-label="move all right"
                    >
                      ≫
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={this.handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={this.handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={this.handleAllLeft}
                      disabled={right.length === 0}
                      aria-label="move all left"
                    >
                      ≪
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    component="h1"
                    gutterBottom
                  >
                    Show these:
                  </Typography>
                  {this.customList(right)}
                </Grid>
              </Grid>
              <Card className={classes.root} style={{ maxWidth: 550 }}>
                <CardContent>
                  <Grid container justify="center" alignItems="center" direction="column" className={classes.root}>
                    <Typography
                      variant="h6"
                      component="h1"
                      gutterBottom
                    >
                      oCa Calculation:
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h1"
                      gutterBottom
                    >
                      1 kill = 5 points
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h1"
                      gutterBottom
                    >
                      1 down (d - k) = 2 points
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h1"
                      gutterBottom
                    >
                      100 damage = 1 point
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h1"
                      gutterBottom
                    >
                      1 cache opened = 0.2 point
                    </Typography>
                    <Typography
                      variant="body1"
                      component="h1"
                      gutterBottom
                    >
                      Placement:
                    </Typography>
                    <Grid container spacing={2} justify="center" alignItems="flex-start" direction="row" className={classes.root}>
                      <Grid item>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &#9642; Solos
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 1st place = 50 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 2nd / 3rd place = 40 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 4th / 5th place = 35 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 6th - 10th place = 30 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 11th - 20th place = 20 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 21st - 50th place = 10 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 51st - 100th place = 5 points
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &#9642; Threes/Quads
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 1st place = 50 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 2rd place = 40 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 3rd place = 35 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 4th / 5th place = 30 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 6th - 10th place = 20 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 10th - 15th place = 10 points
                        </Typography>
                        <Typography
                          variant="body2"
                          component="h1"
                          gutterBottom
                        >
                          &ensp; &#9642; 15th - 20th place = 5 points
                        </Typography>
                      </Grid>
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

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchLatestStatsMatches: PropTypes.func.isRequired,
  fetchPlayers: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastFetch: PropTypes.number,
  message: PropTypes.string,
  players: PropTypes.array,
  type: PropTypes.string.isRequired,
};

Settings.defaultProps = {
  lastFetch: undefined,
  message: '',
  players: [],
};

const mapStateToProps = (state) => (
  {
    isFetching: state.players.isFetching,
    lastFetch: state.players.lastFetch,
    message: state.players.message,
    players: state.players.players,
    type: state.players.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchLatestStatsMatches: () => {
      dispatch(fetchLatestStatsMatches());
    },
    fetchPlayers: () => {
      dispatch(fetchPlayers());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(Settings));