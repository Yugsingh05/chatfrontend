export const HOST="http://localhost:3005"

const AUTH_ROUTES = `${HOST}/api/auth`
const MESSAGE_ROUTES = `${HOST}/api/message`

export const CHECK_USER_ROUTE = `${AUTH_ROUTES}/check-user`

export const REGISTER_USER_ROUTE = `${AUTH_ROUTES}/register-user`

export const GET_ALL_CONTACTS_ROUTE = `${AUTH_ROUTES}/get-all-contacts`

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-message`

export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages/:senderId/:receiverId`

export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/add-image-message`