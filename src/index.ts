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
import { BannerResolver } from "./resolvers/BannerResolver";
import { BranchAchivementResovler } from "./resolvers/BranchAchivementResolver";
import { ChairmanHistoryResolver } from "./resolvers/ChairmanHistoryResolver";
import { CmsResolver } from "./resolvers/CmsResolver";
import { CompanySetupResolver } from "./resolvers/CompanySetupResolver";
import { DownloadResolver } from "./resolvers/DownloadResolver";
import { EmailResolver } from "./resolvers/EmailResolver";
import { EventResolver } from "./resolvers/EventResolver";
import { FooterLinkResolver } from "./resolvers/FooterLinkResolver";
import { GalleryResolver } from "./resolvers/GallaryResolver";
import { HelloResolver } from "./resolvers/HelloResolver";
import { HomePortalResolver } from "./resolvers/HomePortalResolver";
import { IcaiTrainingResolver } from "./resolvers/IcaiTrainingResolver";
import { MemberRegistrationManagementResolver } from "./resolvers/MemberRegistrationManagementResolver";
// import { PaymentResolver } from "./resolvers/PaymentResolver";
import { EventRegistrationResolver } from "./resolvers/EventRegistrationResolver";
import { PublicationResolver } from "./resolvers/PublicationResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { ManagingCommitteeResolver } from "./resolvers/managingCommitteeResolver";
import { MenuResolver } from "./resolvers/menuResolver";
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
          DownloadResolver,
          EmailResolver,
          FooterLinkResolver,
          HelloResolver,
          ManagingCommitteeResolver,
          PublicationResolver,
          UserResolver,
          DownloadResolver,
          GalleryResolver,
          BannerResolver,
          ChairmanHistoryResolver,
          BranchAchivementResovler,
          MenuResolver,
          CmsResolver,
          HomePortalResolver,
          EventResolver,
          IcaiTrainingResolver,
          MemberRegistrationManagementResolver,
          CompanySetupResolver,
          EventRegistrationResolver,
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
