/******** Authentication **********/
export const USER_AUTHENTICATION_URL = "/auth";
export const USER_LOGIN_URL = `${USER_AUTHENTICATION_URL}/login`;
export const USER_SIGNUP_PATIENT_URL = `${USER_AUTHENTICATION_URL}/signup/patient`;
export const USER_SIGNUP_DOCTOR_URL = `${USER_AUTHENTICATION_URL}/signup/doctor`;
export const GET_CURRENT_USER = `${USER_AUTHENTICATION_URL}/get-current-user`;
export const GET_VERIFICATION_LINK = `${USER_AUTHENTICATION_URL}/verify-id`;
export const USER_LOGOUT = `${USER_AUTHENTICATION_URL}/logout`;

/******** Article **********/
export const ARTICLE_BASE_URL = "/article/article";
export const ARTICLE_SEARCH_URL = `${ARTICLE_BASE_URL}/searchArticle`;
export const ARTICLE_PUBLISH_URL = `${ARTICLE_BASE_URL}/publishArticle`;

/******* Question *********/
export const QUESTION_BASE_URL = "/article/question";
export const QUESTION_PUBLISH_URL = `${QUESTION_BASE_URL}/publishQuestion`;
export const QUESTION_SEARCH_URL = `${QUESTION_BASE_URL}/searchQuestion`;
export const QUESTION_GET_COMMENT_URL = `${QUESTION_BASE_URL}/getOne`;
export const QUESTION_ADD_COMMENT_URL = `${QUESTION_BASE_URL}/commentQuestion`;
export const QUESTION_COMMENT_ADD_VOTE_URL = `${QUESTION_BASE_URL}/addVote`;
/******** Chat **********/
export const CHAT_URL = "/chat";
export const GET_CHAT_ROOMS = `${CHAT_URL}/rooms`;
export const GET_CHAT_ROOM_MESSAGES = `${CHAT_URL}/messages`;
export const CREATE_CHAT_ROOM = `${CHAT_URL}/create-room`;
export const JOIN_CHAT_ROOM = `${CHAT_URL}/join-room`;
