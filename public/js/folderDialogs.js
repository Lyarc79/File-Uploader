const uploadFiledialog = document.getElementById("uploadFileDialog");
const editFolderDialog = document.getElementById("editFolderDialog");
const editFolderForm = document.getElementById("editFolderForm");
const editFolderInput = document.getElementById("editFolderInput");
const newFolderDialog = document.getElementById("newFolderDialog");

function openUploadFileDialog() {
  uploadFiledialog.showModal();
}
function closeUploadFileDialog() {
  uploadFiledialog.close();
}

function openNewFolderDialog() {
  newFolderDialog.showModal();
}
function closeNewFolderDialog() {
  newFolderDialog.close();
}

function openEditFolderDialog(folderId, folderName) {
  editFolderForm.action = `/folders/${folderId}/update`;
  editFolderInput.value = folderName;
  editFolderDialog.showModal();
}
function closeEditFolderDialog() {
  editFolderDialog.close();
}
