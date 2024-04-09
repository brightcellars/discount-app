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
  const emailMetafieldKey = "recipient-email";
  const messageMetafieldKey = "message";

  const emailValue = useMetafield({
    namespace: metafieldNamespace,
    key: emailMetafieldKey,
  });

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
      <Checkbox onChange={(e) => setIsGift(e)}>
        <InlineLayout columns={['auto', 'auto']}>
          <Text>This order is a gift &nbsp;</Text>
          <Icon source="gift" />
        </InlineLayout>
        <Text>{isGift ? "Add the recipient's email and a message" : null}</Text>
      </Checkbox>
      {
        isGift ?
          <BlockStack>
            <TextField 
              label="Recipient Email" 
              type="email" 
              required
              onChange={(v) => onApplyMetafieldChange(v, emailMetafieldKey)}
              value={emailValue?.value}
            />
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