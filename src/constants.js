export const LAB_USER_CREATE_URL = "accounts/lab-user/"
export const PATIENT_USER_CREATE_URL = "accounts/patient-user/"
export const GET_TOKEN_URL = "accounts/get-token/"
export const GET_ALL_BILLS = "bill/bill-view/"
export const GET_ALL_TESTS = "bill/test/"
export const GET_ALL_PATIENT = "accounts/patient-user/"
export const CREATE_BILL = "bill/bill-view/"
export const getBillItemsEndpoint = (bill_id) => {
    return `bill/get-bill-items/${bill_id}/`;
};
export const updateBillItems = (bill_id) => {
    return `bill/update-bill-items/${bill_id}/`;
};
export const getDetailedBillEndpoint = (bill_id) => {
    return `bill/get-detailed-bill/${bill_id}/`;
};
export const getReceiptDownloadEndpoint = (bill_id,doc_type) => {
    return `bill/download-documents/${bill_id}/${doc_type}/`;
};
export const getIndividualBillEndpoint = (bill_id) => {
    return `bill/individual-bill/${bill_id}/`;
};
export const PATIENT_BILL_URL = 'bill/get-patient-bills/'
export const ADD_TEST_URL = "bill/test/"