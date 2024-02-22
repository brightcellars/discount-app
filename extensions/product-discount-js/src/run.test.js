import { describe, it, expect } from 'vitest';
import { DiscountApplicationStrategy } from '../generated/api';
import { run as productDiscount } from './run';

/**
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

describe('custom bc discount function', () => {

    // i could't test with the selling plan
    
    it('apply discounts to bundle and to product inside bundle', () => {
        const result = productDiscount({
            "cart": {
              "lines": [
                {
                  "_group_uuid": {
                    "value": "teste"
                  },
                  "_group_parent": {
                    "value": "true"
                  },
                  "_group_build_bundle": null,
                  "_sip_month_hide": null,
                  "_sip_month_show": null,
                  "_member_special": null,
                  "quantity": 1,
                  "merchandise": {
                    "__typename": "ProductVariant",
                    "id": "gid://shopify/ProductVariant/47350688055579",
                    "title": "1 bottle",
                    "product": {
                      "hasAnyTag": false
                    }
                  },
                  "sellingPlanAllocation": null,
                  "cost": {
                    "totalAmount": {
                      "amount": "20.0"
                    }
                  }
                },
                {
                  "_group_uuid": {
                    "value": "teste"
                  },
                  "_group_parent": null,
                  "_group_build_bundle": null,
                  "_sip_month_hide": null,
                  "_sip_month_show": null,
                  "_member_special": null,
                  "quantity": 1,
                  "merchandise": {
                    "__typename": "ProductVariant",
                    "id": "gid://shopify/ProductVariant/47427777462555",
                    "title": "1 bottle",
                    "product": {
                      "hasAnyTag": false
                    }
                  },
                  "sellingPlanAllocation": null,
                  "cost": {
                    "totalAmount": {
                      "amount": "20.0"
                    }
                  }
                }
              ],
              "cost": {
                "subtotalAmount": {
                  "amount": "40.0"
                }
              },
              "buyerIdentity": {
                "customer": {
                  "id": "gid://shopify/Customer/7646148100379",
                  "activeSubscriber": true
                }
              }
            },
            "discountNode": {
              "metafield": null
            }
          });
        const expected = /** @type {FunctionResult} */ ({
            discountApplicationStrategy: DiscountApplicationStrategy.All,
            discounts: [{
              message: "Member Discount",
                targets: [
                    {
                        productVariant: {
                            id: "gid://shopify/ProductVariant/47350688055579"
                        }
                    }
                ],
                value: {
                  fixedAmount: {
                    amount: 4
                  }
                }
            },{
              message: "Included in bundle",
                targets: [
                  {
                    productVariant: {
                      id: "gid://shopify/ProductVariant/47427777462555"
                    }
                  }
                ],
                value: {
                  fixedAmount: {
                    amount: "20.0"
                  }
                }
            },
        ]
        });

        expect(result).toEqual(expected);
    });

    it('apply discounts to SOTM', () => {

      // applies discount only to SOTM_hide --> make it zero dollar
      const result = productDiscount({
          "cart": {
            "lines": [
              {
                "_group_uuid": {
                  "value": "test"
                },
                "_group_parent": {
                  "value": "true"
                },
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47390630215963",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "100.0"
                  }
                }
              },
              {
                "_group_uuid": null,
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": {
                  "value": "true"
                },
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47350688055579",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "15.0"
                  }
                }
              },
              {
                "_group_uuid": {
                  "value": "test"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": {
                  "value": "true"
                },
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47427777462555",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              }
            ],
            "cost": {
              "subtotalAmount": {
                "amount": "40.0"
              }
            },
            "buyerIdentity": {
              "customer": {
                "id": "gid://shopify/Customer/7646148100379",
                "activeSubscriber": true
              }
            }
          },
          "discountNode": {
            "metafield": null
          }
        });
      const expected = /** @type {FunctionResult} */ ({
          discountApplicationStrategy: DiscountApplicationStrategy.All,
          discounts: [{
            message: "Member Discount",
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47390630215963"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: 20
                }
              }
          },{
            message: "Included in bundle",
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47427777462555"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: "20.0"
                }
              }
          },
      ]
      });

      expect(result).toEqual(expected);
    });

    it('apply discounts to SOTM', () => {

      // don't apply discount to products with "Don't Show Member Price" tag
      const result = productDiscount({
          "cart": {
            "lines": [
              {
                "_group_uuid": null,
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47390630215963",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": true
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              }
            ],
            "cost": {
              "subtotalAmount": {
                "amount": "40.0"
              }
            },
            "buyerIdentity": {
              "customer": {
                "id": "gid://shopify/Customer/7646148100379",
                "activeSubscriber": false
              }
            }
          },
          "discountNode": {
            "metafield": null
          }
        });
      const expected = /** @type {FunctionResult} */ ({
        discountApplicationStrategy: DiscountApplicationStrategy.All,
        discounts: []
      });

      expect(result).toEqual(expected);
    });

    it('apply BYOB discount', () => {

      // products inside BYOB are zero dollar and BYOB is a sum of the products with membership discount applied
      const result = productDiscount({
          "cart": {
            "lines": [
              {
                "_group_uuid": {
                  "value": "test"
                },
                "_group_parent": {
                  "value": "true"
                },
                "_group_build_bundle": {
                  "value": "true"
                },
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47350688055579",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "102.0"
                  }
                }
              },
              {
                "_group_uuid": {
                  "value": "test"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47427777462555",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              },
              {
                "_group_uuid": {
                  "value": "test"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47390630215963",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "25.0"
                  }
                }
              }
            ],
            "cost": {
              "subtotalAmount": {
                "amount": "40.0"
              }
            },
            "buyerIdentity": {
              "customer": {
                "id": "gid://shopify/Customer/7646148100379",
                "activeSubscriber": true
              }
            }
          },
          "discountNode": {
            "metafield": null
          }
        });
      const expected = /** @type {FunctionResult} */ ({
          discountApplicationStrategy: DiscountApplicationStrategy.All,
          discounts: [{
            message: "Included in bundle",
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47427777462555"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: "20.0"
                }
              }
          },{
            message: "Included in bundle",
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47390630215963"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: "25.0"
                }
              }
          },{
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47350688055579"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: 66
                }
              }
          }
      ]
      });

      expect(result).toEqual(expected);
    });

    it('dont apply discount if parent missing', () => {
      const result = productDiscount({
          "cart": {
            "lines": [
              {
                "_group_uuid": {
                  "value": "teste"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47350688055579",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              },
              {
                "_group_uuid": {
                  "value": "teste"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47427777462555",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              }
            ],
            "cost": {
              "subtotalAmount": {
                "amount": "40.0"
              }
            },
            "buyerIdentity": {
              "customer": {
                "id": "gid://shopify/Customer/7646148100379",
                "activeSubscriber": true
              }
            }
          },
          "discountNode": {
            "metafield": null
          }
        });
      const expected = /** @type {FunctionResult} */ ({
          discountApplicationStrategy: DiscountApplicationStrategy.All,
          discounts: [
      ]
      });

      expect(result).toEqual(expected);
    });

    it('dont apply discount if has tag "dont show member price"', () => {
      const result = productDiscount({
          "cart": {
            "lines": [
              {
                "_group_uuid": {
                  "value": "teste"
                },
                "_group_parent": {
                  "value": "true"
                },
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47350688055579",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": true
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              },
              {
                "_group_uuid": {
                  "value": "teste"
                },
                "_group_parent": null,
                "_group_build_bundle": null,
                "_sip_month_hide": null,
                "_sip_month_show": null,
                "_member_special": null,
                "quantity": 1,
                "merchandise": {
                  "__typename": "ProductVariant",
                  "id": "gid://shopify/ProductVariant/47427777462555",
                  "title": "1 bottle",
                  "product": {
                    "hasAnyTag": false
                  }
                },
                "sellingPlanAllocation": null,
                "cost": {
                  "totalAmount": {
                    "amount": "20.0"
                  }
                }
              }
            ],
            "cost": {
              "subtotalAmount": {
                "amount": "40.0"
              }
            },
            "buyerIdentity": {
              "customer": {
                "id": "gid://shopify/Customer/7646148100379",
                "activeSubscriber": true
              }
            }
          },
          "discountNode": {
            "metafield": null
          }
        });
      const expected = /** @type {FunctionResult} */ ({
          discountApplicationStrategy: DiscountApplicationStrategy.All,
          discounts: [{
            message: "Included in bundle",
              targets: [
                {
                  productVariant: {
                    id: "gid://shopify/ProductVariant/47427777462555"
                  }
                }
              ],
              value: {
                fixedAmount: {
                  amount: "20.0"
                }
              }
          }
      ]
      });

      expect(result).toEqual(expected);
    });
});
