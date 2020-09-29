const assert = require("assert");
const request = require("supertest");
const app = require("../../app");
const Driver = require("../../models/driver");

describe("drivers controller", () => {
  it("post to /api/drivers creates a new driver", (done) => {
    Driver.countDocuments().then((count) => {
      request(app)
        .post("/api/drivers")
        .send({ email: "test@test.com" })
        .end(() => {
          Driver.countDocuments().then((newCount) => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it("put to /api/drivers/id edits an existing driver", (done) => {
    const driver = new Driver({ email: "t@t.com", driving: true });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: "t@t.com" }).then((driver) => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it("delete to /api/drivers/id deletes a driver", (done) => {
    const driver = new Driver({ email: "test@test.com" });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: "text@test.com" }).then((driver) => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it("get to /api/drivers finds drivers in a location", (done) => {
    const seattleDriver = new Driver({
      email: "seattle@test.com",
      geometry: { type: "Point", coordinates: [-122.4759902, 47.6147] },
    });
    const miamiDriver = new Driver({
      email: "miami@test.com",
      geometry: { type: "Point", coordinates: [-80.253, 25.791] },
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app)
        .get("/api/drivers?lng=-80&lat=25")
        .end((err, response) => {
          // assert(response.body.length === 1);
          // assert(response.body[0].email === "miami@test.com");
          done();
        });
    });
  });
});
