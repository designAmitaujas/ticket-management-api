import "dotenv/config";
import "reflect-metadata";

import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs-extra";
import { parse } from "graphql";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import path from "path";
import { buildSchema } from "type-graphql";
import { upload } from "./config/multer.config";
import { MAX_AGE } from "./constant";
import { AppDataSource } from "./data-source";
import { PORT } from "./env";
// import { PaymentResolver } from "./resolvers/PaymentResolver";
import { AppTicketResolver } from "./resolvers/AppTicketResolver";
import { AppUserResolver } from "./resolvers/AppUserResolver";
import { DepartmentResolver } from "./resolvers/DepartmentResolver";
import { EmailResolver } from "./resolvers/EmailResolver";
import { TicketBackAndForthResolver } from "./resolvers/TicketResolver";
import { TicketTransferResolver } from "./resolvers/TicketTransferResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { seedFunction } from "./seed";
import { cache } from "./utils";

(async () => {
  try {
    const app = express();

    await fs.ensureDir("uploads");

    app.use(compression());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "build")));

    const [schema] = await Promise.all([
      buildSchema({
        resolvers: [
          AppTicketResolver,
          AppUserResolver,
          DepartmentResolver,
          UserResolver,
          TicketBackAndForthResolver,
          EmailResolver,
          TicketTransferResolver,
        ],
      }),
      AppDataSource.initialize(),
    ]);

    app.use("/graphql", async (req: Request, res: Response) => {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      if (shouldRenderGraphiQL(request)) {
        res.send(renderGraphiQL());
      } else {
        const { operationName, query, variables } =
          getGraphQLParameters(request);

        const result = await processRequest({
          operationName,
          query,
          variables,
          request,
          schema,
          parse: (source, options) => {
            if (!cache.get(query)) {
              cache.set(query, parse(source, options));
            }

            return cache.get(query);
          },

          contextFactory: () => ({ req, res }),
        });

        sendResult(result, res);
      }
    });

    app.get("/upload/:id", async (req: Request, res: Response) => {
      res.set("Cache-control", `public, max-age=${MAX_AGE}`);
      return res.sendFile(req.params.id, {
        root: path.resolve(process.cwd() + "/uploads/"),
      });
    });

    app.post("/upload", upload.single("image"), async (req, res) => {
      return res.json({
        success: true,
        msg: "file saved",
        data: {
          fileName: req.file?.filename || "",
        },
      });
    });

    app.use("*", function (req, res) {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });

    await seedFunction();

    app.listen(PORT, () => {
      console.log(`App started @${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
