import { io } from "socket.io-client";
const socket = io.connect("https://e4d2-142-189-222-79.ngrok-free.app");
export default socket;