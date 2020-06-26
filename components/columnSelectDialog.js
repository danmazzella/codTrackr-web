// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Material Icons
import CloseIcon from '@material-ui/icons/Close';

// Constants

// Utils

// Actions


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

    this.state = {};
  }

  handleClose = () => {
    const {
      modalIsClosing: propsModalIsClosing,
    } = this.props;

    propsModalIsClosing();
  };

  render() {
    const {
      headerCheckChanged,
      headers,
      open,
    } = this.props;

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
              Select Columns
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
            {
              headers.map((header, headerIdx) => (
                <FormControlLabel
                  key={header.label}
                  control={(
                    <Checkbox
                      checked={!header.isHidden}
                      onChange={(checked) => {
                        return headerCheckChanged(header, headerIdx, checked.target.checked);
                      }}
                      name={header.label}
                      color="primary"
                    />
                  )}
                  label={header.label}
                />
              ))
            }
          </Grid>
        </DialogContent>
      </Dialog >
    );
  }
}

MatchDialog.propTypes = {
  headerCheckChanged: PropTypes.func.isRequired,
  headers: PropTypes.array,
  modalIsClosing: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

MatchDialog.defaultProps = {
  headers: [],
};


export default withStyles(styles)(MatchDialog);