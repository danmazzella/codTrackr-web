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
import { getCookie } from '../utils/cookie';
import { calculateTimePlayed } from '../utils/commonHelpers';

// Components
import Layout from '../components/layout';
import Drawer from '../components/drawer';

import {
  fetchRecentStats,
} from '../redux/actions/recentStats.actions';

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
    id: 'modeType', label: 'Mode Type',
  },
  {
    id: 'matchesPlayed', label: '# Matches',
  },
  {
    id: 'kills', label: 'Kills',
  },
  {
    id: 'deaths', label: 'Deaths',
  },
  {
    id: 'kdRatio', label: 'K/D Ratio',
  },
  {
    id: 'timePlayed', label: 'Time Played (Hr)',
  },
];

const getTableRows = (recentStats) => {
  const data = [];
  recentStats.map((stats) => {
    const rowData = [
      stats.gamertag,
      stats.modeType,
      stats.matchesPlayed,
      stats.kills,
      stats.deaths,
      stats.kdRatio.toFixed(2),
      calculateTimePlayed(stats.timePlayed),
    ];
    return data.push(rowData);
  });

  return data;
};

class RecentStats extends Component {
  constructor(props) {
    super(props);

    const players = getCookie('players');

    this.state = {
      data: [],
      modeTypeFilter: 'All',
      pageNumber: 1,
      pageSize: 25,
      players,
      sortColumn: 'avgOcaScore',
      sortDir: 'desc',
    };
  }

  componentDidMount() {
    const {
      fetchRecentStats: propsFetchRecentStats,
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
    if (tmpModeType === null) {
      tmpModeType = 'All';
    }

    propsFetchRecentStats(tmpModeType, page, pageSize, players, sortColumn, sortDir);
  }

  static getDerivedStateFromProps(nextProps) {
    const data = getTableRows(nextProps.recentStats);

    if (nextProps.isFetching !== true) {
      return {
        data,
        isFetching: nextProps.isFetching,
        recentStats: nextProps.recentStats,
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
      fetchRecentStats: propsFetchRecentStats,
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

    propsFetchRecentStats(modeType, pageNumber, pageSize, players, newSortColumn, newSortDir);
  }

  handlePageChange = (newPageNumber) => {
    const {
      fetchRecentStats: propsFetchRecentStats,
    } = this.props;

    const {
      modeType,
      pageSize,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    this.setState({ pageNumber: newPageNumber + 1 });
    propsFetchRecentStats(modeType, newPageNumber + 1, pageSize, players, sortColumn, sortDir);
  }

  handlePageSizeChange = (newPageSize) => {
    const {
      modeType,
      players,
      sortColumn,
      sortDir,
    } = this.state;

    const {
      fetchRecentStats: propsFetchRecentStats,
    } = this.props;

    this.setState({
      pageSize: newPageSize,
    });
    propsFetchRecentStats(modeType, 1, newPageSize, players, sortColumn, sortDir);
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
                toolbarName="Recent Match Stats"
                totalCount={totalCount}
              />
            </Box>
          </Container>
        </Drawer>
      </Layout>
    );
  }
}

RecentStats.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchRecentStats: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  recentStats: PropTypes.array,
  modeType: PropTypes.string,
  router: PropTypes.object.isRequired,
  totalCount: PropTypes.number,
};

RecentStats.defaultProps = {
  recentStats: [],
  modeType: 'All',
  totalCount: 0,
};

const mapStateToProps = (state) => (
  {
    isFetching: state.recentStats.isFetching,
    recentStats: state.recentStats.recentStats,
    modeType: state.recentStats.modeType,
    totalCount: state.recentStats.totalCount,
  }
);

const mapActions = (dispatch) => (
  {
    fetchRecentStats: (modeType, pageNumber, pageSize, sortColumn, sortDir, players) => {
      dispatch(fetchRecentStats(modeType, pageNumber, pageSize, sortColumn, sortDir, players));
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(withRouter(RecentStats)));
