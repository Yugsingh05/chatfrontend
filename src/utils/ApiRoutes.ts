export const HOST = "http://localhost:3005";

const AUTH_ROUTES = `${HOST}/api/auth`;
const MESSAGE_ROUTES = `${HOST}/api/message`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTES}/check-user`;
export const REGISTER_USER_ROUTE = `${AUTH_ROUTES}/register-user`;
export const GET_ALL_CONTACTS_ROUTE = `${AUTH_ROUTES}/get-all-contacts`;
export const GET_CALL_TOKEN_ROUTE = `${AUTH_ROUTES}/generate-token/:userId`;

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-message`;
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages/:senderId/:receiverId`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-audio-message`;
export const GET_INITIAL_CONTACT_WITH_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-initial-contacts/:userId`;
