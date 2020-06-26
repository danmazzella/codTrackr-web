// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
// import ListBody from 'mazz-react-list';
import lzStringCompress from 'lz-string';
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
import { getCookie, setCookie, removeCookie } from '../utils/cookie';
import { calculateTimePlayed, normalizeMonthFilter } from '../utils/commonHelpers';

// Components
import Layout from '../components/layout';
import ListBody from '../components/ListBody';
import Drawer from '../components/drawer';

// Constants
import { FETCH_WEEK_MONTH_STATS } from '../redux/constants/weekMonthStats.constants';

// Actions
import {
  fetchWeekMonthStats,
} from '../redux/actions/weekMonthStats.actions';

// Dialogs
import ColumnSelectModal from '../components/columnSelectDialog';

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
    id: 'gamesPlayed', label: '# Games Played',
  },
  {
    id: 'timePlayed', label: 'Time Played',
  },
  {
    id: 'totalPlacements', label: 'Sum Placements', isHidden: true,
  },
  {
    id: 'wins', label: 'Sum Wins', isHidden: true,
  },
  {
    id: 'topTen', label: 'Sum Top Tens', isHidden: true,
  },
  {
    id: 'topFive', label: 'Sum Top Fives', isHidden: true,
  },
  {
    id: 'kills', label: 'Sum Kills', isHidden: true,
  },
  {
    id: 'deaths', label: 'Sum Deaths', isHidden: true,
  },
  {
    id: 'percentTimeMoving', label: 'Sum % Time Moving', isHidden: true,
  },
  {
    id: 'distanceTraveled', label: 'Sum Distance Traveled', isHidden: true,
  },
  {
    id: 'damageDone', label: 'Sum Damage Done', isHidden: true,
  },
  {
    id: 'damageTaken', label: 'Sum Damage Taken', isHidden: true,
  },
  {
    id: 'gulagKills', label: 'Sum Gulag Kills', isHidden: true,
  },
  {
    id: 'gulagDeaths', label: 'Sum Gulag Deaths', isHidden: true,
  },
  {
    id: 'teamSurvivalTime', label: 'Sum Team Survival Time', isHidden: true,
  },
  {
    id: 'cachesOpened', label: 'Sum Caches Opened', isHidden: true,
  },
  {
    id: 'teamsWiped', label: 'Sum Teams Wiped', isHidden: true,
  },
  {
    id: 'lastStandKills', label: 'Sum Last Stand Kills', isHidden: true,
  },
  {
    id: 'revives', label: 'Sum Revives', isHidden: true,
  },
  {
    id: 'kioskBuys', label: 'Sum Kiosk Buys', isHidden: true,
  },
  {
    id: 'downsInCircleOne', label: 'Sum Downs Circle 1', isHidden: true,
  },
  {
    id: 'downsInCircleTwo', label: 'Sum Downs Circle 2', isHidden: true,
  },
  {
    id: 'downsInCircleThree', label: 'Sum Downs Circle 3', isHidden: true,
  },
  {
    id: 'downsInCircleFour', label: 'Sum Downs Circle 4', isHidden: true,
  },
  {
    id: 'downsInCircleFive', label: 'Sum Downs Circle 5', isHidden: true,
  },
  {
    id: 'downsInCircleSix', label: 'Sum Downs Circle 6', isHidden: true,
  },
  {
    id: 'ocaScore', label: 'Sum oCa Score', isHidden: true,
  },
  {
    id: 'winPercent', label: 'Win %',
  },
  {
    id: 'avgTopTen', label: 'Avg Top Ten',
  },
  {
    id: 'avgTopFive', label: 'Avg Top Five',
  },
  {
    id: 'avgTimePlayed', label: 'Avg Time Played',
  },
  {
    id: 'killsPerGame', label: 'Kills Per Game',
  },
  {
    id: 'deathsPerGame', label: 'Deaths Per Game',
  },
  {
    id: 'killDeathRatio', label: 'Avg KDR',
  },
  {
    id: 'avgTimeMoving', label: 'Avg Time Moving', isHidden: true,
  },
  {
    id: 'avgDamageDone', label: 'Avg Damage Done', isHidden: true,
  },
  {
    id: 'avgDamageTaken', label: 'Avg Damage Taken', isHidden: true,
  },
  {
    id: 'avgDistanceTraveled', label: 'Avg Distance Traveled', isHidden: true,
  },
  {
    id: 'avgGulagKills', label: 'Avg Gulag Kills', isHidden: true,
  },
  {
    id: 'avgGulagDeaths', label: 'Avg Gulag Deaths', isHidden: true,
  },
  {
    id: 'avgCachesOpened', label: 'Avg Caches Opened', isHidden: true,
  },
  {
    id: 'avgTeamsWiped', label: 'Avg Teams Wiped', isHidden: true,
  },
  {
    id: 'avgLastStandKills', label: 'Avg Last Stand Kills', isHidden: true,
  },
  {
    id: 'avgRevives', label: 'Avg Revives', isHidden: true,
  },
  {
    id: 'avgKioskBuys', label: 'Avg Kiosk Buys', isHidden: true,
  },
  {
    id: 'avgDownsInCircleOne', label: 'Avg Downs in Circle 1', isHidden: true,
  },
  {
    id: 'avgDownsInCircleTwo', label: 'Avg Downs in Circle 2', isHidden: true,
  },
  {
    id: 'avgDownsInCircleThree', label: 'Avg Downs in Circle 3', isHidden: true,
  },
  {
    id: 'avgDownsInCircleFour', label: 'Avg Downs in Circle 4', isHidden: true,
  },
  {
    id: 'avgDownsInCircleFive', label: 'Avg Downs in Circle 5', isHidden: true,
  },
  {
    id: 'avgDownsInCircleSix', label: 'Avg Downs in Circle 6', isHidden: true,
  },
  {
    id: 'avgOcaScore', label: 'Avg oCa Score',
  },
];

const getTableRows = (weekMonthStats) => {
  const data = [];
  weekMonthStats.map((stats) => {
    const rowData = [
      stats.playerName,
      stats.gamesPlayed,
      calculateTimePlayed(stats.timePlayed),
      stats.totalPlacements,
      stats.wins,
      stats.topTen,
      stats.topFive,
      stats.kills,
      stats.deaths,
      stats.percentTimeMoving,
      stats.distanceTraveled,
      stats.damageDone,
      stats.damageTaken,
      stats.gulagKills,
      stats.gulagDeaths,
      stats.teamSurvivalTime,
      stats.cachesOpened,
      stats.teamsWiped,
      stats.lastStandKills,
      stats.revives,
      stats.kioskBuys,
      stats.downsInCircleOne,
      stats.downsInCircleTwo,
      stats.downsInCircleThree,
      stats.downsInCircleFour,
      stats.downsInCircleFive,
      stats.downsInCircleSix,
      stats.ocaScore,
      (stats.winPercent * 100).toFixed(2).toString().concat('%'),
      (stats.avgTopTen * 100).toFixed(2).toString().concat('%'),
      (stats.avgTopFive * 100).toFixed(2).toString().concat('%'),
      calculateTimePlayed(stats.avgTimePlayed, true),
      stats.killsPerGame.toFixed(2),
      stats.deathsPerGame.toFixed(2),
      stats.killDeathRatio.toFixed(2),
      stats.avgTimeMoving.toFixed(2).concat('%'),
      stats.avgDamageDone.toFixed(2),
      stats.avgDamageTaken.toFixed(2),
      stats.avgDistanceTraveled.toFixed(2),
      stats.avgGulagKills.toFixed(2),
      stats.avgGulagDeaths.toFixed(2),
      stats.avgCachesOpened.toFixed(2),
      stats.avgTeamsWiped.toFixed(2),
      stats.avgLastStandKills.toFixed(2),
      stats.avgRevives.toFixed(2),
      stats.avgKioskBuys.toFixed(2),
      stats.avgDownsInCircleOne.toFixed(2),
      stats.avgDownsInCircleTwo.toFixed(2),
      stats.avgDownsInCircleThree.toFixed(2),
      stats.avgDownsInCircleFour.toFixed(2),
      stats.avgDownsInCircleFive.toFixed(2),
      stats.avgDownsInCircleSix.toFixed(2),
      stats.avgOcaScore.toFixed(2),
    ];
    return data.push(rowData);
  });

  return data;
};

class WeekMonthStats extends Component {
  constructor(props) {
    super(props);

    const players = getCookie('players');

    const thisDate = new Date();
    const thisMonth = thisDate.getMonth() + 1;
    const thisYear = thisDate.getFullYear();

    this.state = {
      data: [],
      headers: headCells,
      monthFilter: `${thisMonth}/${thisYear}`,
      openColumnSelect: false,
      pageNumber: 1,
      pageSize: 25,
      players,
      sortColumn: 'avgOcaScore',
      sortDir: 'desc',
    };
  }

  componentDidMount() {
    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    const {
      monthFilter,
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

    propsFetchWeekMonthStats(tmpModeType, normalizeMonthFilter(monthFilter), page, pageSize, players, sortColumn, sortDir);
  }

  static getDerivedStateFromProps(nextProps) {
    const data = getTableRows(nextProps.weekMonthStats);

    if (nextProps.type === FETCH_WEEK_MONTH_STATS) {
      const compressedCookieHeaders = getCookie('columns-week-month');
      let tmpHeaders = headCells;
      if (compressedCookieHeaders !== undefined && compressedCookieHeaders !== null) {
        const stringCookieHeaders = lzStringCompress.decompressFromEncodedURIComponent(compressedCookieHeaders);
        tmpHeaders = JSON.parse(stringCookieHeaders);
      }

      return {
        data,
        headers: tmpHeaders,
        isFetching: nextProps.isFetching,
        weekMonthStats: nextProps.weekMonthStats,
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

  handleSortChange = (newSortColumn, newSortDir) => {
    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    const {
      modeType,
      monthFilter,
      pageNumber,
      pageSize,
      players,
    } = this.state;

    this.setState({
      sortColumn: newSortColumn,
      sortDir: newSortDir,
    });
    propsFetchWeekMonthStats(modeType, normalizeMonthFilter(monthFilter), pageNumber, pageSize, players, newSortColumn, newSortDir);
  }

  handlePageChange = (newPageNumber) => {
    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    const {
      modeType,
      monthFilter,
      pageSize,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    this.setState({ pageNumber: newPageNumber + 1 });
    propsFetchWeekMonthStats(modeType, normalizeMonthFilter(monthFilter), newPageNumber + 1, pageSize, players, sortColumn, sortDir);
  }

  handlePageSizeChange = (newPageSize) => {
    const {
      modeType,
      monthFilter,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    this.setState({
      pageSize: newPageSize,
    });
    propsFetchWeekMonthStats(modeType, normalizeMonthFilter(monthFilter), 1, newPageSize, players, sortColumn, sortDir);
  }

  openColumnSelect = () => {
    this.setState({
      openColumnSelect: true,
    });
  }

  handleModalIsClosing = () => {
    this.setState({
      openColumnSelect: false,
    });
  }

  headerCheckChanged = (header, headerIdx) => {
    const { headers: stateHeaders } = this.state;
    stateHeaders[headerIdx].isHidden = !stateHeaders[headerIdx].isHidden;
    this.setState({
      headers: stateHeaders,
    });
    const stringHeaders = JSON.stringify(stateHeaders);
    setCookie(window.location.pathname, 'columns-week-month', lzStringCompress.compressToEncodedURIComponent(stringHeaders));
  }

  render() {
    const {
      data,
      headers,
      openColumnSelect,
    } = this.state;

    const {
      totalCount,
    } = this.props;

    return (
      <div>
        <Layout>
          <Drawer>
            <Container maxWidth="lg">
              <Box my={4}>
                <ListBody
                  data={data}
                  changePage={this.handlePageChange}
                  changePageSize={this.handlePageSizeChange}
                  changeSort={this.handleSortChange}
                  collapsable={false}
                  headers={headers}
                  openColumnSelect={this.openColumnSelect}
                  toolbarName="Monthly Stats"
                  totalCount={totalCount}
                />
              </Box>
            </Container>
          </Drawer>
        </Layout>
        <ColumnSelectModal
          modalIsClosing={() => this.handleModalIsClosing()}
          open={openColumnSelect}
          headerCheckChanged={(header, headerIdx) => this.headerCheckChanged(header, headerIdx)}
          headers={headers}
        />
      </div>
    );
  }
}

WeekMonthStats.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchWeekMonthStats: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  weekMonthStats: PropTypes.array,
  modeType: PropTypes.string,
  router: PropTypes.object.isRequired,
  totalCount: PropTypes.number,
  type: PropTypes.string,
};

WeekMonthStats.defaultProps = {
  weekMonthStats: [],
  modeType: 'br',
  totalCount: 0,
  type: '',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.weekMonthStats.isFetching,
    weekMonthStats: state.weekMonthStats.weekMonthStats,
    modeType: state.weekMonthStats.modeType,
    totalCount: state.weekMonthStats.totalCount,
    type: state.weekMonthStats.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchWeekMonthStats: (modeType, monthFilter, pageNumber, pageSize, sortColumn, sortDir, players) => {
      dispatch(fetchWeekMonthStats(modeType, monthFilter, pageNumber, pageSize, sortColumn, sortDir, players));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(WeekMonthStats)));
