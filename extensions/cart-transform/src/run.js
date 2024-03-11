// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */


export function run(input) {
  const sub4Pack = 35;
  const sub6Pack = 65;
  const sub12Pack = 100;
  const prepaid_plan_ids = [
    688915284242,
    688963092754,
    688963125522,
    688963158290,
    688915317010,
    688963191058,
    688963223826,
    688963256594,
    688929407250,
    688929440018,
    688929505554,
    688929538322,
    688963420434,
    688963453202,
    688963485970,
    688963518738
  ];

  const parentsUuid = [];
  const operations = [];

  input.cart.lines
  .forEach(line => {
    const groupParent = line._group_parent && line._group_parent.value;
    const groupUuid = line._group_uuid && line._group_uuid.value;
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;
    if(groupParent && groupUuid){
      parentsUuid.push({uuid: groupUuid, byob: groupBuildBundle, parentVariantId: line.id});
    }
  });

  input.cart.lines
    .forEach(line => {
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      const groupParent = line._group_parent && line._group_parent.value;
      const groupUuid = line._group_uuid && line._group_uuid.value;
      const sellingPlan = line.sellingPlanAllocation && line.sellingPlanAllocation.sellingPlan.id;
      const sipMonthHide = line._sip_month_hide && line._sip_month_hide.value;
      const title = variant.title;
      const memberSpecial = line._member_special && line._member_special.value;
      const existParent = !groupParent && groupUuid && parentsUuid.find((p) => p.uuid == groupUuid);
      const sipMonthShow = line._sip_month_show && line._sip_month_show.value;
      const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;

      if(existParent && !existParent.byob && !sipMonthShow && !sipMonthHide){
        operations.push({
            "update": {
              "cartLineId": line.id,
              "price": {
                "adjustment": {
                  "fixedPricePerUnit": {
                    "amount": "0"
                  }
                }
              }
            }
        })
      }
      else if(existParent && sipMonthHide){
        operations.push({
          "update": {
            "cartLineId": line.id,
            "title": "Mistery Wine",
            "image": {
              "url": "https://cdn.shopify.com/s/files/1/0777/6131/5099/files/sip_month.png?v=1708718908"
            },
            "price": {
              "adjustment": {
                "fixedPricePerUnit": {
                  "amount": "0"
                }
              }
            }
          }
        })
      }
      // else if(existParent && !sipMonthHide)
    });

  if(operations.length){
    return { operations: operations};
  }
  return NO_CHANGES;
};