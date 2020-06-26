// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

// Material UI Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

// Material UI Icons


// Material UI Lab
import Pagination from '@material-ui/lab/Pagination';

// Utils
import { getCookie } from '../utils/cookie';
import { calculateTimePlayed, normalizeMonthFilter } from '../utils/commonHelpers';

// Components
import Layout from '../components/layout';
import Drawer from '../components/drawer';

// Reducer Constants
import { FETCH_TOP_FIVE } from '../redux/constants/topFive.constants';

// Dialogs
import MatchInfoModal from '../components/matchDialog';

import {
  fetchTopFive,
} from '../redux/actions/topFive.actions';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class TopFive extends Component {
  constructor(props) {
    super(props);

    const players = getCookie('players');

    const thisDate = new Date();
    const thisMonth = thisDate.getMonth() + 1;
    const thisYear = thisDate.getFullYear();

    this.state = {
      modalMatchId: '',
      modeTypeFilter: 'all',
      monthFilter: `${thisMonth}/${thisYear}`,
      friendsFilter: 'friends',
      openMatch: false,
      pageNumber: 1,
      pageSize: 25,
      players,
    };
  }

  componentDidMount() {
    const {
      fetchTopFive: propsFetchTopFive,
    } = this.props;

    const {
      monthFilter,
      pageNumber,
      pageSize,
    } = this.state;

    const players = getCookie('players');

    let page = this.getFromSearchParam('page');
    if (page === null) {
      page = pageNumber;
    }

    let tmpFriendsFilter = this.getFromSearchParam('filterGroup');
    if (tmpFriendsFilter === null || tmpFriendsFilter === 'friends') {
      tmpFriendsFilter = players;
    } else if (tmpFriendsFilter === 'all') {
      tmpFriendsFilter = undefined;
    }

    let tmpModeType = this.getFromSearchParam('modeType');
    if (tmpModeType === null) {
      tmpModeType = 'all';
    }

    const matchId = this.getFromSearchParam('matchId');
    const gamertag = this.getFromSearchParam('gamertag');
    if (matchId !== undefined && matchId !== null && matchId !== '' && gamertag !== undefined && gamertag !== null && gamertag !== '') {
      this.handleModalIsOpening(gamertag, matchId);
    }

    propsFetchTopFive(
      tmpModeType, normalizeMonthFilter(monthFilter), page, pageSize, tmpFriendsFilter,
    );
  }

  static getDerivedStateFromProps(nextProps) {
    let tmpFriendsFilter = 'friends';
    let filterPlayers = nextProps.players;
    if (nextProps.players === undefined) {
      tmpFriendsFilter = 'all';
      filterPlayers = undefined;
    }

    if (nextProps.type === FETCH_TOP_FIVE) {
      return {
        friendsFilter: tmpFriendsFilter,
        isFetching: nextProps.isFetching,
        topFive: nextProps.topFive,
        modeTypeFilter: nextProps.modeType,
        pageNumber: nextProps.pageNumber,
        players: filterPlayers,
        totalCount: nextProps.totalCount,
      };
    }
    return {};
  }

  getFromSearchParam = (paramName) => {
    const searchParams = window.location.search;
    const jsonParams = new URLSearchParams(searchParams);
    return jsonParams.get(paramName);
  }

  bulkAddRemoveSearchParam = (actions) => {
    const {
      router,
    } = this.props;

    const currentUrlParams = new URLSearchParams(window.location.search);
    actions.forEach((action) => {
      if (action.action === 'remove') {
        currentUrlParams.delete(action.param);
      } else if (action.action === 'add') {
        currentUrlParams.set(action.param, action.value);
      }
    });
    router.push(`${window.location.pathname}?${currentUrlParams.toString()}`);
  }

  handleMonthChange = (event) => {
    const {
      friendsFilter,
      modeTypeFilter,
      pageSize,
    } = this.state;

    const {
      fetchTopFive: propsFetchTopFive,
    } = this.props;

    this.setState({
      monthFilter: event.target.value,
      pageNumber: 1,
    });

    let filterGroup = getCookie('players');
    if (friendsFilter === 'all') {
      filterGroup = undefined;
    }

    propsFetchTopFive(
      modeTypeFilter, normalizeMonthFilter(event.target.value), 1, pageSize, filterGroup,
    );
  }

  handleFilterChange = (event) => {
    const {
      modeTypeFilter,
      monthFilter,
      pageSize,
    } = this.state;

    const {
      fetchTopFive: propsFetchTopFive,
    } = this.props;

    this.setState({
      friendsFilter: event.target.value,
      pageNumber: 1,
    });

    let filterGroup = getCookie('players');
    if (event.target.value === 'all') {
      filterGroup = undefined;
    }

    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'page' },
      { action: 'add', param: 'filterGroup', value: event.target.value },
    ]);

    propsFetchTopFive(modeTypeFilter, normalizeMonthFilter(monthFilter), 1, pageSize, filterGroup);
  }

  handleMatchTypeChange = (event) => {
    const {
      fetchTopFive: propsFetchTopFive,
    } = this.props;

    const {
      monthFilter,
      pageSize,
      players,
    } = this.state;

    const newModeType = event.target.value;

    this.setState({
      modeTypeFilter: newModeType,
      pageNumber: 1,
    });

    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'page' },
      { action: 'add', param: 'modeType', value: newModeType },
    ]);

    propsFetchTopFive(newModeType, normalizeMonthFilter(monthFilter), 1, pageSize, players);
  }

  onPageChanged = (event, data) => {
    const {
      fetchTopFive: propsFetchTopFive,
    } = this.props;

    const {
      modeTypeFilter,
      monthFilter,
      pageSize,
      players,
    } = this.state;

    this.setState({ pageNumber: data });

    this.bulkAddRemoveSearchParam([
      { action: 'add', param: 'page', value: data },
    ]);

    propsFetchTopFive(modeTypeFilter, normalizeMonthFilter(monthFilter), data, pageSize, players);
  }

  getPlacementColor = (placement) => {
    const placementStyle = {
      margin: 2,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    };

    if (placement === 1) {
      placementStyle.color = 'green';
    } else if (placement <= 10) {
      placementStyle.color = 'yellow';
    }

    return placementStyle;
  }

  getMonthFilters = () => {
    const startMonth = 3;
    const startYear = 2020;

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    let tmpMonth = startMonth;
    let tmpYear = startYear;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthsArr = [{
      month: -1,
      year: -1,
      monthName: 'All',
    }];
    let current = false;

    do {
      monthsArr.push({
        month: tmpMonth,
        year: tmpYear,
        monthName: `${monthNames[tmpMonth - 1]}-${tmpYear}`,
      });

      if (tmpMonth === currentMonth && tmpYear === currentYear) {
        current = true;
      }

      tmpMonth += 1;
      if (tmpMonth > 12) {
        tmpMonth = 1;
        tmpYear += 1;
      }
    }
    while (current === false);

    return monthsArr.reverse();
  }

  handleModalIsOpening = (gamertag, matchId) => {
    this.bulkAddRemoveSearchParam([
      { action: 'add', param: 'matchId', value: matchId },
      { action: 'add', param: 'gamertag', value: gamertag },
    ]);

    this.setState({
      modalGamertag: gamertag,
      modalMatchId: matchId,
      openMatch: true,
    });
  }

  handleModalIsClosing = () => {
    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'matchId' },
      { action: 'remove', param: 'gamertag' },
    ]);

    this.setState({
      openMatch: false,
    });
  }

  loadTopFiveTiles = () => {
    const {
      topFive,
    } = this.props;

    if (topFive === undefined) {
      return null;
    }

    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        {
          topFive.map((match, index) => (
            <Grid
              container
              direction="column"
              justify="space-around"
              alignItems="center"
              key={match._id}
            >
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={2}
                style={{ marginTop: 5, marginBottom: 5 }}
              >
                <Grid item xs={2}>
                  <Paper elevation={5} style={{ height: 200 }}>
                    <Grid
                      container
                      direction="column"
                      justify="space-evenly"
                      alignItems="center"
                      style={{ height: 200 }}
                    >
                      <Grid item>
                        <Typography
                          variant="subtitle2"
                          component="h1"
                          style={{
                            wordBreak: 'break-word',
                            textAlign: 'center',
                            paddingLeft: 2,
                            paddingRight: 2,
                          }}
                        >
                          {match._id}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            component="h1"
                          >
                            Position:
                          </Typography>
                          <Typography
                            variant="body2"
                            component="h1"
                          >
                            {index + 1}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            component="h1"
                          >
                            Total oCa:
                          </Typography>
                          <Typography
                            variant="body2"
                            component="h1"
                          >
                            {match.totalOcaScore.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          direction="column"
                          justify="center"
                          alignItems="center"
                        >
                          <Typography
                            variant="caption"
                            component="h1"
                          >
                            Time Played:
                          </Typography>
                          <Typography
                            variant="body2"
                            component="h1"
                          >
                            {calculateTimePlayed(match.timePlayed)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                {
                  match.matches.map((singleMatch) => (
                    <Grid item key={singleMatch._id} xs={2}>
                      <Paper
                        style={{ height: 200 }}
                        onClick={() => this.handleModalIsOpening(singleMatch.playerName, singleMatch.matchId)}
                      >
                        <Grid
                          container
                          direction="column"
                          justify="space-around"
                          alignItems="center"
                          style={{ height: 200 }}
                        >
                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                component="h1"
                              >
                                Placement:
                              </Typography>
                              <Typography
                                variant="body2"
                                component="h1"
                              >
                                {singleMatch.placement}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                component="h1"
                              >
                                oCa Score:
                              </Typography>
                              <Typography
                                variant="body2"
                                component="h1"
                              >
                                {singleMatch.stats.ocaScore}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              direction="column"
                              justify="center"
                              alignItems="center"
                            >
                              <Typography
                                variant="caption"
                                component="h1"
                              >
                                Kills:
                              </Typography>
                              <Typography
                                variant="body2"
                                component="h1"
                              >
                                {singleMatch.stats.kills}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))
                }
              </Grid>
              <Grid item style={{ width: '100%', marginTop: 5, marginBottom: 5 }}>
                <Divider />
              </Grid>
            </Grid>
          ))
        }
      </Grid>
    );
  }

  render() {
    const {
      friendsFilter,
      modalGamertag,
      modalMatchId,
      monthFilter,
      pageNumber,
      pageSize,
      openMatch,
    } = this.state;

    const {
      classes,
      totalCount,
    } = this.props;

    const monthFilterData = this.getMonthFilters();

    return (
      <div>
        <Layout>
          <Drawer>
            <Container maxWidth="lg">
              <Box my={4}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  style={{ paddingLeft: 18, paddingRight: 12 }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                  >
                    Top 5 Leaderboard
                  </Typography>
                  <Grid>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">Month</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={monthFilter}
                        onChange={this.handleMonthChange}
                        label="monthFilter"
                      >
                        {monthFilterData.map((monthData) => (<MenuItem key={`${monthData.month}/${monthData.year}`} value={`${monthData.month}/${monthData.year}`}>{monthData.monthName}</MenuItem>))}
                      </Select>
                    </FormControl>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={friendsFilter}
                        onChange={this.handleFilterChange}
                        label="friendsFilter"
                      >
                        <MenuItem value="friends">Friends</MenuItem>
                        <MenuItem value="all">Everyone</MenuItem>
                      </Select>
                    </FormControl>
                    {/* <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">Match Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={modeTypeFilter}
                      onChange={this.handleMatchTypeChange}
                      label="matchType"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="solos">Solos</MenuItem>
                      <MenuItem value="threes">Threes</MenuItem>
                    </Select>
                  </FormControl> */}
                  </Grid>
                </Grid>
                <div style={{ minWidth: 730 }}>
                  {
                    this.loadTopFiveTiles()
                  }
                </div>
                <Pagination
                  count={Math.ceil(totalCount / pageSize)}
                  page={pageNumber}
                  onChange={this.onPageChanged}
                />
              </Box>
            </Container>
          </Drawer>
        </Layout>
        <MatchInfoModal
          gamertag={modalGamertag}
          matchId={modalMatchId}
          modalIsClosing={() => this.handleModalIsClosing()}
          open={openMatch}
        />
      </div>
    );
  }
}

TopFive.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchTopFive: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  topFive: PropTypes.array,
  modeType: PropTypes.string,
  pageNumber: PropTypes.number,
  players: PropTypes.string,
  router: PropTypes.object.isRequired,
  totalCount: PropTypes.number,
  type: PropTypes.string,
};

TopFive.defaultProps = {
  topFive: [],
  modeType: 'all',
  pageNumber: 1,
  players: undefined,
  totalCount: 0,
  type: '',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.topFive.isFetching,
    topFive: state.topFive.topFive,
    modeType: state.topFive.modeType,
    pageNumber: state.topFive.pageNumber,
    players: state.topFive.players,
    totalCount: state.topFive.totalCount,
    type: state.topFive.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchTopFive: (modeType, monthFilter, pageNumber, pageSize, players) => {
      dispatch(fetchTopFive(modeType, monthFilter, pageNumber, pageSize, players));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(TopFive)));
