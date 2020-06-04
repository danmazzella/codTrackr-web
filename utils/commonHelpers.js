import Divider from '@material-ui/core/Divider';

export const appendLeadingZeroes = (n) => {
  if (n <= 9) {
    return '0'.concat(n);
  }

  return n;
};

export const formatDate = (date, showSeconds = false) => {
  let hours = date.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = (hours === 0 ? 12 : hours);

  let seconds = '';
  if (showSeconds === true) {
    seconds = ` ${appendLeadingZeroes(date.getSeconds())}`;
  }

  return (
    `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()} ${hours}:${appendLeadingZeroes(date.getMinutes())}${seconds} ${amPm}`
  );
};

export const getTotalDowns = (match) => {
  let downs = 0;
  match.matches.map((player) => {
    downs += player.stats.downsInCircleOne !== undefined ? player.stats.downsInCircleOne : 0;
    downs += player.stats.downsInCircleTwo !== undefined ? player.stats.downsInCircleTwo : 0;
    downs += player.stats.downsInCircleThree !== undefined ? player.stats.downsInCircleThree : 0;
    downs += player.stats.downsInCircleFour !== undefined ? player.stats.downsInCircleFour : 0;
    downs += player.stats.downsInCircleFive !== undefined ? player.stats.downsInCircleFive : 0;
    downs += player.stats.downsInCircleSix !== undefined ? player.stats.downsInCircleSix : 0;
    return null;
  });

  return downs;
};

export const getTotalKills = (match) => {
  let kills = 0;
  match.matches.map((player) => {
    kills += player.stats.kills;
    return null;
  });

  return kills;
};

export const shouldAddDivider = (matches, playerIdx) => {
  if (playerIdx < matches.length - 1) {
    return <div><br /><Divider /><br /></div>;
  }
  return null;
};

export const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getPlayerNames = (match) => {
  const playerNames = [];
  match.matches.map((player) => {
    playerNames.push(player.playerName);
    return null;
  });

  return playerNames.join(', ');
};