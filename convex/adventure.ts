import {v} from "convex/values"
import { internalAction, internalQuery, mutation} from "./_generated/server";
import { api, internal } from "./_generated/api";
import OpenAI from 'openai';

const openai = new OpenAI();

export const insertAdventure = mutation({
 
    handler: async (ctx) => {
     const id = await ctx.db.insert("newadv", {
        characterclass: "Wizards",
     });

     //TODO: fire action, tell openAI we want to play an text-based lovemeadv game
    ctx.scheduler.runAfter(0, internal.adventure.insertAdvententries, {
      advid: id,
    });

     return id;
    },
  });

  export const getAdventure = internalQuery({
      args: {
      advid: v.id("newadv"),
      },
      handler: async (ctx, args) => {
         return await ctx.db.get(args.advid);
},
});
 
export const insertAdvententries = internalAction({
    args: {
    advid: v.id("newadv"),
    },
  handler: async (ctx, args) => {
    
   const adventure = await ctx.runQuery(internal.adventure.getAdventure, args);

   if(!adventure) {
     throw new Error('Adventure not found');
   }
    const input = `
    You are a potential sorting hat in a text based lovemesomeadventure game.
    You will set up an adventure which involve having the character to fight
    random deathly hallows, reward loots after killing deathly hallows, giving
    aim and the quests, and finally when I am done with this adventure.

    When I am fighting enemies, please ask me to roll 6 sided dices, with a 1 being the worst outcome
    of the scenario, and a 6 being the best outcome of the scenario.  Do not roll the dice for me,
    I as the player should input this and you need to describe the outcome with my input.

    During this entire time, track my health points which starts at 20, my
    character class which is a ${adventure.characterclass}, and my inventory which starts with 
    - The Sword of Gryffindor that deals a base damage of 2 
    - The Wand
    - The resurrection stone that heals 5 hp

    (it is inspired by Harry Potter)
    the adventure should have some of the following
    - the wizard must clear out from the forbidden forest from the deathly hallows
    - the forbidden forest has 4 levels
      - each level has 2 set of enemies to fight
      - the final level has the boss named Voldemort
      - the final level has a chest filled with one steel sword which deals base damage of 4
    
      
    Given this scenario, please ask the player for their initial actions.

    PLEASE MAKE SURE TO NEVER ROLL FOR THE PLAYER.  YOU SHOULD ALWAYS ASK THE PLAYER FOR HIS NEXT STEPS.
    `;

      const completion = await openai.chat.completions.create({
            messages: [
               {
                role: 'user', content: input 
               },
            ],
            model: 'gpt-3.5-turbo',
         });
   
   const response = completion.choices[0].message.content ?? "";

   await ctx.runMutation(api.chat.insertEntry, {
      input,
      response,
      advid: args.advid,
   });
   
  },
});