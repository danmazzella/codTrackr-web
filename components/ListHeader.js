import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = () => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

class ListHeader extends React.Component {
  constructor(props) {
    super(props);

    this.createSortHandler = this.createSortHandler.bind(this);

    this.state = {
    };
  }

  componentDidMount() {

  }

  createSortHandler(property, event) {
    const {
      onRequestSort,
    } = this.props;

    onRequestSort(event, property);
  }

  tableCellStyle = (headCell) => {
    if (headCell.isHidden === true) {
      return {
        display: 'none',
      };
    }

    return {};
  }

  render() {
    const {
      classes,
      headers,
      order,
      orderBy,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {headers.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={this.tableCellStyle(headCell)}
            >
              <TableSortLabel
                active={orderBy === headCell.id && headCell.sortable === true}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={(ev) => (
                  (headCell.sortable === true || headCell.sortable === undefined)
                    ? this.createSortHandler(headCell.id, ev)
                    : null)}
                hideSortIcon={headCell.sortable !== false ? false : true}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

ListHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default withStyles(styles)(ListHeader);
