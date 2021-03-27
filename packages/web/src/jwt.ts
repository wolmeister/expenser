const LOCAL_STORAGE_JWT_KEY = '@Expenser/jwt';

let storedJwt = localStorage.getItem(LOCAL_STORAGE_JWT_KEY);

export function setJwt(jwt: string | null) {
  storedJwt = jwt;

  if (jwt) {
    localStorage.setItem(LOCAL_STORAGE_JWT_KEY, jwt);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_JWT_KEY);
  }
}

export function getJwt() {
  return storedJwt;
}
