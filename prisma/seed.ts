import { encryptPassword } from "../src/auth-utils";
import { prisma } from "./db.setup";

const clearDb = async () => {
	await prisma.dog.deleteMany();
	await prisma.user.deleteMany();
};

const seed = async () => {
	console.log("Seeding the database...");
	await clearDb();

	// Create Jon
	const jon = await prisma.user.create({
		data: {
			email: "jon@jon.com",
			passwordHash: await encryptPassword("jon_password")
		},
	});
	// create peter
	const peter = await prisma.user.create({
		data: { 
			email: "peter@peter.com",
			passwordHash: await encryptPassword("peter_password")

		}, 
	});

	// create doomslayer
	const doomslayer = await prisma.dog.create({
		data: {
			name: "Doomslayer",
			userEmail: jon.email,
		},
	});
	// create zoey
	const zoey = await prisma.dog.create({
		data: {
			name: "Zoey",
			userEmail: jon.email,
		},
	});

	// create whiskey
	const whiskey = await prisma.dog.create({
		data: {
			name: "Whiskey",
			userEmail: peter.email,
		},
	});
	// create poof
	const poofy = await prisma.dog.create({
		data: {
			name: "Poofy",
			userEmail: peter.email,
		},
	});
};

seed()
	.then(() => {
		console.log("Seeding complete");
	})
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
