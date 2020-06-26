// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Material Icons
import CloseIcon from '@material-ui/icons/Close';

// Constants
import {
  FETCH_MATCH,
  CLEAR_MATCH,
} from '../redux/constants/match.constants';

// Utils
import { calculateTimePlayed, formatDate } from '../utils/commonHelpers';

// Actions
import {
  fetchMatch,
  clearMatch,
} from '../redux/actions/match.actions';


const styles = (theme) => ({
  root: {
    margin: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
});

class MatchDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      match: {},
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isFetching,
      match,
      type,
    } = nextProps;

    if (type === FETCH_MATCH) {
      return {
        isFetching,
        match,
      };
    }

    if (type === CLEAR_MATCH) {
      return {
        match,
      };
    }

    return {};
  }

  componentDidUpdate(prevProps) {
    const {
      gamertag,
      matchId,
      open,
    } = this.props;

    if (prevProps.open === false && open === true) {
      const {
        fetchMatch: propsFetchMatch,
      } = this.props;

      propsFetchMatch(gamertag, matchId);
    }
  }

  handleClose = () => {
    const {
      clearMatch: propsClearMatch,
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    propsClearMatch();
    propsModalIsClosing();
  };

  render() {
    const {
      match,
    } = this.state;

    const {
      open,
    } = this.props;

    let matchStats = {};
    if (match && match.stats) {
      matchStats = match.stats;
    }

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
              Match Data
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
        <DialogContent>
          <Grid
            container
            direction="column"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                style={{ marginTop: 10, marginBottom: 20 }}
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Gamertag
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h6"
                        align="center"
                      >
                        {match.playerName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Match Date
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h6"
                        align="center"
                      >
                        {formatDate(new Date(match.matchTime))}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Mode Type
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {match.modeType}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Placement
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {match.placement}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        oCa Score
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.ocaScore}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Kills
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.kills}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Downs
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {
                          matchStats.downsInCircleOne !== undefined ? matchStats.downsInCircleOne + matchStats.downsInCircleTwo
                            + matchStats.downsInCircleThree + matchStats.downsInCircleFour
                            + matchStats.downsInCircleFive + matchStats.downsInCircleSix : ''
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Last Stand Kills
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.lastStandKills}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Damage Done
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.damageDone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Damage Taken
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.damageTaken}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Score
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.score}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Kiosk Buys
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.kioskBuys}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Caches Opened
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.cachesOpened}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        % Time Moving
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.percentTimeMoving !== undefined ? matchStats.percentTimeMoving.toFixed(2) : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 10 }}
              >
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Gulag Kills
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.gulagKills}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Gulag Deaths
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {matchStats.gulagDeaths}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid
                      item
                      style={{ textAlign: 'center' }}
                    >
                      <Typography
                        variant="caption"
                      >
                        Time Played
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="body1"
                        align="center"
                      >
                        {calculateTimePlayed(matchStats.timePlayedSeconds, true)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: '100%' }}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                style={{ marginTop: 10, marginBottom: 20 }}
              >
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Grid
                    item
                    style={{ textAlign: 'center' }}
                  >
                    <Typography
                      variant="caption"
                    >
                      Players
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body1"
                      align="center"
                    >
                      {match.players !== undefined ? match.players.join(', ') : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog >
    );
  }
}

MatchDialog.propTypes = {
  clearMatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  fetchMatch: PropTypes.func.isRequired,
  gamertag: PropTypes.string,
  match: PropTypes.object,
  matchId: PropTypes.string,
  modalIsClosing: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

MatchDialog.defaultProps = {
  isFetching: false,
  gamertag: '',
  match: {},
  matchId: '',
};

const mapStateToProps = (state) => (
  {
    isFetching: state.match.isFetching,
    match: state.match.match,
    type: state.match.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchMatch: (gamertag, matchId) => {
      dispatch(fetchMatch(gamertag, matchId));
    },
    clearMatch: () => {
      dispatch(clearMatch());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(MatchDialog));