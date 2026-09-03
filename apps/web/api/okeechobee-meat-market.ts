import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";

import orderHandler from "../server/meat-market/order.js";
import sellerManageHandler from "../server/meat-market/seller-manage.js";
import squareConnectHandler from "../server/meat-market/square-connect.js";
import squareCallbackHandler from "../server/meat-market/square-callback.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const route = String(req.query?.route || "").trim();

  if (route === "order") {
    return orderHandler(req, res);
  }

  if (route === "seller-manage") {
    return sellerManageHandler(req, res);
  }

  if (route === "square-connect") {
    return squareConnectHandler(req, res);
  }

  if (route === "square-callback") {
    return squareCallbackHandler(req, res);
  }

  return res.status(404).json({
    ok: false,
    error: "Unknown Meat Market API route.",
  });
}
