/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  var count = 0
  const deliveryGroupIds = input.cart.deliveryGroups.map((d) => d.id);
  const targets = deliveryGroupIds.map((d) => {
    return({deliveryGroup: { id: d }})
  })

  input.cart.lines
  .forEach(line => {
    // trying to replicate the old script editor
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    const title = variant.title;
    const hideMemberPrice = variant.product.hasAnyTag;
    const groupUuid = line._group_uuid && line._group_uuid.value;
    const groupParent = line._group_parent && line._group_parent.value;
    const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;
    const groupRepurchase = line._group_repurchase && line._group_repurchase.value;
    const sipMonthShow = line._sip_month_show && line._sip_month_show.value;
    const sipMonthHide = line._sip_month_hide && line._sip_month_hide.value;
    const qty = line.quantity;

    if (groupRepurchase){
      count += qty
    }
    else if (!groupParent && groupUuid){
      count += qty
    }
    else if (!groupParent && !groupUuid && !sipMonthShow && !sipMonthHide){
      count += qty
    }
    

  })

  if (count > 5){
    const discountLine = {
      targets: targets,
      value: {
        percentage: {
          value: "100"
        }
      },
    }
    return {
      discounts: [discountLine]
    };
  }

  return EMPTY_DISCOUNT;
};