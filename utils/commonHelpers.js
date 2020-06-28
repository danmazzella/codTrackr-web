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

export const calculateTimePlayed = (timePlayedSec, minOnly = false) => {
  const timePlayedMin = timePlayedSec / 60;
  const timePlayedHr = timePlayedMin / 60;

  let timePlayedStr;
  if (timePlayedHr >= 24) {
    // Format days and hours
    const numDays = Math.floor(timePlayedHr / 24);
    const numHours = Math.floor(timePlayedHr - (numDays * 24));
    const dayOrDays = numDays === 1 ? 'day' : 'days';
    const hourOrHours = numHours === 1 ? 'hour' : 'hours';
    timePlayedStr = `${numDays} ${dayOrDays} ${numHours} ${hourOrHours}`;
  } else if (timePlayedHr < 24) {
    // Format hour
    const numHours = Math.floor(timePlayedHr);
    const numMin = Math.floor(timePlayedMin - (numHours * 60));
    const hourOrHours = numHours === 1 ? 'hour' : 'hours';
    if (minOnly) {
      timePlayedStr = `${numMin} min`;
    } else {
      timePlayedStr = `${numHours} ${hourOrHours} ${numMin} min`;
    }
  } else {
    // Format minutes
    timePlayedStr = `${Math.floor(timePlayedMin)} min`;
  }

  return timePlayedStr;
};

export const normalizeMonthFilter = (value) => {
  const split = value.split('/');
  return {
    month: split[0],
    year: split[1],
  };
};

export const getMonthFilters = () => {
  const startMonth = 3;
  const startYear = 2020;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  let tmpMonth = startMonth;
  let tmpYear = startYear;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const monthsArr = [{
    month: -1,
    year: -1,
    monthName: 'All',
  }];
  let current = false;

  do {
    monthsArr.push({
      month: tmpMonth,
      year: tmpYear,
      monthName: `${monthNames[tmpMonth - 1]}-${tmpYear}`,
    });

    if (tmpMonth === currentMonth && tmpYear === currentYear) {
      current = true;
    }

    tmpMonth += 1;
    if (tmpMonth > 12) {
      tmpMonth = 1;
      tmpYear += 1;
    }
  }
  while (current === false);

  return monthsArr.reverse();
}
