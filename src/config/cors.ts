import cors from "cors";

export const corsSetup = cors({
  origin: (origin: string | undefined, callback: (arg0: Error | null, arg1?: boolean) => void) => {
    let string = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.trim() : "*";
    string = string.split(" ").join("");
    const whiteListURIs = string.split(",");
    if (!origin || whiteListURIs.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // callback(new Error("Not allowed by CORS"))
      callback(null, true);
    }
  },
});
