/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_extractText from "../actions/extractText.js";
import type * as actions_generateQuestions from "../actions/generateQuestions.js";
import type * as actions_generateUploadUrl from "../actions/generateUploadUrl.js";
import type * as actions_generateWithGemini from "../actions/generateWithGemini.js";
import type * as actions_generateWithHuggingFace from "../actions/generateWithHuggingFace.js";
import type * as mutations_saveGeneratedQuestions from "../mutations/saveGeneratedQuestions.js";
import type * as mutations_uploadMaterial from "../mutations/uploadMaterial.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/extractText": typeof actions_extractText;
  "actions/generateQuestions": typeof actions_generateQuestions;
  "actions/generateUploadUrl": typeof actions_generateUploadUrl;
  "actions/generateWithGemini": typeof actions_generateWithGemini;
  "actions/generateWithHuggingFace": typeof actions_generateWithHuggingFace;
  "mutations/saveGeneratedQuestions": typeof mutations_saveGeneratedQuestions;
  "mutations/uploadMaterial": typeof mutations_uploadMaterial;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
