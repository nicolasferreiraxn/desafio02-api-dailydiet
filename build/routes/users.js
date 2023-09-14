"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes/users.ts
var users_exports = {};
__export(users_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(users_exports);
var import_zod2 = require("zod");

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333),
  DATABASE_CLIENT: import_zod.z.enum(["sqlite", "pg"]).default("sqlite")
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/users.ts
var import_crypto = __toESM(require("crypto"));
function usersRoutes(app) {
  return __async(this, null, function* () {
    app.post("/register", (request, response) => __async(this, null, function* () {
      const createUserBodySchema = import_zod2.z.object({
        name: import_zod2.z.string().min(3).max(255),
        email: import_zod2.z.string().email(),
        password: import_zod2.z.string().min(6).max(255)
      });
      const { name, email, password } = createUserBodySchema.parse(request.body);
      yield knex("users").insert({
        id: import_crypto.default.randomUUID(),
        name,
        email,
        password
      });
      return response.status(201).send;
    }));
    app.post("/login", (request, response) => __async(this, null, function* () {
      const loginBodySchema = import_zod2.z.object({
        email: import_zod2.z.string().email(),
        password: import_zod2.z.string().min(6).max(255)
      });
      const { email, password } = loginBodySchema.parse(request.body);
      const user = yield knex("users").where({ email }).first();
      if (!user) {
        return response.status(401).send();
      }
      if (password !== user.password) {
        return response.status(401).send();
      }
      let sessionId = request.cookies.sessionId;
      if (!sessionId) {
        sessionId = user.id;
        response.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 1e3 * 60 * 60 * 24 * 7
        });
      }
      return response.status(200).send(user);
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
