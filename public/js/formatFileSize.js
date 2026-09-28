function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const kb = 1024;
  const sizes = ["B", "kB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(kb));
  return parseFloat((bytes / Math.pow(kb, i)).toFixed(1)) + " " + sizes[1];
}

module.exports = { formatFileSize };
