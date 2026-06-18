import { Schema } from "mongoose";

// Single-document store for the portfolio owner's LinkedIn connection.
// Lives in the blogs DB (same connection as blogPost). The access token is
// server-only and is never sent to the client — the /status route returns
// just a connected/expired summary.
//
// We key the document by `owner` (the portfolio owner's email) so there is
// exactly one connection row, upserted on every (re)connect.
export const linkedInIntegrationSchema = new Schema(
  {
    owner: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true },
    personUrn: { type: String, required: true },
    displayName: { type: String },
    scope: { type: String },
    expiresAt: { type: Date, required: true },
    connectedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);
