import jwt  from "jsonwebtoken";

const data = {
	name: "Jon",
}

const myJwt = jwt.sign(data, "super-secret");

console.log({myJwt})