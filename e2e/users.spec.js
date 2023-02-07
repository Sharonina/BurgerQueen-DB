const config = require("../config");

const { fetch, fetchAsTestUser, fetchAsAdmin, fetchWithAuth } = process;

describe("GET /users", () => {
  it("should fail with 401 when no auth", () =>
    fetch("/users").then((resp) => expect(resp.status).toBe(401)));

  it("should fail with 403 when not admin", () =>
    fetchAsTestUser("/users").then((resp) => expect(resp.status).toBe(403)));

  it("should get users", () =>
    fetchAsAdmin("/users")
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(Array.isArray(json)).toBe(true);
        expect(json.length > 0).toBe(true);
      }));
});

describe("GET /users/:uid", () => {
  it("should fail with 401 when no auth", () =>
    fetch("/users/foo@bar.baz").then((resp) => expect(resp.status).toBe(401)));

  it("should fail with 403 when not owner nor admin", () =>
    fetchAsTestUser(`/users/63e15152a6bf2fcd3dc8f6f9`).then((resp) =>
      expect(resp.status).toBe(403)
    ));

  it("should fail with 404 when admin and not found", () =>
    fetchAsAdmin("/users/63e15152a6bf2fcd3dc8f6f9").then((resp) =>
      expect(resp.status).toBe(404)
    ));

  it("should get own user", () =>
    fetchAsAdmin(`/users/${config.adminId}`)
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.email).toBe("shadmin@gmail.com")));

  it("should get other user as admin", () =>
    fetchAsAdmin(`/users/${config.testUserId}`)
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.email).toBe("test@test.com")));
});

describe("POST /users", () => {
  it("should respond with 400 when email and password missing", () =>
    fetchAsAdmin("/users", { method: "POST" }).then((resp) =>
      expect(resp.status).toBe(400)
    ));

  it("should respond with 400 when email is missing", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: { email: "", password: "xxxx" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("should respond with 400 when password is missing", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: { email: "foo@bar.baz" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("should fail with 400 when invalid email", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: { email: "failemail", password: "123456" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("should fail with 400 when invalid password", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: { email: "email@test.tes", password: "12" },
    }).then((resp) => expect(resp.status).toBe(400)));

  it("should create new user", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: {
        first_name: "test",
        last_name: "testito",
        email: "test@testito.com",
        password: "test",
        role: "chef",
        admin: "false",
        restaurant: "63db2d8dd4a39b95d1f7f5eb",
      },
    }).then((resp) => {
      expect(resp.status).toBe(200);
      return resp.json();
    }));
  /* .then((json) => {
        expect(typeof json._id).toBe("string");
        expect(typeof json.email).toBe("string");
        expect(typeof json.password).toBe("string");
        expect(typeof json.role).toBe("string");
        expect(typeof json.admin).toBe(false);
      }) */

  it("should create new admin user", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: {
        restaurant: {
          name: "Las hamburguesitas",
        },
        admin: {
          first_name: "Sharon",
          last_name: "Arana",
          email: "shadmins@gmail.com",
          password: "luckychan",
          role: "admin",
        },
      },
    }).then((resp) => {
      expect(resp.status).toBe(200);
      return resp.json();
    }));
  /* .then((json) => {
        expect(typeof json._id).toBe("string");
        expect(typeof json.email).toBe("string");
        expect(typeof json.password).toBe("undefined");
        expect(typeof json.roles).toBe("object");
        expect(json.roles.admin).toBe(true);
      }) */

  it("should fail with 403 when user is already registered", () =>
    fetchAsAdmin("/users", {
      method: "POST",
      body: {
        first_name: "test",
        last_name: "testito",
        email: "test@test.com",
        password: "test",
        role: "chef",
        /* email: "test@test.com", password: "123456" */
      },
    }).then((resp) => expect(resp.status).toBe(403)));
});

describe("PUT /users/:uid", () => {
  it("should fail with 401 when no auth", () =>
    fetch("/users/foo@bar.baz", { method: "PUT" }).then((resp) =>
      expect(resp.status).toBe(401)
    ));

  it("should fail with 403 when not owner nor admin", () =>
    fetchAsTestUser(`/users/${config.adminEmail}`, { method: "PUT" }).then(
      (resp) => expect(resp.status).toBe(403)
    ));

  it("should fail with 404 when admin and not found", () =>
    fetchAsAdmin("/users/63e15152a6bf2fcd3dc8f6f9", { method: "PUT" }).then(
      (resp) => expect(resp.status).toBe(404)
    ));

  /* it("should fail with 400 when no props to update", () =>
    fetchAsTestUser("/users/test@test.test", { method: "PUT" }).then((resp) =>
      expect(resp.status).toBe(400)
    )); */

  it("should fail with 403 when not admin tries to change own roles", () =>
    fetchAsTestUser("/users/test@test.test", {
      method: "PUT",
      body: { roles: { admin: true } },
    }).then((resp) => expect(resp.status).toBe(403)));

  it("should update user when own data (name change)", () =>
    fetchAsAdmin(`/users/${config.adminId}`, {
      method: "PUT",
      body: { name: "sharonina" },
    }).then((resp) => expect(resp.status).toBe(200)));

  it("should update user when admin", () =>
    fetchAsAdmin(`/users/${config.testUserId}`, {
      method: "PUT",
      body: { name: "testss" },
    }).then((resp) => expect(resp.status).toBe(200)));
});

describe("DELETE /users/:uid", () => {
  it("should fail with 401 when no auth", () =>
    fetch("/users/foo@bar.baz", { method: "DELETE" }).then((resp) =>
      expect(resp.status).toBe(401)
    ));

  it("should fail with 403 when not owner nor admin", () =>
    fetchAsTestUser(`/users/${config.adminEmail}`, { method: "DELETE" }).then(
      (resp) => expect(resp.status).toBe(403)
    ));

  it("should fail with 404 when admin and not found", () =>
    fetchAsAdmin("/users/abc@def.ghi", { method: "DELETE" }).then((resp) =>
      expect(resp.status).toBe(404)
    ));

  it("should delete own user", () => {
    const credentials = {
      email: `foo-${Date.now()}@bar.baz`,
      password: "1234",
    };
    return fetchAsAdmin("/users", { method: "POST", body: credentials })
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetch("/auth", { method: "POST", body: credentials }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then(({ token }) =>
        fetchWithAuth(token)(`/users/${credentials.email}`, {
          method: "DELETE",
        })
      )
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetchAsAdmin(`/users/${credentials.email}`))
      .then((resp) => expect(resp.status).toBe(404));
  });

  it("should delete other user as admin", () => {
    const credentials = {
      first_name: "test",
      last_name: "testito",
      email: "newtest@test.com",
      password: "test",
      role: "chef",
    };
    return fetchAsAdmin("/users", { method: "POST", body: credentials })
      .then((resp) => expect(resp.status).toBe(201))
      .then(() =>
        fetchAsAdmin(`/users/${credentials.email}`, { method: "DELETE" })
      )
      .then((resp) => expect(resp.status).toBe(200))
      .then(() => fetchAsAdmin(`/users/${credentials.email}`))
      .then((resp) => expect(resp.status).toBe(404));
  });
});
