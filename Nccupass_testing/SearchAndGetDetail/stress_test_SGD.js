import http from "k6/http";
import { sleep, check, group } from "k6";
const token =
  "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCIsIlVzZXJJZCI6IjY0Y2QxYTE0NjEwMjgzNjYzNjRlM2YxMiIsImV4cCI6MTcyNjAxNzQwMCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI0MyIsImF1ZCI6ImZyb250LWVuZC11cmwifQ.Y9dgSV07T4ow_m9TzKHJPswgBLTo8DOAEP4CsRDh2os";
const url = "https://localhost:7243/nccupass/Task/title-search/test/1/0";

export const options = {
  stages: [
    { duration: "10m", target: 100 }, // 5 minutes at 50 VUs
    { duration: "30m", target: 100 }, // 10 minutes at 100 VUs
    { duration: "10m", target: 0 }, // 5 minutes at 0 VUs (ramp down)
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
