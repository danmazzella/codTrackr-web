// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

// Material UI Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Material UI Lab
import Pagination from '@material-ui/lab/Pagination';

// Utils
import { getCookie } from '../utils/cookie';

// Components
import Layout from '../components/layout';
import Drawer from '../components/drawer';

// Reducer Constants
import { FETCH_MATCHES } from '../redux/constants/recentMatches.constants';


import {
  formatDate,
  getTotalDowns,
  getTotalKills,
  shouldAddDivider,
  numberWithCommas,
  getPlayerNames,
} from '../utils/commonHelpers';

import {
  fetchMatches,
} from '../redux/actions/recentMatches.actions';

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class Matches extends Component {
  constructor(props) {
    super(props);

    const players = getCookie('players');

    this.state = {
      modeTypeFilter: 'all',
      friendsFilter: 'friends',
      pageNumber: 1,
      pageSize: 25,
      players,
    };
  }

  componentDidMount() {
    const {
      fetchMatches: propsFetchMatches,
    } = this.props;

    const {
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

    propsFetchMatches(tmpModeType, page, pageSize, tmpFriendsFilter);
  }

  static getDerivedStateFromProps(nextProps) {
    let tmpFriendsFilter = 'friends';
    let filterPlayers = nextProps.players;
    if (nextProps.players === undefined) {
      tmpFriendsFilter = 'all';
      filterPlayers = undefined;
    }

    if (nextProps.type === FETCH_MATCHES) {
      return {
        friendsFilter: tmpFriendsFilter,
        isFetching: nextProps.isFetching,
        matches: nextProps.matches,
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

  handleFilterChange = (event) => {
    const {
      modeTypeFilter,
      pageSize,
    } = this.state;

    const {
      fetchMatches: propsFetchMatches,
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

    propsFetchMatches(modeTypeFilter, 1, pageSize, filterGroup);
  }

  handleMatchTypeChange = (event) => {
    const {
      fetchMatches: propsFetchMatches,
    } = this.props;

    const {
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

    propsFetchMatches(newModeType, 1, pageSize, players);
  }

  onPageChanged = (event, data) => {
    const {
      fetchMatches: propsFetchMatches,
    } = this.props;

    const {
      modeTypeFilter,
      pageSize,
      players,
    } = this.state;

    this.setState({ pageNumber: data });

    this.bulkAddRemoveSearchParam([
      { action: 'add', param: 'page', value: data },
    ]);

    propsFetchMatches(modeTypeFilter, data, pageSize, players);
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

  loadMatchTiles = () => {
    const {
      matches,
    } = this.props;

    if (matches === undefined) {
      return null;
    }

    return (
      matches.map((match) => (
        <div style={{ margin: '20px' }} key={match._id}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="root"
              style={{ background: '#BEBEBE' }}
            >
              <div style={{ flexGrow: 1 }}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid
                    item
                    xs={1}
                  >
                    <div style={{ width: 36 }}>
                      <p
                        style={this.getPlacementColor(match.placement)}
                      >
                        {match.placement}
                      </p>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                  >
                    <Grid
                      container
                      direction="column"
                      alignContent="flex-start"
                    >
                      <p
                        style={{
                          margin: 2,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                      >
                        {getPlayerNames(match)}
                      </p>
                      <p
                        style={{
                          margin: 2,
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}
                      >
                        {match.modeType}
                      </p>
                      <p
                        style={{
                          margin: 2,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {formatDate(new Date(match.matchTime))}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                  >
                    <Grid container justify="space-evenly" direction="row">
                      <Grid style={{ marginLeft: 6, marginRight: 6 }}>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>Duration:</p>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>{Math.max(...match.matches.map((singleMatch) => (singleMatch.stats.timePlayedSeconds / 60).toFixed(2)))} min</p>
                      </Grid>
                      <Grid style={{ marginLeft: 6, marginRight: 6 }}>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>Kills:</p>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>{getTotalKills(match)}</p>
                      </Grid>
                      <Grid style={{ marginLeft: 6, marginRight: 6 }}>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>Downs:</p>
                        <p style={{ marginTop: 2, marginBottom: 2, textAlign: 'center' }}>{getTotalDowns(match)}</p>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ display: 'block', background: '#E0E0E0' }}>
              {
                match.matches.map((player, playerIdx) => (
                  <div style={{ flexGrow: 1 }} key={match._id.concat('-').concat(player.playerName)}>
                    <Typography variant="subtitle2" gutterBottom>
                      Player: {player.playerName}
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justify="space-around"
                      alignItems="center"
                    >
                      <Grid
                        items="true"
                        style={{ marginLeft: '25px', marginRight: '25px' }}
                      >
                        <p style={{ margin: '2px' }}>Kills: {player.stats.kills}</p>
                        <p style={{ margin: '2px' }}>Assists: {player.stats.assists}</p>
                        <p style={{ margin: '2px' }}>Downs: {
                          player.stats.downsInCircleOne + player.stats.downsInCircleTwo
                          + player.stats.downsInCircleThree + player.stats.downsInCircleFour
                          + player.stats.downsInCircleFive + player.stats.downsInCircleSix
                        }
                        </p>
                        <p style={{ margin: '2px' }}>Headshots: {player.stats.headshots}</p>
                        <p style={{ margin: '2px' }}>Executions: {player.stats.executions}</p>
                        <p style={{ margin: '2px' }}>Teams Wiped: {player.stats.teamsWiped}</p>
                        <p style={{ margin: '2px' }}>Time Moving: {player.stats.percentTimeMoving ? player.stats.percentTimeMoving.toFixed(2) : 0}%</p>
                      </Grid>
                      <Grid
                        items="true"
                        style={{ marginLeft: '25px', marginRight: '25px' }}
                      >
                        <p style={{ margin: '2px' }}>Damage Done: {player.stats.damageDone ? numberWithCommas(player.stats.damageDone) : 0}</p>
                        <p style={{ margin: '2px' }}>Damage Taken: {player.stats.damageTaken ? numberWithCommas(player.stats.damageTaken) : 0}</p>
                        <p style={{ margin: '2px' }}>Distance Traveled: {player.stats.distanceTraveled ? numberWithCommas(player.stats.distanceTraveled) : 0}</p>
                        <p style={{ margin: '2px' }}>Last Stand Kills: {player.stats.lastStandKills}</p>
                        <p style={{ margin: '2px' }}>Caches Opened: {player.stats.cachesOpened}</p>
                        <p style={{ margin: '2px' }}>Kiosk Buys: {player.stats.kioskBuys}</p>
                        <p style={{ margin: '2px' }}>Revives: {player.stats.revives}</p>
                      </Grid>
                      <Grid
                        items="true"
                        style={{ marginLeft: '25px', marginRight: '25px' }}
                      >
                        <p style={{ margin: '2px' }}>Downs Circle 1: {player.stats.downsInCircleOne}</p>
                        <p style={{ margin: '2px' }}>Downs Circle 2: {player.stats.downsInCircleTwo}</p>
                        <p style={{ margin: '2px' }}>Downs Circle 3: {player.stats.downsInCircleThree}</p>
                        <p style={{ margin: '2px' }}>Downs Circle 4: {player.stats.downsInCircleFour}</p>
                        <p style={{ margin: '2px' }}>Downs Circle 5: {player.stats.downsInCircleFive}</p>
                        <p style={{ margin: '2px' }}>Downs Circle 6: {player.stats.downsInCircleSix}</p>
                      </Grid>
                      <Grid
                        items="true"
                        style={{ marginLeft: '25px', marginRight: '25px' }}
                      >
                        <p style={{ margin: '2px', fontWeight: 'bold' }}>oCa Score: {player.stats.ocaScore}</p>
                      </Grid>
                    </Grid>
                    {
                      shouldAddDivider(match.matches, playerIdx)
                    }
                  </div>
                ))
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ))
    );
  }

  render() {
    const {
      modeTypeFilter,
      friendsFilter,
      pageNumber,
      pageSize,
    } = this.state;

    const {
      classes,
      totalCount,
    } = this.props;

    return (
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
                  Recent Matches
                </Typography>
                <Grid>
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
                  <FormControl
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
                      <MenuItem value="duos">Duos</MenuItem>
                      <MenuItem value="threes">Threes</MenuItem>
                      <MenuItem value="quads">Quads</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {
                this.loadMatchTiles()
              }
              <Pagination
                count={Math.ceil(totalCount / pageSize)}
                page={pageNumber}
                onChange={this.onPageChanged}
              />
            </Box>
          </Container>
        </Drawer>
      </Layout>
    );
  }
}

Matches.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchMatches: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  matches: PropTypes.array,
  modeType: PropTypes.string,
  pageNumber: PropTypes.number,
  players: PropTypes.string,
  router: PropTypes.object.isRequired,
  totalCount: PropTypes.number,
  type: PropTypes.string,
};

Matches.defaultProps = {
  matches: [],
  modeType: 'all',
  pageNumber: 1,
  players: undefined,
  totalCount: 0,
  type: '',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.recentMatches.isFetching,
    matches: state.recentMatches.matches,
    modeType: state.recentMatches.modeType,
    pageNumber: state.recentMatches.pageNumber,
    players: state.recentMatches.players,
    totalCount: state.recentMatches.totalCount,
    type: state.recentMatches.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchMatches: (modeType, pageNumber, pageSize, players) => {
      dispatch(fetchMatches(modeType, pageNumber, pageSize, players));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(Matches)));
