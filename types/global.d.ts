// types/global.d.ts
import mongooseLib from "mongoose";

declare module "bootstrap/dist/css/bootstrap.min.css";
declare module "./globals.css";
declare module "*.css";
declare module "*.scss";

declare global {
    var mongoose: {
        conn: typeof mongooseLib | null;
        promise: Promise<typeof mongooseLib> | null;
    };
}
