import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';

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
      filterButton,
      openColumnSelect,
      toolbarName,
    } = this.props;

    return (
      <Toolbar
        className={clsx(classes.root)}
      >
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {toolbarName}
        </Typography>

        <Tooltip title="Column Select" style={openColumnSelect === undefined ? { display: 'none' } : {}}>
          <IconButton aria-label="Column Select" onClick={openColumnSelect}>
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter List" style={filterButton === undefined ? { display: 'none' } : {}}>
          <IconButton aria-label="filter list" onClick={filterButton}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    );
  }
}

ListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  filterButton: PropTypes.func,
  openColumnSelect: PropTypes.func,
  toolbarName: PropTypes.string.isRequired,
};

ListToolbar.defaultProps = {
  filterButton: undefined,
  openColumnSelect: undefined,
};

export default withStyles(styles)(ListToolbar);
