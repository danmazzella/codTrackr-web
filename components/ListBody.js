import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Collapse from '@material-ui/core/Collapse';

// Material UI Icons

import ListHeader from './ListHeader';
import ListToolbar from './ListToolbar';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
});

class ListBody extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);

    const { headers } = props;
    let tmpOrder;
    let tmpOrderBy;
    headers.forEach((header) => {
      if (header.orderBy === true) {
        tmpOrderBy = header.id;
        if (header.order !== undefined) {
          tmpOrder = header.order;
        }
      }
      return null;
    });

    this.state = {
      order: tmpOrder === undefined ? 'asc' : tmpOrder,
      orderBy: tmpOrderBy === undefined ? 'protein' : tmpOrderBy,
      page: 0,
      pageSize: 25,
      collapsedRow: null,
    };
  }

  handleRequestSort(event, property) {
    const {
      order,
      orderBy,
    } = this.state;

    const {
      changeSort,
    } = this.props;

    const isAsc = orderBy === property && order === 'asc';

    this.setState({
      collapsedRow: null,
      order: (isAsc ? 'desc' : 'asc'),
      orderBy: property,
    });

    changeSort(property, (isAsc ? 'desc' : 'asc'));
  }

  handleChangePage(event, newPage) {
    const {
      changePage,
    } = this.props;

    changePage(newPage);
    this.setState({
      page: newPage,
    });
  }

  handleChangeRowsPerPage(event) {
    const {
      changePageSize,
    } = this.props;

    changePageSize(parseInt(event.target.value, 10));
    this.setState({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  }

  tableCellStyle = (headCell, index, headers) => {
    if (headers[index].isHidden === true) {
      return {
        display: 'none',
      };
    }

    return {};
  }

  addRowData = (row, index, columnIdx, headers) => {
    return (
      <TableCell
        component="th"
        scope="row"
        key={`${row}-${index}`}
        style={this.tableCellStyle(row, columnIdx, headers)}
        onClick={() => this.props.cellClick(row, index, columnIdx)}
      >
        {row}
      </TableCell>
    );
  };

  render() {
    const {
      collapsedRow,
      order,
      orderBy,
      page,
      pageSize,
    } = this.state;

    const {
      classes,
      collapsable,
      collapseLayout,
      data,
      headers,
      openColumnSelect,
      openFilterDialog,
      toolbarName,
    } = this.props;

    let {
      totalCount,
    } = this.props;

    // Needed when during loading totalCount = 0
    if (page * pageSize > totalCount) {
      totalCount = page * pageSize + 1;
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <ListToolbar
            filterButton={openFilterDialog}
            toolbarName={toolbarName}
            openColumnSelect={openColumnSelect}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <ListHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                headers={headers}
              />
              <TableBody>
                {
                  data.map((row, index) => [
                    <TableRow
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => this
                        .setState({ collapsedRow: collapsedRow === index ? null : index })}
                      key={'Row-'.concat(row[0].concat(index))}
                    >
                      {
                        row.map((rowData, columnIdx) => this.addRowData(rowData, index, columnIdx, headers))
                      }
                    </TableRow>,
                    (
                      collapsable ? (
                        <TableRow
                          key={row[0].concat(index).concat('-sub')}
                        >
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0, cursor: 'pointer' }}
                            colSpan={row.length}
                          >
                            <Collapse
                              in={collapsedRow === index}
                              timeout="auto"
                              unmountOnExit
                            >
                              <div>
                                {collapseLayout(row)}
                              </div>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      ) : undefined
                    ),
                  ])
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper >
      </div >
    );
  }
}

ListBody.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  cellClick: PropTypes.func,
  changePage: PropTypes.func.isRequired,
  changePageSize: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
  collapseLayout: PropTypes.any,
  collapsable: PropTypes.bool,
  headers: PropTypes.array.isRequired,
  openColumnSelect: PropTypes.func,
  openFilterDialog: PropTypes.func,
  toolbarName: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,
};

ListBody.defaultProps = {
  cellClick: () => { },
  collapseLayout: undefined,
  collapsable: false,
  openColumnSelect: undefined,
  openFilterDialog: undefined,
};

export default (withStyles(styles))(ListBody);
