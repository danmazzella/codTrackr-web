import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';

const styles = (theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  title: {
    flex: '1 1 100%',
  },
});

class ListToolbar extends React.Component {
  componentDidMount() {

  }

  render() {
    const {
      classes,
      toolbarName,
    } = this.props;

    return (
      <Toolbar
        className={clsx(classes.root)}
      >
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {toolbarName}
        </Typography>

        {/* <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip> */}
      </Toolbar>
    );
  }
}

ListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  toolbarName: PropTypes.string.isRequired,
};

ListToolbar.defaultProps = {
};

export default withStyles(styles)(ListToolbar);
