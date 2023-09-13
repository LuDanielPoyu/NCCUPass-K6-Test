import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

const token =
  "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCIsIlVzZXJJZCI6IjYzODViMTcwNGI3OWM0MTZkNzZlZDQ4OCIsImV4cCI6MTcyNTcyOTQxNCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI0MyIsImF1ZCI6ImZyb250LWVuZC11cmwifQ.7-CD_uqKGQSo-O4i_533I5qaBkPHuI1BgIQKnUIO_lA";
const url =
  "https://localhost:7243/nccupass/NormalTask/detail/64e8bc83990885dffdeedf1f";
const url2 =
  "https://localhost:7243/nccupass/NormalTask/detail/64e862e2bd00747f7f04525e";
const url3 =
  "https://localhost:7243/nccupass/NormalTask/detail/64e72e52bd00747f7f03f1aa";
export const options = {
  stages: [
    { duration: "1m", target: 100 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "30m", target: 100 }, // stay at 100 users for 8 hours!!!
    // { duration: '1.6h', target: 100 }, // stay at 100 users for 8 hours!!!
    { duration: "1m", target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
  const params = {
    headers: {
      accept: "text/plain",
      Authorization: token,
    },
    timeout: "120s",
  };

  group("get three tasks", function () {
    const res = http.get(url, params);
    const res2 = http.get(url2, params);
    const res3 = http.get(url3, params);
  });

  check(res, {
    "Status of get first task is 200": (r) => r.status === 200,
  });
  check(res2, {
    "Status of get second task is 200": (r) => r.status === 200,
  });
  check(res3, {
    "Status of get third task is 200": (r) => r.status === 200,
  });

  sleep(1);
}
