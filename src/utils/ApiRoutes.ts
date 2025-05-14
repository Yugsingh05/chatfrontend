const HOST="http://localhost:3005"

const AUTH_ROUTES = `${HOST}/api/auth`

export const CHECK_USER_ROUTE = `${AUTH_ROUTES}/check-user`

export const REGISTER_USER_ROUTE = `${AUTH_ROUTES}/register-user`

export const GET_ALL_CONTACTS_ROUTE = `${AUTH_ROUTES}/get-all-contacts`

export const ADD_MESSAGE_ROUTE = `${HOST}/api/message/add-message`

export const GET_MESSAGES_ROUTE = `${HOST}/api/message/get-messages/:senderId/:receiverId`