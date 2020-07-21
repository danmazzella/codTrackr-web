// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

// Material Icons
import CloseIcon from '@material-ui/icons/Close';

// Constants
import { FETCH_PLAYERS } from '../redux/constants/players.constants';

// Utils
import { getMonthFilters } from '../utils/commonHelpers';

// Actions
import {
  fetchPlayers,
} from '../redux/actions/players.actions';


const styles = (theme) => ({
  root: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

class WeekMonthFilterDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    const {
      fetchPlayers: propsFetchPlayers,
    } = this.props;

    propsFetchPlayers();
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      type,
    } = nextProps;

    if (type === FETCH_PLAYERS) {
      return {
        isFetching: nextProps.isFetching,
      };
    }

    return {};
  }

  handleClose = () => {
    const {
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    propsModalIsClosing();
  };

  addPlayerItems = (players) => {
    const menuItems = [(<MenuItem key="none" value="none">{'<None>'}</MenuItem>)];
    if (players !== undefined) {
      players
        .sort((playerOne, playerTwo) => {
          if (playerOne.gamertag.toLowerCase() < playerTwo.gamertag.toLowerCase()) {
            return -1;
          }
          return 1;
        })
        .map((player) => menuItems.push(<MenuItem key={`${player.gamertag}`} value={`${player.gamertag}`}>{player.gamertag}</MenuItem>));
    }
    return menuItems;
  }

  render() {
    const {
      modeTypeFilter,
      monthFilter,
      playerFilter,
      players,
      specificPlayerFilter,
    } = this.props;

    const {
      classes,
      handleMatchTypeChanged,
      handleMonthFilterChanged,
      handlePlayerFilterChanged,
      handleSpecificPlayerFilterChanged,
      open,
    } = this.props;

    const monthFilterData = getMonthFilters();

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              Filters
            </Grid>
            <Grid item>
              <IconButton
                style={{
                  display: 'inline-flex',
                  verticalAlign: 'middle',
                }}
                edge="end"
                onClick={() => this.handleClose()}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ marginBottom: 20 }}>
          <Grid
            container
            direction="column"
          >
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ marginTop: 12, marginBottom: 12 }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Player Filter</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={playerFilter}
                onChange={handlePlayerFilterChanged}
                label="playerFilter"
                disabled={specificPlayerFilter !== 'none'}
              >
                <MenuItem value="friends">Friends</MenuItem>
                <MenuItem value="all">Everyone</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ marginTop: 12, marginBottom: 12 }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Match Type</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={modeTypeFilter}
                onChange={handleMatchTypeChanged}
                label="matchType"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="solos">Solos</MenuItem>
                <MenuItem value="duos">Duos</MenuItem>
                <MenuItem value="threes">Threes</MenuItem>
                <MenuItem value="quads">Quads</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ marginTop: 12, marginBottom: 12 }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={monthFilter}
                onChange={(ev) => handleMonthFilterChanged(ev)}
                label="monthFilter"
                disabled={specificPlayerFilter !== 'none'}
              >
                {monthFilterData.map((monthData) => (
                  <MenuItem
                    key={`${monthData.month}/${monthData.year}`}
                    value={`${monthData.month}/${monthData.year}`}
                  >
                    {monthData.monthName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              style={{ marginTop: 12, marginBottom: 12 }}
            >
              <InputLabel id="demo-simple-select-outlined-label">Specific Player</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={specificPlayerFilter}
                onChange={handleSpecificPlayerFilterChanged}
                label="specificPlayerFilter"
              >
                {this.addPlayerItems(players)}
              </Select>
            </FormControl>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

WeekMonthFilterDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchPlayers: PropTypes.func.isRequired,
  handleMatchTypeChanged: PropTypes.func.isRequired,
  handleMonthFilterChanged: PropTypes.func.isRequired,
  handlePlayerFilterChanged: PropTypes.func.isRequired,
  handleSpecificPlayerFilterChanged: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  modalIsClosing: PropTypes.func.isRequired,
  modeTypeFilter: PropTypes.string.isRequired,
  monthFilter: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  playerFilter: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
  specificPlayerFilter: PropTypes.string,
  type: PropTypes.string.isRequired,
};

WeekMonthFilterDialog.defaultProps = {
  specificPlayerFilter: 'none',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.players.isFetching,
    players: state.players.players,
    type: state.players.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchPlayers: () => {
      dispatch(fetchPlayers());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(WeekMonthFilterDialog));