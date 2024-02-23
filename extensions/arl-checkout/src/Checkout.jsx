import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useCartLineTarget,
  Text,
  BlockStack,
  Link
} from '@shopify/ui-extensions-react/checkout';
import React, { useEffect, useState } from "react";

export default reactExtension(
  'purchase.checkout.payment-method-list.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { query, lines } = useApi();

  var existSellingPlan = false;
  var planBottles = null;

  lines.current.forEach((item) => {
    if(item.merchandise.sellingPlan){
      existSellingPlan = true;

      if(item.merchandise.subtitle && item.merchandise.subtitle.includes("6")){
        planBottles = 6;
      }
      else if(item.merchandise.subtitle && item.merchandise.subtitle.includes("12")){
        planBottles = 12;
      }
    }
  });

  var discountText = "";
  if(planBottles == 12){
    discountText = "$150 off your next 3 boxes ($50 each)"
  }
  else if(planBottles == 6){
    discountText = "$75 off your next 3 boxes ($25 each)"
  }

  const text = `
    Your Bright Cellars® membership continues automatically every 4 weeks until you cancel. 
    Your selected payment method will be charged the price shown today for your initial shipment, 
    and for future orders as notified via email before shipping. 
    You'll also get ${discountText}.  
    Cancel, modify an order, or skip a delivery anytime online in your account settings, or call 1-844-BCELLAR. 
    Your membership is governed by our `;

  if(false)
  return (
    <Text>
      <Text emphasis='bold'>
        Automatic Renewal Terms:
      </Text>
      <Text >
        &nbsp;{text}
      </Text>
      <Link to="https://www.brightcellars.com/pages/terms">
        Terms of Use.
      </Link>
    </Text>
  );

  return(null);
}