// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import ListBody from 'mazz-react-list';
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
import { calculateTimePlayed } from '../utils/commonHelpers';

// Components
import Layout from '../components/layout';
import Drawer from '../components/drawer';

// Constants
import { FETCH_LIFETIME_STATS } from '../redux/constants/lifetimeStats.constants';

// Actions
import {
  fetchLifetimeStats,
} from '../redux/actions/lifetimeStats.actions';

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
    id: 'gamesPlayed', label: 'Games Played',
  },
  {
    id: 'timePlayed', label: 'Time Played (Hr)',
  },
  {
    id: 'kills', label: 'Kills', isHidden: true,
  },
  {
    id: 'downs', label: 'Downs', isHidden: true,
  },
  {
    id: 'deaths', label: 'Deaths', isHidden: true,
  },
  {
    id: 'kdRatio', label: 'K/D Ratio',
  },
  {
    id: 'killsPerGame', label: 'Kills Per Game',
  },
  {
    id: 'downsPerGame', label: 'Downs Per Game', isHidden: true,
  },
  {
    id: 'wins', label: 'BR Wins',
  },
  {
    id: 'winPercent', label: 'BR Win %',
  },
  {
    id: 'topFive', label: 'Top 5', isHidden: true,
  },
  {
    id: 'topFivePercent', label: 'Top 5%',
  },
  {
    id: 'topTen', label: 'Top 10', isHidden: true,
  },
  {
    id: 'topTenPercent', label: 'Top 10%',
  },
  {
    id: 'avgOcaScore', label: 'Avg oCaScore',
  },
  {
    id: 'highestOcaScore', label: 'Highest oCaScore',
  },
];

const getTableRows = (lifetimeStats) => {
  const data = [];
  lifetimeStats.map((stats) => {
    const rowData = [
      stats.gamertag,
      stats.gamesPlayed,
      calculateTimePlayed(stats.timePlayed),
      stats.kills,
      stats.downs,
      stats.deaths,
      stats.kdRatio.toFixed(2),
      stats.killsPerGame.toFixed(2),
      stats.downsPerGame.toFixed(2),
      stats.wins,
      (stats.winPercent * 100).toFixed(2).toString().concat('%'),
      stats.topFive,
      (stats.topFivePercent * 100).toFixed(2).toString().concat('%'),
      stats.topTen,
      (stats.topTenPercent * 100).toFixed(2).toString().concat('%'),
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
      headers: headCells,
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
      const cookieHeaders = getCookie('columns-lifetime');
      let tmpHeaders = headCells;
      if (cookieHeaders !== undefined && cookieHeaders !== null) {
        tmpHeaders = JSON.parse(cookieHeaders);
      }

      return {
        data,
        headers: tmpHeaders,
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
    setCookie(window.location.pathname, 'columns-lifetime', stateHeaders);
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
                  toolbarName="Battle Royal Stats"
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
