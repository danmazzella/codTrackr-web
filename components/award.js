import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import InfoIcon from '@material-ui/icons/Info';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    margin: 8,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  infoIcon: {
    marginLeft: 6,
    fontSize: 16,
  },
});

class Award extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const {
      classes,
      average,
      highest,
      information,
      name,
    } = this.props;

    console.log('Key: ', name);

    return (
      <Grid item xs={6}>
        <Paper
          className={classes.paper}
        >
          <Typography
            variant="h6"
          >
            {information.title}
            <Tooltip title={information.tooltip} aria-label={information.tooltip}>
              <InfoIcon className={classes.infoIcon} />
            </Tooltip>
          </Typography>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item>
              <Typography
                variant="button"
              >
                Highest
              </Typography>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
              >
                {
                  highest.map((data) => (
                    <Grid item key={`${data.player}`}>
                      {`${data.player} - ${data.data.toFixed(2)}`}
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant="button"
              >
                Average
              </Typography>
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
              >
                {
                  average.map((data) => (
                    <Grid item key={`${data.player}`}>
                      {`${data.player} - ${data.data.toFixed(2)}`}
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

Award.propTypes = {
  classes: PropTypes.object.isRequired,
  average: PropTypes.array.isRequired,
  highest: PropTypes.array.isRequired,
  information: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

Award.defaultProps = {
};

export default (withStyles(styles))(Award);
