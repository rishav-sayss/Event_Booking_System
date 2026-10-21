function logger(...args) {
  const ts = new Date().toISOString();
  console.log(`[${ts}]`, ...args);
}
logger.info = (...a) => logger('INFO ', ...a);
logger.error = (...a) => console.error(`[${new Date().toISOString()}] ERROR`, ...a);
logger.warn = (...a) => logger('WARN ', ...a);

module.exports = logger;
