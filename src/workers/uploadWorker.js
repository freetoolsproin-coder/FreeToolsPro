self.onmessage = async (e) => {
  const { file } = e.data;

  // dummy processing
  self.postMessage({ success: true });
};
