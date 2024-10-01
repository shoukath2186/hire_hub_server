"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adminRouter_1 = __importDefault(require("../routes/adminRouter"));
const usersRouter_1 = __importDefault(require("../routes/usersRouter"));
const JobRouter_1 = __importDefault(require("../routes/JobRouter"));
const profileRouter_1 = __importDefault(require("../routes/profileRouter"));
const messageRouter_1 = __importDefault(require("../routes/messageRouter"));
const graphRouter_1 = __importDefault(require("../routes/graphRouter"));
const app = (0, express_1.default)();
//parce json bodys
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// cookie parser
app.use((0, cookie_parser_1.default)());
//cors
const allowedOrigins = [
    'https://hire-hub-admin.vercel.app',
    'https://hire-hub-user-side.vercel.app'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
// Routes
app.use("/user", usersRouter_1.default);
app.use('/admin', adminRouter_1.default);
app.use('/job', JobRouter_1.default);
app.use('/profile', profileRouter_1.default);
app.use("/chat", messageRouter_1.default);
app.use('/graph', graphRouter_1.default);
exports.default = app;
