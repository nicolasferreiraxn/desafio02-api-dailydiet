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

// src/routes/meals.ts
var meals_exports = {};
__export(meals_exports, {
  mealsRoutes: () => mealsRoutes
});
module.exports = __toCommonJS(meals_exports);
var import_zod2 = require("zod");

// src/middlawares/check-session-id-exists.ts
function checkSessionIdExists(request, response) {
  return __async(this, null, function* () {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return response.status(401).send();
    }
  });
}

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

// src/routes/meals.ts
var import_crypto = __toESM(require("crypto"));
function mealsRoutes(app) {
  return __async(this, null, function* () {
    app.addHook("preHandler", checkSessionIdExists);
    app.post("/", (request, response) => __async(this, null, function* () {
      const mealBodySchema = import_zod2.z.object({
        name: import_zod2.z.string().min(3).max(255),
        description: import_zod2.z.string().min(3).max(255),
        diet: import_zod2.z.boolean(),
        mealAt: import_zod2.z.coerce.date()
      });
      const { name, description, diet, mealAt } = mealBodySchema.parse(
        request.body
      );
      const { sessionId } = request.cookies;
      yield knex("meals").insert({
        id: import_crypto.default.randomUUID(),
        name,
        description,
        diet,
        user_id: sessionId,
        meal_at: mealAt
      });
      return response.status(201).send();
    }));
    app.get("/", (request, response) => __async(this, null, function* () {
      const { sessionId } = request.cookies;
      const meals = yield knex("meals").where({ user_id: sessionId });
      return response.status(200).send({
        meals
      });
    }));
    app.get("/:id", (request, response) => __async(this, null, function* () {
      const getMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = getMealParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const meal = yield knex("meals").where({ id, user_id: sessionId }).first();
      if (!meal) {
        return response.status(404).send();
      }
      return response.status(200).send({
        meal
      });
    }));
    app.delete("/:id", (request, response) => __async(this, null, function* () {
      const deleteMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = deleteMealParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const meal = yield knex("meals").where({ id, user_id: sessionId }).first();
      if (!meal) {
        return response.status(404).send();
      }
      yield knex("meals").where({ id }).del();
      return response.status(204).send();
    }));
    app.put("/:id", (request, response) => __async(this, null, function* () {
      const updateMealParamsSchema = import_zod2.z.object({
        id: import_zod2.z.string().uuid()
      });
      const { id } = updateMealParamsSchema.parse(request.params);
      const updateMealBodySchema = import_zod2.z.object({
        name: import_zod2.z.string().min(3).max(255),
        description: import_zod2.z.string().min(3).max(255),
        diet: import_zod2.z.boolean(),
        mealAt: import_zod2.z.coerce.date()
      });
      const { name, description, diet, mealAt } = updateMealBodySchema.parse(
        request.body
      );
      const { sessionId } = request.cookies;
      const meal = yield knex("meals").where({ id, user_id: sessionId }).first();
      if (!meal) {
        return response.status(404).send();
      }
      yield knex("meals").where({ id }).update({
        name,
        description,
        diet,
        meal_at: mealAt
      });
      return response.status(204).send();
    }));
    app.get("/metrics", (request, response) => __async(this, null, function* () {
      const { sessionId } = request.cookies;
      const meals = yield knex("meals").where({ user_id: sessionId });
      const { totalMealsInDiet, totalMealsNotInDiet } = meals.reduce(
        (acc, meal) => {
          if (meal.diet) {
            acc.totalMealsInDiet += 1;
          } else {
            acc.totalMealsNotInDiet += 1;
          }
          return acc;
        },
        {
          totalMealsInDiet: 0,
          totalMealsNotInDiet: 0
        }
      );
      const { bestSequenceInDiet, totalSequenceInDiet } = meals.reduce(
        (acc, meal) => {
          if (meal.diet) {
            acc.totalSequenceInDiet += 1;
          } else {
            acc.totalSequenceInDiet = 0;
          }
          if (acc.totalSequenceInDiet > acc.bestSequenceInDiet) {
            acc.bestSequenceInDiet = acc.totalSequenceInDiet;
          }
          return acc;
        },
        {
          bestSequenceInDiet: 0,
          totalSequenceInDiet: 0
        }
      );
      return response.status(200).send({
        metrics: {
          totalMeals: meals.length,
          totalMealsInDiet,
          totalMealsNotInDiet,
          bestSequenceInDiet,
          totalSequenceInDiet
        }
      });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mealsRoutes
});
