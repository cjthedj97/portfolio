function updateYear() {
    var year = new Date().getFullYear();
    var copyrightElement = document.getElementById("copyright");
    copyrightElement.innerHTML = "&copy; " + year + " Christopher Saathoff";
  }
