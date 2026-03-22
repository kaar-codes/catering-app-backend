const fs = await import("node:fs");
const path = await import("node:path");
// const MenuModal = await import("../models/m--enuModel.js");
const mongoose = await import("mongoose");
const dotenv = await import("dotenv");
dotenv.config();

async function allMenusToDB() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), "data/menus"));
    await mongoose.connect(process.env.DB_CONN);
    console.log(files);

    // const allMenus = await Promise.all(
    //   files.map(async (file) => {
    //     const fileUrl = path.join(process.cwd(), "data/menus", file);
    //     const data = JSON.parse(await fs.readFile(fileUrl, "utf-8"));
    //     for (const datum of data) {
    //       console.log(datum);
    //     }
    //   }),
    // );

    console.log("All the products from the List got updated");
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteAllMenusFromDB() {
  await mongoose.connect(process.env.DB_CONN);
  await MenuModel.deleteMany();
  console.log("Menu is deleted from the DB");
}
