import express from "express";
import { dogController } from "./router/dog.router";
import { userController } from "./router/user.router";
import "express-async-errors";
import { authController } from "./router/auth.router";
import { User } from "@prisma/client";

const app = express();
declare global {
	namespace Express {
		interface Request {
			user?: User
		}
	}
}
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World");
});
app.use(dogController);
app.use(userController);
app.use(authController)

app.listen(3000, () => console.log("Connected"))
