import http from "k6/http";
import { sleep, check, group } from "k6";
const token =
  "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCIsIlVzZXJJZCI6IjY0Y2QxYTE0NjEwMjgzNjYzNjRlM2YxMiIsImV4cCI6MTcyNjEwNjcyOSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI0MyIsImF1ZCI6ImZyb250LWVuZC11cmwifQ.PbS2Gd2gF17Pzr7GZAjbufl0Gyh5vWtR5NWZP3Q0Zt0";
const url = "https://localhost:7243/nccupass/Task/title-search/test/1/0";

export const options = {
  stages: [
    { duration: "5m", target: 200 }, // traffic ramp-up from 1 to 100 users over 5 minutes.
    { duration: "8h", target: 200 }, // stay at 100 users for 8 hours!!!
    // { duration: '1.6h', target: 100 }, // stay at 100 users for 8 hours!!!
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
};
export default function () {
  const params = {
    headers: {
      accept: "text/plain",
      Authorization: token,
    },
  };
  group("get 1 with keyword then get first detail", function () {
    const res = http.get(url, params);
    const taskId = res.body.substring(87, 111);
    check(res, { "status of task was 200": (r) => r.status == 200 });
    let url2 = "https://localhost:7243/nccupass/Task/" + taskId;
    const res2 = http.get(url2, params);
    check(res2, { "status of detail was 200": (r) => r.status == 200 });
  });
  sleep(1);
}
