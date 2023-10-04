import http from "k6/http";
import { sleep, check, group } from "k6";
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25jY3VwYXNzLmNvbSIsImlhdCI6MTY5MzAzMjMwOSwiZXhwIjoxNzI0NTY4MzA5LCJhdWQiOiJmcm9udC1lbmQtdXJsIiwic3ViIjoibmNjdXBhc3MiLCJVc2VySWQiOiI2NGNkMWExNDYxMDI4MzY2MzY0ZTNmMTIiLCJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCJ9.9E0tsk36u1Sfh31GUe3JXm9yyOCIqnHBVNyn_VIe1_0";
const url = "https://api.nccupass.com/nccupass/Task/createdTasks/all";
const url2 =
  "https://api.nccupass.com/nccupass/NormalTask/detail/64fd7d813d057880271fa482";
const url3 =
  "https://api.nccupass.com/nccupass/NormalTask/candidates/64fd7d813d057880271fa482";
const url4 =
  "https://api.nccupass.com/nccupass/NormalTask/candidates/detail/650bc5a7094d94d27114c783";

export const options = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10m", target: 100 },
        { duration: "8h", target: 100 },
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

    const res2 = http.get(url2, params);
    sleep(1);

    const res3 = http.get(url3, params);
    sleep(1);

    const res4 = http.get(url4, params);
    sleep(1);
    if (res1.status != 200) {
      console.log("getCreatedTask didn't pass, code: " + res1.status);
    }
    if (res2.status != 200) {
      console.log("getTaskDetail didn't pass, code: " + res1.status);
    }
    if (res3.status != 200) {
      console.log("getCandidates didn't pass, code: " + res1.status);
    }
    if (res4.status != 200) {
      console.log("getCandidateDetail didn't pass, code: " + res1.status);
    }

    check(res1, { "status of getCreatedTask was 200": (r) => r.status == 200 });
    check(res2, { "status of getTaskDetail was 200": (r) => r.status == 200 });
    check(res3, { "status of getCandidates was 200": (r) => r.status == 200 });
    check(res4, {
      "status of getCandidateDetail was 200": (r) => r.status == 200,
    });
  });
}
