import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25jY3VwYXNzLmNvbSIsImlhdCI6MTY5MzAzMjMwOSwiZXhwIjoxNzI0NTY4MzA5LCJhdWQiOiJmcm9udC1lbmQtdXJsIiwic3ViIjoibmNjdXBhc3MiLCJVc2VySWQiOiI2NGNkMWExNDYxMDI4MzY2MzY0ZTNmMTIiLCJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCJ9.9E0tsk36u1Sfh31GUe3JXm9yyOCIqnHBVNyn_VIe1_0";
const url_get20missions =
  "https://api.nccupass.com/nccupass/NormalTask/mainPage/20/0";

export const options = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10m", target: 100 },
        { duration: "30m", target: 100 },
        { duration: "10m", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
};

export default function () {
  const params = {
    headers: {
      accept: "text/plain",
      Authorization: token,
    },
  };
  const res = http.get(url_get20missions, params);
  check(res, { "status was 200": (r) => r.status == 200 });
  if (res.status != 200) {
    console.log("test didn't pass, code: " + res.status);
  }
  sleep(1);
}
