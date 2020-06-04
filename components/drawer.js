// NPM Modules
import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Material Core
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { MenuList, MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material Icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import HistoryIcon from '@material-ui/icons/History';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';

// Components
import HideOnScroll from './hideAppBar';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const {
    children,
  } = props;

  const navigateMenu = (page) => {
    router.push(page);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              oCa Trackr
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <MenuList>
          <MenuItem button key="Blog" onClick={() => navigateMenu('/')} selected={router.pathname === '/'}>
            <ListItemIcon><MenuBookIcon /></ListItemIcon>
            <ListItemText
              primary="Blog"
            />
          </MenuItem>
          <MenuItem button key="Community_Posts" onClick={() => navigateMenu('/communityPosts')} selected={router.pathname === '/communityPosts'}>
            <ListItemIcon><SurroundSoundIcon /></ListItemIcon>
            <ListItemText
              primary="Community Posts"
            />
          </MenuItem>
          <MenuItem button key="Recent_Matches" onClick={() => navigateMenu('/matches')} selected={router.pathname === '/matches'}>
            <ListItemIcon><SportsEsportsIcon /></ListItemIcon>
            <ListItemText
              primary="Recent Matches"
            />
          </MenuItem>
          <MenuItem button key="Lifetime_Stats" onClick={() => navigateMenu('/lifetimestats')} selected={router.pathname === '/lifetimestats'}>
            <ListItemIcon><EqualizerIcon /></ListItemIcon>
            <ListItemText
              primary="Lifetime Stats"
            />
          </MenuItem>
          <MenuItem button key="Recent_Stats" onClick={() => navigateMenu('/recentstats')} selected={router.pathname === '/recentstats'}>
            <ListItemIcon><HistoryIcon /></ListItemIcon>
            <ListItemText
              primary="Recent Stats"
            />
          </MenuItem>
          <MenuItem button key="Top_Five" onClick={() => navigateMenu('/topFive')} selected={router.pathname === '/topFive'}>
            <ListItemIcon><FormatListNumberedIcon /></ListItemIcon>
            <ListItemText
              primary="Top Five"
            />
          </MenuItem>
          <MenuItem button key="Settings" onClick={() => navigateMenu('/settings')} selected={router.pathname === '/settings'}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText
              primary="Settings"
            />
          </MenuItem>
        </MenuList>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

MiniDrawer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

export default MiniDrawer;
