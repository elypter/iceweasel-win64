function onCreated() {
 if (browser.runtime.lastError) {
  console.log(`Error: ${browser.runtime.lastError}`);
 } else {
  console.log("Item created successfully");
 }
}

browser.menus.create({
 id: "IceDownload",
 title: "[GIT Releases] Download the latest version",
 contexts: ["tools_menu"],
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
 switch (info.menuItemId) {
 case "IceDownload":
  getCurrentInfo().then(currentInfo => {
   return getUpdateInfo(currentInfo.name, currentInfo.os, currentInfo.locale)
   .then(updateInfo => {
    if (currentInfo.version < updateInfo.version) {
     return openUpdateFile(updateInfo.url);
    } else
     return Promise.reject('No updates found');
   });
  }).catch(err => {
   console.log(err);
  });
  break;
 }
});

function openUpdateFile(url) {
 return browser.tabs.create({
  url: url,
 });
}

function getUpdateInfo(name, os, locale) {
 return fetch('https://raw.githubusercontent.com/muslayev/iceweasel-win64/master/update.json').then(response => response.json())
 .then(json => json[name][os][locale]);
}

function getCurrentInfo() {
 return browser.runtime.getBrowserInfo().then(browserInfo => {
  return browser.runtime.getPlatformInfo().then(platformInfo => {
   return {
    name: browserInfo.name,
    os: platformInfo.os + '_' + platformInfo.arch,
    locale: chrome.i18n.getUILanguage(),
    version: browserInfo.version,
   };
  });
 });
}
