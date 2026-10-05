let uploadFiledialog;
let editFolderDialog;
let editFolderForm;
let editFolderInput;
let newFolderDialog;

document.addEventListener("DOMContentLoaded", () => {
  uploadFiledialog = document.getElementById("uploadFileDialog");
  editFolderDialog = document.getElementById("editFolderDialog");
  editFolderForm = document.getElementById("editFolderForm");
  editFolderInput = document.getElementById("editFolderInput");
  newFolderDialog = document.getElementById("newFolderDialog");
  if (newFolderDialog && newFolderDialog.dataset.openOnError === "true") {
    openNewFolderDialog();
    window.history.replaceState({}, document.title, "/");
  }
});

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
  newFolderDialog.removeAttribute("data-open-on-error");
}

function openEditFolderDialog(folderId, folderName) {
  editFolderForm.action = `/folders/${folderId}/update`;
  editFolderInput.value = folderName;
  editFolderDialog.showModal();
}
function closeEditFolderDialog() {
  editFolderDialog.close();
}
