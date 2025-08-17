import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export async function getClientDetails(req) {
  // 1 - get ip
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;

  // 2 - lookup location
  const geo = geoip.lookup(ip) || {};
  // 3 - parse user agent
  const ua = new UAParser(req.headers["user-agent"]);

  return {
    deviceInfo: {
      browser: {
        name: ua.getBrowser().name || null,
        version: ua.getBrowser().version || null,
      },
      os: {
        name: ua.getOS().name || null,
        version: ua.getOS().version || null,
      },
      device: {
        type: ua.getDevice().type || "desktop",
        brand: ua.getDevice().vendor || null,
        model: ua.getDevice().model || null,
      },
    },
    location: {
      ip,
      city: geo.city || null,
      country: geo.country || null,
      timezone: geo.timezone || null,
    },
  };
}
