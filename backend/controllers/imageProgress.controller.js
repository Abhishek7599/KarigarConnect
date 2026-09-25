const progressClients = new Set();

const imageProgress = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  progressClients.add(res);

  req.on("close", () => {
    progressClients.delete(res);
  });
};

const sendProgress = (data) => {
  const message = `data: ${JSON.stringify(data)}\n\n`;

  for (const client of progressClients) {
    client.write(message);
  }
};

module.exports = {
  imageProgress,
  sendProgress,
};