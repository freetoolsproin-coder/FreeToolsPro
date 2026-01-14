self.onmessage = async (e) => {
  const { file } = e.data;

  // Worker only prepares file buffer
  const buffer = await file.arrayBuffer();

  self.postMessage({
    name: file.name,
    size: file.size,
    buffer,
  });
};
