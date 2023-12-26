import { useEffect } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      mutation MyMutation {
        discountAutomaticAppCreate(
          automaticAppDiscount: {
            title: "Custom BC Discount", 
            functionId: "${process.env.SHOPIFY_PRODUCT_DISCOUNT_JS_ID}", 
            startsAt: "2023-11-29T00:00:00"}
        ) {
          automaticAppDiscount {
            discountId
          }
          userErrors {
            code
            extraInfo
            field
            message
          }
        }
      }`
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data,
  });
}

export default function Index() {
  const nav = useNavigation();
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id;

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const generateDiscount = () => submit({}, { replace: false, method: "POST" });

  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Card>
              <VerticalStack gap="5">
                <VerticalStack gap="2">
                  <Text as="h2" variant="headingMd">
                    Custom BC Discount App 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This app generates discounts for bundles, for members, and for memberships.
                  </Text>
                </VerticalStack>
                <VerticalStack gap="2">
                  <Text as="h3" variant="headingMd">
                    Get started
                  </Text>
                  <Text as="p" variant="bodyMd">
                    If the discount is not showing over the Discount tab, 
                    please generate the new discount clicking the button below
                  </Text>
                </VerticalStack>
                <HorizontalStack gap="3" align="end">
                  <Button loading={isLoading} primary onClick={generateDiscount}>
                    Generate the discount
                  </Button>
                </HorizontalStack>
                {actionData?.product && (
                  <Box
                    padding="4"
                    background="bg-subdued"
                    borderColor="border"
                    borderWidth="1"
                    borderRadius="2"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(actionData.product, null, 2)}</code>
                    </pre>
                  </Box>
                )}
              </VerticalStack>
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
