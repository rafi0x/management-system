const utilites = {};

utilites.errorMsgFormatter = (error) => error.msg;

utilites.randomTextGen = (strlength) => {
  const newlngth =
    typeof strlength === "number" && strlength > 0 ? strlength : false;
  if (newlngth) {
    const stringStorage =
      "ZeXrCtAyCSu4D5FfgGxVqBHNwM6J7vK3zLbpQa8W9hEioRklTdYs1U2IjcOnPm";
    let output = "";
    for (let i = 1; i <= newlngth; i += 1) {
      output += stringStorage.charAt(Math.floor(Math.random() * newlngth));
    }
    return output;
  }
  return false;
};

utilites.encryptData = (text) => {
  const buff = Buffer.from(text, "utf-8");
  const encoded = buff.toString("hex");
  return encoded;
};
utilites.decryptData = (hash) => {
  const buff = Buffer.from(hash, "hex");
  const decoded = buff.toString("utf-8");
  return decoded;
};

utilites.inputFilter = (str) => {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

module.exports = utilites;

// const crypto = require("crypto");
// const algorithm = "aes-256-cbc";
// const initVector = crypto.randomBytes(16);

// utilites.encryptData = (text) => {
//   const cipher = crypto.createCipheriv(
//     algorithm,
//     process.env.SECRET_KEY,
//     initVector
//   );

//   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

//   return {
//     initVector: initVector.toString("hex"),
//     content: encrypted.toString("hex"),
//   };
// };

// utilites.decryptData = (hash) => {
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     process.env.SECRET_KEY,
//     Buffer.from(hash.initVector, "hex")
//   );

//   const decrpyted = Buffer.concat([
//     decipher.update(Buffer.from(hash.content, "hex")),
//     decipher.final(),
//   ]);

//   return decrpyted.toString();
// };
