// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

// Material UI Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

// Material UI Icons

// Utils
import { getCookie } from '../utils/cookie';

// Components
import Layout from '../components/layout';
import ListBody from '../components/ListBody';
import Drawer from '../components/drawer';

import { FETCH_LIFETIME_STATS } from '../redux/constants/lifetimeStats.constants';

import {
  fetchLifetimeStats,
} from '../redux/actions/lifetimeStats.actions';

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

const headCells = [
  {
    id: 'gamertag', label: 'Gamertag',
  },
  {
    id: 'kills', label: 'Kills',
  },
  {
    id: 'downs', label: 'Downs',
  },
  {
    id: 'deaths', label: 'Deaths',
  },
  {
    id: 'kdRatio', label: 'K/D Ratio',
  },
  {
    id: 'killsPerGame', label: 'Kills Per Game',
  },
  {
    id: 'gamesPlayed', label: 'Games Played',
  },
  {
    id: 'timePlayed', label: 'Time Played (Hr)',
  },
  {
    id: 'wins', label: 'BR Wins',
  },
  {
    id: 'winPercent', label: 'BR Win %',
  },
  {
    id: 'avgOcaScore', label: 'Avg oCaScore',
  },
  {
    id: 'highestOcaScore', label: 'Highest oCaScore',
  },
];

const calculateTimePlayed = (timePlayedSec) => {
  const timePlayedMin = timePlayedSec / 60;
  const timePlayedHr = timePlayedMin / 60;

  let timePlayedStr;
  if (timePlayedHr >= 24) {
    // Format days and hours
    const numDays = Math.floor(timePlayedHr / 24);
    const numHours = Math.floor(timePlayedHr - (numDays * 24));
    const dayOrDays = numDays === 1 ? 'day' : 'days';
    const hourOrHours = numHours === 1 ? 'hour' : 'hours';
    timePlayedStr = `${numDays} ${dayOrDays} ${numHours} ${hourOrHours}`;
  } else if (timePlayedHr < 24) {
    // Format hour
    const numHours = Math.floor(timePlayedHr);
    const numMin = Math.floor(timePlayedMin - (numHours * 60));
    const hourOrHours = numHours === 1 ? 'hour' : 'hours';
    timePlayedStr = `${numHours} ${hourOrHours} ${numMin} min`;
  } else {
    // Format minutes
    timePlayedStr = `${Math.floor(timePlayedMin)} min`;
  }

  return timePlayedStr;
};

const getTableRows = (lifetimeStats) => {
  const data = [];
  lifetimeStats.map((stats) => {
    const rowData = [
      stats.gamertag,
      stats.kills,
      stats.downs,
      stats.deaths,
      stats.kdRatio.toFixed(2),
      stats.killsPerGame.toFixed(2),
      stats.gamesPlayed,
      calculateTimePlayed(stats.timePlayed),
      stats.wins,
      (stats.winPercent * 100).toFixed(2).toString().concat('%'),
      stats.avgOcaScore.toFixed(2),
      stats.highestOcaScore,
    ];
    return data.push(rowData);
  });

  return data;
};

class LifetimeStats extends Component {
  constructor(props) {
    super(props);

    const players = getCookie('players');

    this.state = {
      data: [],
      modeTypeFilter: 'br',
      pageNumber: 1,
      pageSize: 25,
      players,
      sortColumn: 'avgOcaScore',
      sortDir: 'desc',
    };
  }

  componentDidMount() {
    const {
      fetchLifetimeStats: propsFetchLifetimeStats,
    } = this.props;

    const {
      pageNumber,
      pageSize,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    let page = this.getFromSearchParam('page');
    if (page === null) {
      page = pageNumber;
    }

    let tmpModeType = this.getFromSearchParam('modeType');
    if (tmpModeType === null || tmpModeType === undefined) {
      tmpModeType = 'br';
    }

    propsFetchLifetimeStats(tmpModeType, page, pageSize, players, sortColumn, sortDir);
  }

  static getDerivedStateFromProps(nextProps) {
    const data = getTableRows(nextProps.lifetimeStats);

    if (nextProps.type === FETCH_LIFETIME_STATS) {
      return {
        data,
        isFetching: nextProps.isFetching,
        lifetimeStats: nextProps.lifetimeStats,
        totalCount: nextProps.totalCount,
        modeTypeFilter: nextProps.modeType,
      };
    }
    return {};
  }

  getFromSearchParam = (paramName) => {
    const searchParams = window.location.search;
    const jsonParams = new URLSearchParams(searchParams);
    return jsonParams.get(paramName);
  }

  addToSearchParam(paramName, paramValue) {
    const {
      router,
    } = this.props;

    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set(paramName, paramValue);
    router.push(`${window.location.pathname}?${currentUrlParams.toString()}`);
  }

  removeFromSearchParam(paramName) {
    const {
      router,
    } = this.props;

    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.delete(paramName);
    router.push(`${window.location.pathname}?${currentUrlParams.toString()}`);
  }

  // handleChange(event) {
  //   const {
  //     fetchLifetimeStats: propsFetchLifetimeStats,
  //   } = this.props;

  //   const {
  //     pageSize,
  //     players,
  //   } = this.state;

  //   const newModeType = event.target.value;

  //   this.setState({
  //     modeTypeFilter: newModeType,
  //     pageNumber: 1,
  //   });

  //   this.removeFromSearchParam('page');
  //   this.addToSearchParam('modeType', newModeType);

  //   propsFetchLifetimeStats(newModeType, 1, pageSize, players);
  // }

  handleSortChange = (newSortColumn, newSortDir) => {
    const {
      fetchLifetimeStats: propsFetchLifetimeStats,
    } = this.props;

    const {
      modeType,
      pageNumber,
      pageSize,
      players,
    } = this.state;

    this.setState({
      sortColumn: newSortColumn,
      sortDir: newSortDir,
    });
    propsFetchLifetimeStats(modeType, pageNumber, pageSize, players, newSortColumn, newSortDir);
  }

  handlePageChange = (newPageNumber) => {
    const {
      fetchLifetimeStats: propsFetchLifetimeStats,
    } = this.props;

    const {
      modeType,
      pageSize,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    this.setState({ pageNumber: newPageNumber + 1 });
    propsFetchLifetimeStats(modeType, newPageNumber + 1, pageSize, players, sortColumn, sortDir);
  }

  handlePageSizeChange = (newPageSize) => {
    const {
      modeType,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    const {
      fetchLifetimeStats: propsFetchLifetimeStats,
    } = this.props;

    this.setState({
      pageSize: newPageSize,
    });
    propsFetchLifetimeStats(modeType, 1, newPageSize, players, sortColumn, sortDir);
  }

  render() {
    const {
      data,
      modeTypeFilter,
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
              {/* <Grid
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
                  Lifetime Stats
                </Typography>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-outlined-label">Match Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={modeTypeFilter}
                    onChange={this.handleChange}
                    label="matchType"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="solos">Battle Royal</MenuItem>
                    <MenuItem value="threes">Plunder</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <ListBody
                data={data}
                changePage={this.handlePageChange}
                changePageSize={this.handlePageSizeChange}
                changeSort={this.handleSortChange}
                collapsable={false}
                headers={headCells}
                toolbarName="Battle Royal Stats"
                totalCount={totalCount}
              />
            </Box>
          </Container>
        </Drawer>
      </Layout>
    );
  }
}

LifetimeStats.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchLifetimeStats: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lifetimeStats: PropTypes.array,
  modeType: PropTypes.string,
  router: PropTypes.object.isRequired,
  totalCount: PropTypes.number,
  type: PropTypes.string.isRequired,
};

LifetimeStats.defaultProps = {
  lifetimeStats: [],
  modeType: 'br',
  totalCount: 0,
};

const mapStateToProps = (state) => (
  {
    isFetching: state.lifetimeStats.isFetching,
    lifetimeStats: state.lifetimeStats.lifetimeStats,
    modeType: state.lifetimeStats.modeType,
    totalCount: state.lifetimeStats.totalCount,
    type: state.lifetimeStats.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchLifetimeStats: (modeType, pageNumber, pageSize, sortColumn, sortDir, players) => {
      dispatch(fetchLifetimeStats(modeType, pageNumber, pageSize, sortColumn, sortDir, players));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(LifetimeStats)));
