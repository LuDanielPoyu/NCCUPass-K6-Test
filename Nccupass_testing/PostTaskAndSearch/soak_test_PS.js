import http from "k6/http";
import { sleep, check, group } from "k6";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
const token =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25jY3VwYXNzLmNvbSIsImlhdCI6MTY5MzAzMjMwOSwiZXhwIjoxNzI0NTY4MzA5LCJhdWQiOiJmcm9udC1lbmQtdXJsIiwic3ViIjoibmNjdXBhc3MiLCJVc2VySWQiOiI2NGNkMWExNDYxMDI4MzY2MzY0ZTNmMTIiLCJFbWFpbCI6IjExMDMwNjAxOUBuY2N1LmVkdS50dyIsIlJvbGUiOiJOQ0NVU3R1ZGVudCJ9.9E0tsk36u1Sfh31GUe3JXm9yyOCIqnHBVNyn_VIe1_0";
const url = "https://api.nccupass.com/nccupass/NormalTask/create";
const url2 =
  "https://api.nccupass.com/nccupass/Task/hashtag-search/%23stress/1/0";

const img = open("img/order.png");

export const options = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10m", target: 100 },
        { duration: "5h", target: 0 },
        { duration: "10m", target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
};

export default function () {
  const fd = new FormData();

  fd.append("Title", "test");
  fd.append("Description", "stress");
  fd.append("TaskImages", http.file(img, "order.png", "image/png"));
  fd.append("TaskHashTags", "#stress");
  fd.append("StartTime", "2023-08-26T06:35:00+08:00");
  fd.append("EndTime", "2023-08-31T06:35:00+08:00");
  fd.append("NeededPeopleNum", "1");
  fd.append("Pay", "20");
  fd.append(
    "StartLocation.Name",
    "小琉球套裝民宿｜你我的相遇－寵物友善3D創意民宿"
  );
  fd.append("StartLocation.Address", "台灣屏東縣復興路");
  fd.append("StartLocation.Lat", "22.342104");
  fd.append("StartLocation.Lng", "120.3654653");
  fd.append("StartLocation.GooglePlaceId", "ChIJAZ4t2fTvcTQRHrciYv8tFr4");
  fd.append(
    "EndLocation.Name",
    "小琉球套裝民宿｜你我的相遇－寵物友善3D創意民宿"
  );
  fd.append("EndLocation.Address", "台灣屏東縣復興路");
  fd.append("EndLocation.Lat", "22.342104");
  fd.append("EndLocation.Lng", "120.3654653");
  fd.append("EndLocation.GooglePlaceId", "ChIJAZ4t2fTvcTQRHrciYv8tFr4");
  fd.append("PaymentMethods", "None");
  const params = {
    headers: {
      accept: "text/plain",
      Authorization: token,
      "Content-Type": `multipart/form-data; boundary=${fd.boundary}`,
    },
  };
  const params2 = {
    headers: {
      accept: "text/plain",
      Authorization: token,
    },
  };

  group("create and search and get detail", function () {
    const res = http.post(url, fd.body(), params);
    sleep(1);

    const res2 = http.get(url2, params2);
    sleep(1);
    const taskId = res2.body.substring(92, 116);
    const url3 = "https://api.nccupass.com/nccupass/Task/" + taskId;

    const res3 = http.get(url3, params2);
    sleep(1);

    check(res, { "status of create was 200": (r) => r.status == 200 });
    check(res2, { "status of search was 200": (r) => r.status == 200 });
    check(res3, { "status of get detail was 200": (r) => r.status == 200 });
  });
}
