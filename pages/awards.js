// NPM Modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown/with-html';
import PropTypes from 'prop-types';

// Material Core
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

// Constants
import { FETCH_AWARDS } from '../redux/constants/awards.constants';

// Utils
import { formatDate } from '../utils/commonHelpers';

// Components
import Award from '../components/award';
import Drawer from '../components/drawer';
import Layout from '../components/layout';

// Actions
import {
  fetchAwards,
} from '../redux/actions/awards.actions';

const styles = (theme) => ({
  root: {
    margin: 'auto',
  },
});

class Awards extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    const {
      fetchAwards: propsFetchAwards,
    } = this.props;

    propsFetchAwards();
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      isFetching,
      awards,
      type,
    } = nextProps;

    if (type === FETCH_AWARDS) {
      return {
        isFetching,
        awards,
      };
    }

    return {};
  }

  getAwardUI = (awards) => {
    const awardArray = [];
    if (awards.information !== undefined) {
      Object.keys(awards.information).forEach((awardIdx) => {
        console.log('AwardIdx: ', awardIdx);
        awardArray.push(
          <Award
            average={awards.average[awardIdx]}
            information={awards.information[awardIdx]}
            highest={awards.highest[awardIdx]}
            name={awardIdx}
          />,
        );
      });
    }

    return awardArray;
  }

  render() {
    const {
      classes,
      awards,
    } = this.props;

    console.log('Awards:', awards);

    return (
      <Layout>
        <Drawer>
          <Container maxWidth="xl">
            <Box my={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
              >
                Awards
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {
                this.getAwardUI(awards)
              }
            </Grid>
          </Container>
        </Drawer>
      </Layout>
    );
  }
}

Awards.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchAwards: PropTypes.func.isRequired,
  awards: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

Awards.defaultProps = {};

const mapStateToProps = (state) => (
  {
    isFetching: state.awards.isFetching,
    awards: state.awards.awards,
    type: state.awards.type,
  }
);

const mapActions = (dispatch) => (
  {
    fetchAwards: () => {
      dispatch(fetchAwards());
    },
  }
);

export default connect(mapStateToProps, mapActions)(withStyles(styles)(Awards));