const { copyFile, readFile } = require("fs/promises")
const { join } = require("path");
const idl = require("../target/idl/hackathon.json");
const { writeFile } = require("fs/promises");

async function main() {
  await copyFile(join(__dirname, "..", "facto-keypair.json"), join(__dirname, "..", "target/deploy/hackathon-keypair.json"))
  await copyFile(join(__dirname, "..", "target/types/hackathon.ts"), join(__dirname, "..", "app/src/lib/idl/facto-idl-types.ts"))
  const dotenv = await readFile(join(__dirname, "..", ".env"), 'utf-8');
  const programId = dotenv.split("=")[1];
  idl.metadata = programId
  await writeFile(join(__dirname, "..", "app/src/lib/idl/idl-facto.json"), JSON.stringify(idl));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });