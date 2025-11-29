"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

// Note: This action just generates an upload URL
// After the client uploads the file to that URL, the storageId is returned
// The client then uses that storageId in subsequent mutations
export default action({
  args: {
    filename: v.string(),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a presigned URL for direct file upload to Convex storage
    const uploadUrl = await ctx.storage.generateUploadUrl();

    return {
      uploadUrl,
    };
  },
});