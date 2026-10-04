import { $step } from "./private";
import { changeChatClicked, credentialsSubmitted, logoutClicked, phoneSubmitted } from "../../../features/chat/model/private";

$step
    .on(phoneSubmitted, () => 'chat')
    .on([credentialsSubmitted, changeChatClicked], () => 'phone')
    .on(logoutClicked, () => 'credentials')