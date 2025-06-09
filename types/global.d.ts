// types/global.d.ts
import mongooseLib from "mongoose";

declare global {
    var mongoose: {
        conn: typeof mongooseLib | null;
        promise: Promise<typeof mongooseLib> | null;
    };
}
