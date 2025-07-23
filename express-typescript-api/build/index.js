"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const diaries_1 = __importDefault(require("./routes/diaries"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 8000;
app.use(express_1.default.json()); // middleware que transforma la req.body
app.use('/api/diaries', diaries_1.default);
app.get('/ping', (_, res) => {
    console.log('Someone pinged here!!');
    res.send('pong');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
