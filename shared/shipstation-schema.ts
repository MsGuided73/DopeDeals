import { pgTable, text, integer, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ShipStation Orders
export const shipstationOrders = pgTable("shipstation_orders", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(), // Our internal order ID
  shipstationOrderId: text("shipstation_order_id").unique(),
  orderNumber: text("order_number").notNull(),
  orderKey: text("order_key"),
  orderDate: timestamp("order_date", { withTimezone: true }).notNull(),
  orderStatus: text("order_status").notNull(), // awaiting_payment, awaiting_shipment, shipped, etc.
  customerId: text("customer_id").notNull(),
  billTo: jsonb("bill_to"), // Billing address
  shipTo: jsonb("ship_to"), // Shipping address
  items: jsonb("items").notNull(), // Array of order items
  orderTotal: numeric("order_total", { precision: 10, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }),
  shippingAmount: numeric("shipping_amount", { precision: 10, scale: 2 }),
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  gift: boolean("gift").default(false),
  giftMessage: text("gift_message"),
  paymentMethod: text("payment_method"),
  requestedShippingService: text("requested_shipping_service"),
  carrierCode: text("carrier_code"),
  serviceCode: text("service_code"),
  packageCode: text("package_code"),
  confirmation: text("confirmation"),
  shipDate: timestamp("ship_date", { withTimezone: true }),
  holdUntilDate: timestamp("hold_until_date", { withTimezone: true }),
  weight: jsonb("weight"), // { value: number, units: string }
  dimensions: jsonb("dimensions"), // { length, width, height, units }
  insuranceOptions: jsonb("insurance_options"),
  internationalOptions: jsonb("international_options"),
  advancedOptions: jsonb("advanced_options"),
  tagIds: jsonb("tag_ids"), // Array of tag IDs
  userId: text("user_id"),
  externallyFulfilled: boolean("externally_fulfilled").default(false),
  externallyFulfilledBy: text("externally_fulfilled_by"),
  externallyFulfilledById: text("externally_fulfilled_by_id"),
  externallyFulfilledByName: text("externally_fulfilled_by_name"),
  labelMessages: text("label_messages"),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// ShipStation Shipments
export const shipstationShipments = pgTable("shipstation_shipments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(), // Our internal order ID
  shipstationOrderId: text("shipstation_order_id").notNull(),
  shipmentId: text("shipment_id").unique(), // ShipStation shipment ID
  userId: text("user_id"),
  customerEmail: text("customer_email"),
  orderNumber: text("order_number").notNull(),
  createDate: timestamp("create_date", { withTimezone: true }).notNull(),
  shipDate: timestamp("ship_date", { withTimezone: true }).notNull(),
  shipTo: jsonb("ship_to").notNull(),
  weight: jsonb("weight"),
  dimensions: jsonb("dimensions"),
  insuranceCost: numeric("insurance_cost", { precision: 10, scale: 2 }),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }),
  trackingNumber: text("tracking_number"),
  isReturnLabel: boolean("is_return_label").default(false),
  batchNumber: text("batch_number"),
  carrierCode: text("carrier_code").notNull(),
  serviceCode: text("service_code").notNull(),
  packageCode: text("package_code").notNull(),
  confirmation: text("confirmation"),
  warehouseId: text("warehouse_id"),
  voided: boolean("voided").default(false),
  voidDate: timestamp("void_date", { withTimezone: true }),
  marketplaceNotified: boolean("marketplace_notified").default(false),
  notifyErrorMessage: text("notify_error_message"),
  shipmentItems: jsonb("shipment_items"), // Array of shipped items
  labelData: text("label_data"), // Base64 encoded label
  formData: text("form_data"), // Additional forms
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// ShipStation Webhooks
export const shipstationWebhooks = pgTable("shipstation_webhooks", {
  id: text("id").primaryKey(),
  resourceUrl: text("resource_url").notNull(),
  resourceType: text("resource_type").notNull(), // ORDER_NOTIFY, SHIP_NOTIFY, ITEM_ORDER_NOTIFY, etc.
  eventType: text("event_type").notNull(), // ON_ORDER_SHIPPED, ON_ORDER_CANCELLED, etc.
  data: jsonb("data").notNull(),
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// ShipStation Products
export const shipstationProducts = pgTable("shipstation_products", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().unique(), // ShipStation product ID
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  defaultCost: numeric("default_cost", { precision: 10, scale: 2 }),
  length: numeric("length", { precision: 5, scale: 2 }),
  width: numeric("width", { precision: 5, scale: 2 }),
  height: numeric("height", { precision: 5, scale: 2 }),
  weightOz: numeric("weight_oz", { precision: 5, scale: 2 }),
  internalNotes: text("internal_notes"),
  fulfillmentSku: text("fulfillment_sku"),
  createDate: timestamp("create_date", { withTimezone: true }),
  modifyDate: timestamp("modify_date", { withTimezone: true }),
  active: boolean("active").default(true),
  productCategory: jsonb("product_category"),
  productType: text("product_type"),
  warehouseLocation: text("warehouse_location"),
  defaultCarrierCode: text("default_carrier_code"),
  defaultServiceCode: text("default_service_code"),
  defaultPackageCode: text("default_package_code"),
  defaultIntlCarrierCode: text("default_intl_carrier_code"),
  defaultIntlServiceCode: text("default_intl_service_code"),
  defaultIntlPackageCode: text("default_intl_package_code"),
  defaultConfirmation: text("default_confirmation"),
  defaultIntlConfirmation: text("default_intl_confirmation"),
  customsDescription: text("customs_description"),
  customsValue: numeric("customs_value", { precision: 10, scale: 2 }),
  customsTariffNo: text("customs_tariff_no"),
  customsCountryCode: text("customs_country_code"),
  noCustoms: boolean("no_customs").default(false),
  tags: jsonb("tags"), // Array of tags
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// ShipStation Warehouses
export const shipstationWarehouses = pgTable("shipstation_warehouses", {
  id: text("id").primaryKey(),
  warehouseId: text("warehouse_id").notNull().unique(), // ShipStation warehouse ID
  warehouseName: text("warehouse_name").notNull(),
  originAddress: jsonb("origin_address").notNull(),
  returnAddress: jsonb("return_address"),
  createDate: timestamp("create_date", { withTimezone: true }),
  isDefault: boolean("is_default").default(false),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// ShipStation Sync Status
export const shipstationSyncStatus = pgTable("shipstation_sync_status", {
  id: text("id").primaryKey(),
  syncType: text("sync_type").notNull(), // orders, products, warehouses, shipments
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  lastSuccessfulSyncAt: timestamp("last_successful_sync_at", { withTimezone: true }),
  status: text("status").notNull(), // success, error, in_progress
  errorMessage: text("error_message"),
  recordsProcessed: integer("records_processed").default(0),
  recordsUpdated: integer("records_updated").default(0),
  recordsCreated: integer("records_created").default(0),
  recordsErrored: integer("records_errored").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Insert schemas
export const insertShipstationOrderSchema = createInsertSchema(shipstationOrders).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertShipstationShipmentSchema = createInsertSchema(shipstationShipments).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertShipstationWebhookSchema = createInsertSchema(shipstationWebhooks).omit({ 
  id: true, 
  createdAt: true 
});

export const insertShipstationProductSchema = createInsertSchema(shipstationProducts).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertShipstationWarehouseSchema = createInsertSchema(shipstationWarehouses).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true
});

export const insertShipstationSyncStatusSchema = createInsertSchema(shipstationSyncStatus).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Types
export type ShipstationOrder = typeof shipstationOrders.$inferSelect;
export type InsertShipstationOrder = z.infer<typeof insertShipstationOrderSchema>;

export type ShipstationShipment = typeof shipstationShipments.$inferSelect;
export type InsertShipstationShipment = z.infer<typeof insertShipstationShipmentSchema>;

export type ShipstationWebhook = typeof shipstationWebhooks.$inferSelect;
export type InsertShipstationWebhook = z.infer<typeof insertShipstationWebhookSchema>;

export type ShipstationProduct = typeof shipstationProducts.$inferSelect;
export type InsertShipstationProduct = z.infer<typeof insertShipstationProductSchema>;

export type ShipstationWarehouse = typeof shipstationWarehouses.$inferSelect;
export type InsertShipstationWarehouse = z.infer<typeof insertShipstationWarehouseSchema>;

export type ShipstationSyncStatus = typeof shipstationSyncStatus.$inferSelect;
export type InsertShipstationSyncStatus = z.infer<typeof insertShipstationSyncStatusSchema>;

// ShipStation API types
export interface ShipstationAddress {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  street3?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  residential?: boolean;
  addressVerified?: string;
}

export interface ShipstationOrderItem {
  orderItemId?: number;
  lineItemKey?: string;
  sku?: string;
  name: string;
  imageUrl?: string;
  weight?: {
    value: number;
    units: string;
  };
  quantity: number;
  unitPrice: number;
  taxAmount?: number;
  shippingAmount?: number;
  warehouseLocation?: string;
  options?: Array<{
    name: string;
    value: string;
  }>;
  productId?: number;
  fulfillmentSku?: string;
  adjustment?: boolean;
  upc?: string;
  createDate?: string;
  modifyDate?: string;
}

export interface ShipstationCreateOrderRequest {
  orderNumber: string;
  orderKey?: string;
  orderDate: string;
  paymentDate?: string;
  shipByDate?: string;
  orderStatus: string;
  customerId?: number;
  customerUsername?: string;
  customerEmail?: string;
  billTo: ShipstationAddress;
  shipTo: ShipstationAddress;
  items: ShipstationOrderItem[];
  orderTotal: number;
  amountPaid?: number;
  taxAmount?: number;
  shippingAmount?: number;
  customerNotes?: string;
  internalNotes?: string;
  gift?: boolean;
  giftMessage?: string;
  paymentMethod?: string;
  requestedShippingService?: string;
  carrierCode?: string;
  serviceCode?: string;
  packageCode?: string;
  confirmation?: string;
  shipDate?: string;
  holdUntilDate?: string;
  weight?: {
    value: number;
    units: string;
  };
  dimensions?: {
    units: string;
    length: number;
    width: number;
    height: number;
  };
  insuranceOptions?: {
    provider: string;
    insureShipment: boolean;
    insuredValue: number;
  };
  internationalOptions?: {
    contents?: string;
    customsItems?: Array<{
      description: string;
      quantity: number;
      value: number;
      harmonizedTariffCode?: string;
      countryOfOrigin?: string;
    }>;
    nonDelivery?: string;
  };
  advancedOptions?: {
    warehouseId?: number;
    nonMachinable?: boolean;
    saturdayDelivery?: boolean;
    containsAlcohol?: boolean;
    mergedOrSplit?: boolean;
    mergedIds?: number[];
    parentId?: number;
    storeId?: number;
    customField1?: string;
    customField2?: string;
    customField3?: string;
    source?: string;
    billToParty?: string;
    billToAccount?: string;
    billToPostalCode?: string;
    billToCountryCode?: string;
    billToMyOtherAccount?: string;
  };
  tagIds?: number[];
}

export interface ShipstationShipmentResponse {
  shipmentId: number;
  orderId: number;
  userId: string;
  customerEmail: string;
  orderNumber: string;
  createDate: string;
  shipDate: string;
  shipTo: ShipstationAddress;
  weight: {
    value: number;
    units: string;
  };
  dimensions?: {
    units: string;
    length: number;
    width: number;
    height: number;
  };
  insuranceCost: number;
  shippingCost: number;
  trackingNumber: string;
  isReturnLabel: boolean;
  batchNumber: string;
  carrierCode: string;
  serviceCode: string;
  packageCode: string;
  confirmation: string;
  warehouseId: number;
  voided: boolean;
  voidDate?: string;
  marketplaceNotified: boolean;
  notifyErrorMessage?: string;
  shipmentItems: Array<{
    orderItemId: number;
    lineItemKey?: string;
    sku?: string;
    name: string;
    imageUrl?: string;
    weight?: {
      value: number;
      units: string;
    };
    quantity: number;
    unitPrice: number;
    warehouseLocation?: string;
    options?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  labelData?: string;
  formData?: string;
}

export interface ShipstationRateRequest {
  carrierCode: string;
  serviceCode?: string;
  packageCode: string;
  fromPostalCode: string;
  toState?: string;
  toCountry: string;
  toPostalCode: string;
  weight: {
    value: number;
    units: string;
  };
  dimensions?: {
    units: string;
    length: number;
    width: number;
    height: number;
  };
  confirmation?: string;
  residential?: boolean;
}

export interface ShipstationRate {
  serviceName: string;
  serviceCode: string;
  shipmentCost: number;
  otherCost: number;
}