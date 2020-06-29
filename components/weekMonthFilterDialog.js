// NPM Modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

// Material Icons
import CloseIcon from '@material-ui/icons/Close';

// Constants

// Utils
import { getMonthFilters } from '../utils/commonHelpers';

// Actions


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

  handleClose = () => {
    const {
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    propsModalIsClosing();
  };

  render() {
    const {
      modeTypeFilter,
      monthFilter,
      playerFilter,
    } = this.props;

    const {
      classes,
      handleMatchTypeChanged,
      handleMonthFilterChanged,
      handlePlayerFilterChanged,
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
              <InputLabel id="demo-simple-select-outlined-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={monthFilter}
                onChange={handleMonthFilterChanged}
                label="monthFilter"
              >
                {monthFilterData.map((monthData) => (<MenuItem key={`${monthData.month}/${monthData.year}`} value={`${monthData.month}/${monthData.year}`}>{monthData.monthName}</MenuItem>))}
              </Select>
            </FormControl>
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
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

WeekMonthFilterDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMatchTypeChanged: PropTypes.func.isRequired,
  handleMonthFilterChanged: PropTypes.func.isRequired,
  handlePlayerFilterChanged: PropTypes.func.isRequired,
  modalIsClosing: PropTypes.func.isRequired,
  modeTypeFilter: PropTypes.string.isRequired,
  monthFilter: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  playerFilter: PropTypes.string.isRequired,
};

WeekMonthFilterDialog.defaultProps = {
};


export default withStyles(styles)(WeekMonthFilterDialog);