
import bcrypt from "bcryptjs";

const password = "admin12345";

const run = async () => {
  const hashed = await bcrypt.hash(password, 12);
  console.log(hashed);
};

run();

$2b$12$MF.yOW5856Yw4yARR7vfyeh31WIA4pJfGX8KxmlOF2/eAf5h0WeFK