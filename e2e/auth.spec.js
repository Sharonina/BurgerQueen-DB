const config = require("../config");

const { fetch } = process;

describe("POST /users/login", () => {
  it("should respond with 400 when email and password missing", () =>
    fetch("/users/login", { method: "POST" }).then((resp) => {
      expect(resp.status).toBe(400);
    }));

  it("should respond with 400 when email is missing", () =>
    fetch("/users/login", {
      method: "POST",
      body: { email: "", password: "xxxx" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("should respond with 400 when password is missing", () =>
    fetch("/users/login", {
      method: "POST",
      body: { email: "foo@bar.baz" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("fail with 404 credentials dont match", () =>
    fetch("/users/login", {
      method: "POST",
      body: { email: `foo-${Date.now()}@bar.baz`, password: "xxxx" },
    }).then((resp) => expect(resp.status).toBe(404)));

  it("should create new users token and allow access using it", () =>
    fetch("/users/login", {
      method: "POST",
      body: { email: config.adminEmail, password: config.adminPassword },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then(({ token }) => {
        expect(token).toBeTruthy();
      }));
});
