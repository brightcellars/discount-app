import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  BlockLayout,
  Checkbox,
  Icon,
  Text,
  InlineLayout,
  TextField,
  BlockStack,
  useMetafield,
  useApplyMetafieldsChange
} from '@shopify/ui-extensions-react/checkout';
import { Divider } from '@shopify/ui-extensions/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const [isGift, setIsGift] = useState(false);

  const metafieldNamespace = "gift-message-app";
  const messageMetafieldKey = "message";

  const messageValue = useMetafield({
    namespace: metafieldNamespace,
    key: messageMetafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  const onApplyMetafieldChange = (value, metafieldKey) => {
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: metafieldKey,
      valueType: "string",
      value,
    });
  }

  return (
    <BlockStack>
      <Checkbox onChange={(e) => setIsGift(e)} value={isGift}>
        <InlineLayout columns={['auto', 'auto']}>
          <Text>This order is a gift &nbsp;</Text>
          <Icon source="gift" />
        </InlineLayout>
        <Text>{isGift ? "Add a message" : null}</Text>
      </Checkbox>
      {
        isGift ?
          <BlockStack>
            <TextField 
              label="Message" 
              required 
              multiline={3}
              onChange={(v) => onApplyMetafieldChange(v, messageMetafieldKey)}
              value={messageValue?.value}
            />
          </BlockStack>
        : null
      }
      
    </BlockStack>
  );
}