import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../prisma/db.setup";
import "express-async-errors";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { intParseableString as intParseableString } from "../zod/parseableString.schema";
import { authMiddleware, getDataFromAuthToken } from "../auth-utils";

const dogController = Router();
// TODO
// Needs ______?
dogController.get("/dogs", async (req, res) => {
	const dogs = await prisma.dog.findMany();
	return res.json(dogs);
});



// TODO
// Needs ______?
dogController.post(
	"/dogs",
	validateRequest({
		body: z.object({
			name: z.string(),
		}),
	}),
	authMiddleware,
	async (req, res) => {


		const { name } = req.body;
		/* const user = await prisma.user
			.findFirstOrThrow({
				where: {
					email: userFromJwt.email,
				},
			})
			.catch(() => null);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		} */

		const dog = await prisma.dog
			.create({
				data: {
					name,
					userEmail: req.user!.email,
				},
			})
			.catch(() => null);

		if (!dog) {
			return res.status(500).json({ message: "Dog not created" });
		}
		return res.json(dog);
	}
);

// TODO
// Needs ______?
dogController.patch(
	"/dogs/:dogId",
	validateRequest({
		body: z
			.object({
				name: z.string(),
				userEmail: z.string().email(),
			})
			.partial(),
		params: z.object({
			dogId: intParseableString,
		}),
	}),
	async (req, res, next) => {
		const dogId = parseInt(req.params.dogId);

		const doesDogExist = await prisma.dog
			.findFirstOrThrow({
				where: {
					id: dogId,
				},
			})
			.then(() => true)
			.catch(() => false);

		if (!doesDogExist) {
			return res.status(404).json({ message: "Dog not found" });
		}

		return await prisma.dog
			.update({
				where: {
					id: dogId,
				},
				data: {
					...req.body,
				},
			})
			.then((dog) => res.status(201).json({ ...dog }))
			.catch(() =>
				res.status(500).json({ message: "Dog not updated" })
			);
	}
);

// TODO
// Needs _____?
dogController.delete(
	"/dogs/:dogId",
	validateRequest({
		params: z.object({
			dogId: intParseableString,
		}),
	}),
	async (req, res) => {
		await prisma.dog
			.delete({
				where: {
					id: parseInt(req.params.dogId),
				},
			})
			.then(() => res.status(201).json({ message: "Dog deleted" }))
			.catch(() =>
				res.status(500).json({ message: "Dog not deleted" })
			);
	}
);

export { dogController };
