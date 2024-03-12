// @ts-check
//import { DISCOUNT_TOTAL_USAGE_LIMIT_FIELD } from "@shopify/discount-app-components/build/ts/latest/src/components/UsageLimitsCard";
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type {{
  *   quantity: number
  *   percentage: number
  * }}
  */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  //if (!configuration.quantity || !configuration.percentage) {
    //return EMPTY_DISCOUNT;
  //}

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

  const memberDiscountPercent = 0.20;

  const packMessage = 'BOX 1 DISCOUNT'

  const buyerIdentity = input.cart.buyerIdentity;
  const customer = buyerIdentity && buyerIdentity.customer;
  const isActiveCustomer = customer && customer.activeSubscriber;
  const uuids = {};

  const discounts = [];
  const parentsUuid = [];

  var value = 0;

  input.cart.lines
    .forEach(line => {
      const groupParent = line._group_parent && line._group_parent.value;
      const groupUuid = line._group_uuid && line._group_uuid.value;
      const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;
      if(groupParent && groupUuid){
        parentsUuid.push({uuid: groupUuid, byob: groupBuildBundle});
      }
    });

  input.cart.lines
    .forEach(line => {
      // trying to replicate the old script editor
      const variant = /** @type {ProductVariant} */ (line.merchandise);
      const title = variant.title;
      const hideMemberPrice = variant.product.hasAnyTag;
      const groupUuid = line._group_uuid && line._group_uuid.value;
      const groupParent = line._group_parent && line._group_parent.value;
      const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;
      const sipMonthShow = line._sip_month_show && line._sip_month_show.value;
      const sipMonthHide = line._sip_month_hide && line._sip_month_hide.value;
      const memberSpecial = line._member_special && line._member_special.value;
      const linePrice = line.cost.totalAmount.amount;
      const sellingPlan = line.sellingPlanAllocation && line.sellingPlanAllocation.sellingPlan.id;
      const existParent = !groupParent && groupUuid && parentsUuid.find((p) => p.uuid == groupUuid);

      if(groupUuid && !groupParent){
        if(groupUuid in uuids){
          value = uuids[groupUuid];
          if(isActiveCustomer){
            value += linePrice * ( 1 - memberDiscountPercent);
          }
          uuids[groupUuid] = value;
        }
        else{
          value = linePrice;
          if(isActiveCustomer){
            value += linePrice * ( 1 - memberDiscountPercent);
          }
          uuids[groupUuid] = value;
        }
      }

      if(groupBuildBundle && groupParent) return;
      
      if(hideMemberPrice) return;

      var discountAmount = 0;
      var discountMessage = "";
      if(existParent && !sipMonthShow && groupUuid && !groupParent){
        return;

        if(memberSpecial){
          
          discountMessage = "Included in membership box";
        }
        else{
          discountMessage = "Included in bundle";
        }
        discountAmount = linePrice
      }

      if(groupUuid && groupParent){
        if(sellingPlan && !prepaid_plan_ids.includes(parseInt(sellingPlan))){
          if(title?.includes("4 ")){
            discountAmount = sub4Pack;
          }
          else if(title?.includes("6 ")){
            discountAmount = sub6Pack;
          }
          else if(title?.includes("12 ")){
            discountAmount = sub12Pack;
          }
          discountMessage = packMessage;
        }
        else if(isActiveCustomer){
          discountAmount = linePrice * memberDiscountPercent;
          discountMessage = "Member Discount";
        }
      }

      if(sipMonthHide){
        discountAmount = linePrice;
      }

      const target =[/** @type {Target} */ {
        productVariant: {
          id: variant.id
        }
      }];

      const discountLine = {
        targets: target,
        value: {
          fixedAmount: {
            amount: discountAmount
          }
        }
      }
      if(discountMessage) discountLine.message = discountMessage;

      if( discountAmount > 0){
        const alreadyExistIndex = discounts.findIndex((d) => d.targets[0].productVariant.id === variant.id);
        if(alreadyExistIndex > -1){
          const discount = discounts.find((d) => d.targets[0].productVariant.id === variant.id);
          discounts.splice(alreadyExistIndex, 1, {
            targets: discountLine.targets,
            value: { fixedAmount: {
              amount: String(parseFloat(discountAmount) + parseFloat(discount.value.fixedAmount.amount))
            }}
          });
        }
        else{
          discounts.push(discountLine);
        }
      }

    });

  input.cart.lines
  .forEach(line => {
    const groupUuid = line._group_uuid && line._group_uuid.value;
    const groupParent = line._group_parent && line._group_parent.value;
    const groupBuildBundle = line._group_build_bundle && line._group_build_bundle.value;
    const linePrice = line.cost.totalAmount.amount;
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    var discountAmount = 0;
    var discountMessage = "";

    if(groupBuildBundle && groupParent && groupUuid){
      if( uuids[groupUuid] && uuids[groupUuid] < linePrice){
        //discountAmount = linePrice - uuids[groupUuid];
      }
    }


    const target =[/** @type {Target} */ {
      productVariant: {
        id: variant.id
      }
    }];

    const discountLine = {
      targets: target,
      value: {
        fixedAmount: {
          amount: discountAmount
        }
      }
    }

    if(discountMessage) discountLine.message = discountMessage;

    if(discountAmount > 0){
      discounts.push(discountLine)
    }
  });

  return {
    discounts: discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All
  };
};
