import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  entries: defineTable({
    input: v.string(),
    response: v.string(),
    advid: v.id("newadv"),
    imageUrl: v.optional(v.string()),
    health: v.number(),
    inventory: v.array(v.string()),
  }),
 newadv: defineTable({
    characterclass: v.string(),
  }),
  items: defineTable({
    itemName: v.string(),
    imageUrl: v.optional(v.string()),
  }),
});