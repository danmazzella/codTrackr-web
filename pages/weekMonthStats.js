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

// Material UI Icons

// Utils
import { getCookie, setCookie } from '../utils/cookie';
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
import FilterDialogModal from '../components/weekMonthFilterDialog';

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
    id: 'playerName', label: 'Gamertag',
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
    id: 'totalDowns', label: 'Sum Downs', isHidden: true,
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
    id: 'avgDowns', label: 'Downs Per Game',
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

const getTableRows = (weekMonthStats, singlePlayer) => {
  const data = [];
  weekMonthStats.map((stats) => {
    const rowData = [
      singlePlayer === 'none' ? stats.playerName : `${stats.month}/${stats.year}`,
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
      stats.totalDowns,
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
      stats.avgDowns.toFixed(2),
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
      modeType: 'all',
      monthFilter: `${thisMonth}/${thisYear}`,
      openColumnSelect: false,
      openFilterDialog: false,
      pageNumber: 1,
      pageSize: 25,
      playerFilter: 'friends',
      players,
      sortColumn: 'avgOcaScore',
      sortDir: 'desc',
      specificPlayerFilter: 'none',
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
      specificPlayerFilter,
    } = this.state;

    let tmpFriendsFilter = this.getFromSearchParam('filterGroup');
    if (tmpFriendsFilter === null || tmpFriendsFilter === 'friends') {
      tmpFriendsFilter = players;
    } else if (tmpFriendsFilter === 'all') {
      tmpFriendsFilter = undefined;
    }

    let tmpModeType = this.getFromSearchParam('matchType');
    if (tmpModeType === null || tmpModeType === undefined) {
      tmpModeType = 'all';
    }

    let tmpMonthFilter = this.getFromSearchParam('monthFilter');
    if (tmpMonthFilter === null || tmpMonthFilter === undefined) {
      tmpMonthFilter = monthFilter;
    }

    let page = this.getFromSearchParam('page');
    if (page === null) {
      page = pageNumber;
    }

    let tmpSpecificPlayer = this.getFromSearchParam('specificPlayer');
    if (tmpSpecificPlayer === null) {
      tmpSpecificPlayer = specificPlayerFilter;
    }

    propsFetchWeekMonthStats(
      tmpModeType,
      normalizeMonthFilter(tmpMonthFilter),
      page,
      pageSize,
      tmpFriendsFilter,
      sortColumn,
      sortDir,
      tmpSpecificPlayer,
    );
  }

  static getDerivedStateFromProps(nextProps) {
    const data = getTableRows(nextProps.weekMonthStats, nextProps.specificPlayerFilter);

    if (nextProps.type === FETCH_WEEK_MONTH_STATS) {
      const compressedCookieHeaders = getCookie('columns-week-month');
      let tmpHeaders = headCells;
      if (compressedCookieHeaders !== undefined && compressedCookieHeaders !== null) {
        const stringCookieHeaders = lzStringCompress
          .decompressFromEncodedURIComponent(compressedCookieHeaders);
        tmpHeaders = JSON.parse(stringCookieHeaders);
      }

      // tmpHeaders if date
      if (nextProps.specificPlayerFilter !== 'none') {
        tmpHeaders[0].id = 'monthYear';
        tmpHeaders[0].label = 'Date';
      } else {
        tmpHeaders[0].id = 'playerName';
        tmpHeaders[0].label = 'Gamertag';
      }

      let tmpFriendsFilter = 'friends';
      let filterPlayers = nextProps.players;
      if (nextProps.players === undefined) {
        tmpFriendsFilter = 'all';
        filterPlayers = undefined;
      }

      const thisDate = new Date();
      const thisMonth = thisDate.getMonth() + 1;
      const thisYear = thisDate.getFullYear();
      let tmpMonthFilter = `${thisMonth}/${thisYear}`;
      if (nextProps.monthFilter !== undefined) {
        try {
          const jsonMonthFilter = JSON.parse(nextProps.monthFilter);
          tmpMonthFilter = `${jsonMonthFilter.month}/${jsonMonthFilter.year}`;
        } catch (err) {
          console.err('Invalid JSON Month'); // eslint-disable-line no-console
        }
      }


      return {
        data,
        headers: tmpHeaders,
        isFetching: nextProps.isFetching,
        modeType: nextProps.modeType,
        modeTypeFilter: nextProps.modeType,
        monthFilter: tmpMonthFilter,
        playerFilter: tmpFriendsFilter,
        players: filterPlayers,
        specificPlayerFilter: nextProps.specificPlayerFilter,
        totalCount: nextProps.totalCount,
        weekMonthStats: nextProps.weekMonthStats,
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
      specificPlayerFilter,
    } = this.state;

    this.setState({
      sortColumn: newSortColumn,
      sortDir: newSortDir,
    });

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(monthFilter),
      pageNumber,
      pageSize,
      players,
      newSortColumn,
      newSortDir,
      specificPlayerFilter,
    );
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
      specificPlayerFilter,
    } = this.state;

    this.setState({ pageNumber: newPageNumber + 1 });

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(monthFilter),
      newPageNumber + 1,
      pageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    );
  }

  handlePageSizeChange = (newPageSize) => {
    const {
      modeType,
      monthFilter,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    this.setState({
      pageSize: newPageSize,
    });

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(monthFilter),
      1,
      newPageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    );
  }

  openColumnSelect = () => {
    this.setState({
      openColumnSelect: true,
    });
  }

  closeColumnSelect = () => {
    this.setState({
      openColumnSelect: false,
    });
  }

  openFilterDialog = () => {
    this.setState({
      openFilterDialog: true,
    });
  }

  closeFilterDialog = () => {
    this.setState({
      openFilterDialog: false,
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

  handleMatchTypeChanged = (ev) => {
    const {
      monthFilter,
      pageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    this.setState({
      modeType: ev.target.value,
      pageNumber: 1,
    });

    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'page' },
      { action: 'add', param: 'matchType', value: ev.target.value },
    ]);

    propsFetchWeekMonthStats(
      ev.target.value,
      normalizeMonthFilter(monthFilter),
      1,
      pageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    );
  }

  handleMonthFilterChanged = (newMonthEv) => {
    const {
      modeType,
      pageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    this.setState({
      monthFilter: newMonthEv.target.value,
      pageNumber: 1,
    });

    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'page' },
      { action: 'add', param: 'monthFilter', value: newMonthEv.target.value },
    ]);

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(newMonthEv.target.value),
      1,
      pageSize,
      players,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    );
  }

  handlePlayerFilterChanged = (event) => {
    const {
      modeType,
      monthFilter,
      pageSize,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    this.setState({
      playerFilter: event.target.value,
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

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(monthFilter),
      1,
      pageSize,
      filterGroup,
      sortColumn,
      sortDir,
      specificPlayerFilter,
    );
  }

  handleSpecificPlayerFilterChanged = (event) => {
    const {
      modeType,
      monthFilter,
      pageSize,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    const {
      fetchWeekMonthStats: propsFetchWeekMonthStats,
    } = this.props;

    let tmpSpecificPlayer;
    let tmpSortColumn = sortColumn;
    let tmpSortDir = sortDir;
    if (event.target.value !== 'none') {
      tmpSpecificPlayer = event.target.value;
      tmpSortColumn = 'monthYear';
      tmpSortDir = 'desc';
    } else {
      tmpSpecificPlayer = undefined;
    }

    this.setState({
      sortColumn: tmpSortColumn,
      sortDir: tmpSortDir,
      specificPlayerFilter: tmpSpecificPlayer,
      pageNumber: 1,
    });

    this.bulkAddRemoveSearchParam([
      { action: 'remove', param: 'page' },
      { action: 'add', param: 'specificPlayer', value: tmpSpecificPlayer },
    ]);

    propsFetchWeekMonthStats(
      modeType,
      normalizeMonthFilter(monthFilter),
      1,
      pageSize,
      players,
      tmpSortColumn,
      tmpSortDir,
      tmpSpecificPlayer,
    );
  };

  render() {
    const {
      data,
      headers,
      modeType,
      monthFilter,
      openColumnSelect,
      openFilterDialog,
      playerFilter,
      specificPlayerFilter,
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
                  openFilterDialog={this.openFilterDialog}
                  toolbarName="Monthly Stats"
                  totalCount={totalCount}
                />
              </Box>
            </Container>
          </Drawer>
        </Layout>
        <ColumnSelectModal
          modalIsClosing={() => this.closeColumnSelect()}
          open={openColumnSelect}
          headerCheckChanged={(header, headerIdx) => this.headerCheckChanged(header, headerIdx)}
          headers={headers}
        />
        <FilterDialogModal
          handleMatchTypeChanged={(ev) => this.handleMatchTypeChanged(ev)}
          handleMonthFilterChanged={(newMonthEv) => this.handleMonthFilterChanged(newMonthEv)}
          handlePlayerFilterChanged={(ev) => this.handlePlayerFilterChanged(ev)}
          handleSpecificPlayerFilterChanged={(ev) => this.handleSpecificPlayerFilterChanged(ev)}
          modalIsClosing={() => this.closeFilterDialog()}
          modeTypeFilter={modeType}
          monthFilter={monthFilter}
          open={openFilterDialog}
          playerFilter={playerFilter}
          specificPlayerFilter={specificPlayerFilter}
        />
      </div>
    );
  }
}

WeekMonthStats.propTypes = {
  fetchWeekMonthStats: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  weekMonthStats: PropTypes.array,
  modeType: PropTypes.string,
  monthFilter: PropTypes.string,
  players: PropTypes.string,
  router: PropTypes.object.isRequired,
  specificPlayerFilter: PropTypes.string,
  totalCount: PropTypes.number,
  type: PropTypes.string,
};

WeekMonthStats.defaultProps = {
  weekMonthStats: [],
  modeType: 'all',
  monthFilter: '',
  players: undefined,
  specificPlayerFilter: 'none',
  totalCount: 0,
  type: '',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.weekMonthStats.isFetching,
    weekMonthStats: state.weekMonthStats.weekMonthStats,
    modeType: state.weekMonthStats.modeType,
    monthFilter: state.weekMonthStats.monthFilter,
    players: state.weekMonthStats.players,
    specificPlayerFilter: state.weekMonthStats.specificPlayerFilter,
    totalCount: state.weekMonthStats.totalCount,
    type: state.weekMonthStats.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchWeekMonthStats: (
      modeType, monthFilter, pageNumber, pageSize, players, sortColumn, sortDir, specificPlayerFilter,
    ) => {
      dispatch(fetchWeekMonthStats(
        modeType, monthFilter, pageNumber, pageSize, players, sortColumn, sortDir, specificPlayerFilter,
      ));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(WeekMonthStats)));
