import cookie from 'js-cookie';

export const setCookie = (path, key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      path: '/',
    });

    // FIXME: Temp just because I was adding cookies by the path at one point
    // And it doesn't work with React because it only worked on hard refresh
    cookie.remove(key, { path });
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {});
  }
};

const getCookieFromBrowser = (key) => cookie.get(key);

const getCookieFromServer = (key, req) => {
  if (!req || !req.headers || !req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};

export const getCookie = (key, req) => {
  if (process.browser) {
    return getCookieFromBrowser(key);
  }
  return getCookieFromServer(key, req);
};