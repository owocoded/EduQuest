"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

// Note: This action generates an upload URL
// The client uploads the file to this URL and gets a storageId
// The client then uses that storageId in subsequent operations
export default action({
  args: {},
  handler: async (ctx, args) => {
    // Generate a presigned URL for direct file upload to Convex storage
    // The latest version of Convex storage.generateUploadUrl() doesn't take parameters
    const uploadUrl = await ctx.storage.generateUploadUrl();

    return {
      uploadUrl,
    };
  },
});