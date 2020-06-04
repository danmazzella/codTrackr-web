import React from 'react';

import PropTypes from 'prop-types';
import { initGA, logPageView } from '../utils/analytics';

class Layout extends React.Component {
  componentDidMount() {
    if (process.env.NODE_ENV !== 'development') {
      if (!window.GA_INITIALIZED) {
        initGA();
        window.GA_INITIALIZED = true;
      }
      logPageView();
    }
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

export default Layout;
