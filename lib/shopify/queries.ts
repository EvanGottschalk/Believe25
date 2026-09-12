/** Storefront API documents. Kept together so the shape is reviewable in one place. */

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    tags
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 6) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
    collections(first: 5) {
      nodes {
        handle
      }
    }
    materials: metafield(namespace: "details", key: "materials") {
      value
    }
    dimensions: metafield(namespace: "details", key: "dimensions") {
      value
    }
    care: metafield(namespace: "details", key: "care") {
      value
    }
    madeToOrder: metafield(namespace: "details", key: "made_to_order") {
      value
    }
  }
`;

export const GET_ALL_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetAllProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_COLLECTION_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_CART = /* GraphQL */ `
  ${CART_FRAGMENT}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

export const CREATE_CART = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const ADD_CART_LINES = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const UPDATE_CART_LINES = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;

export const REMOVE_CART_LINES = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
`;
