import http from "k6/http";
import { sleep, group } from "k6";
import { check } from "k6";

const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25jY3VwYXNzLmNvbSIsImlhdCI6MTY5MzAzMjMwOSwiZXhwIjoxNzI0NTY4MzA5LCJhdWQiOiJmcm9udC1lbmQtdXJsIiwic3ViIjoibmNjdXBhc3MiLCJVc2VySWQiOiI2NGNkMWExNDYxMDI4MzY2MzY0ZTNmMTIiLCJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCJ9.9E0tsk36u1Sfh31GUe3JXm9yyOCIqnHBVNyn_VIe1_0";
const url1 =
  "https://api.nccupass.com/nccupass/NormalTask/detail/64f6990db32d44ce65b9f07c";
const url2 =
  "https://api.nccupass.com/nccupass/NormalTask/detail/64f7532416676d40367d77e4";
const url3 =
  "https://api.nccupass.com/nccupass/NormalTask/detail/64fac0dab80cf32a53fa316d";

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

  group("get three tasks detail", function () {
    const res1 = http.get(url1, params);
    sleep(1);
    const res2 = http.get(url2, params);
    sleep(1);
    const res3 = http.get(url3, params);
    sleep(1);

    check(res1, { "status of first task was 200": (r) => r.status == 200 });
    check(res2, { "status of second task was 200": (r) => r.status == 200 });
    check(res3, { "status of third task was 200": (r) => r.status == 200 });
  });
}
