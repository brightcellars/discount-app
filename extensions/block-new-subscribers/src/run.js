// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const errors = input.cart.lines
    .filter((line) => {
      const sellingPlan = line.sellingPlanAllocation && line.sellingPlanAllocation.sellingPlan.id;
      return sellingPlan;
    })
    .map(() => ({
      localizedMessage: "At this time, we're not able to accept new customers but we'd love to introduce you to Winc. Check out Winc.com",
      target: "$.cart",
    }));

  return {
    errors
  }
};