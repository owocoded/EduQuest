"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { ActionCtx } from "../_generated/server";

export default action({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx: ActionCtx, args: { storageId: any }) => {
    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new Error("Could not retrieve file from storage");
    }

    // Fetch the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Could not fetch file: ${fileResponse.statusText}`);
    }

    // Get the content type to determine the file type
    const contentType = fileResponse.headers.get('content-type') || '';
    const content = await fileResponse.arrayBuffer();

    // For text files, we can directly decode the content
    if (contentType.includes('text/plain') || fileUrl.endsWith('.txt')) {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(content);
    } else {
      // For other file types (PDF, DOCX, PPTX), we return a message indicating
      // that text extraction should happen client-side before upload
      // This is the recommended approach in Convex since server-side processing
      // of these complex formats is not straightforward
      return `File was uploaded successfully. Text extraction for complex formats (PDF, DOCX, PPTX) happens client-side before upload in a complete implementation. File size: ${content.byteLength} bytes.`;
    }
  },
});