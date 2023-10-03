import http from "k6/http";
import { sleep, check, group } from "k6";
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25jY3VwYXNzLmNvbSIsImlhdCI6MTY5MzAzMjMwOSwiZXhwIjoxNzI0NTY4MzA5LCJhdWQiOiJmcm9udC1lbmQtdXJsIiwic3ViIjoibmNjdXBhc3MiLCJVc2VySWQiOiI2NGNkMWExNDYxMDI4MzY2MzY0ZTNmMTIiLCJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCJ9.9E0tsk36u1Sfh31GUe3JXm9yyOCIqnHBVNyn_VIe1_0";
const url =
  "https://api.nccupass.com/nccupass/Task/title-search/test/1/0?isRecord=false";

export const options = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10m", target: 100 },
        { duration: "8h", target: 0 },
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
  group("get 1 with keyword then get first detail", function () {
    const res1 = http.get(url, params);
    sleep(1);
    const taskId = res1.body.substring(87, 111);
    const url2 = "https://api.nccupass.com/nccupass/Task/" + taskId;

    const res2 = http.get(url2, params);
    sleep(1);
    if (res1.status != 200) {
      console.log("First test didn't pass, code: " + res1.status);
      console.log(res1.body);
    }
    if (res2.status != 200) {
      console.log("Second test didn't pass, code: " + res1.status);
    }
    check(res1, { "status of search was 200": (r) => r.status == 200 });
    check(res2, { "status of get detail was 200": (r) => r.status == 200 });
  });
}
