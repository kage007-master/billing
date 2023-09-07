import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!);
    req.user = decoded;
    next();
  } catch (e: any) {
    console.log(e.message);
    res.status(401).json({ msg: "Token is not valid " });
  }
};

export default authMiddleware;
