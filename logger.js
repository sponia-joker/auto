import log4js from "log4js";

log4js.configure({
  appenders: {
    out: { type: "stdout" },
    app: {
      type: "dateFile",
      filename: "wantai.log",
      pattern: ".yyyy-MM-dd-hh",
      compress: true,
    },
  },
  categories: {
    default: { appenders: ["out", "app"], level: "debug" },
  },
});

const logger = log4js.getLogger("Listening");

export default logger;



// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");
