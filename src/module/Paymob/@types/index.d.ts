interface SourceData {
     pan: string;
     sub_type: string;
     type: string;
}

export interface PaymentTransaction {
     amount_cents: number;
     created_at: string;
     currency: string;
     error_occured: boolean;
     has_parent_transaction: boolean;
     id: number;
     integration_id: number;
     is_3d_secure: boolean;
     is_auth: boolean;
     is_capture: boolean;
     is_refunded: boolean;
     is_standalone_payment: boolean;
     is_voided: boolean;
     order: number | string;
     owner: number;
     pending: boolean;
     source_data: SourceData;
     success: boolean;
}

export interface HmacPayload {
     amount_cents: number;
     created_at: string;
     currency: string;
     error_occured: boolean;
     has_parent_transaction: boolean;
     id: number;
     integration_id: number;
     is_3d_secure: boolean;
     is_auth: boolean;
     is_capture: boolean;
     is_refunded: boolean;
     is_standalone_payment: boolean;
     is_voided: boolean;
     order: number | string;
     owner: number;
     pending: boolean;
     'source_data.pan': string;
     'source_data.sub_type': string;
     'source_data.type': string;
     success: boolean;
     hmac: string
}
