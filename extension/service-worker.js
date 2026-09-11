/**
 * Site Scout — Background Service Worker (Manifest V3)
 * Manages badge indicators and tab messaging.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("Site Scout Extension installed successfully.");
  chrome.action.setBadgeText({ text: "" });

  // Create context menu for right-clicking any link or page
  chrome.contextMenus.create({
    id: "site-scout-inspect-link",
    title: "Inspect Website with Site Scout",
    contexts: ["link", "selection"]
  });
});

// Update badge text per tab
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "UPDATE_BADGE" && sender.tab && sender.tab.id) {
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: message.text || "",
    });
    if (message.color) {
      chrome.action.setBadgeBackgroundColor({
        tabId: sender.tab.id,
        color: message.color,
      });
    }
  }
});

// Handle Context Menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "site-scout-inspect-link") {
    const targetUrl = info.linkUrl || info.selectionText;
    if (targetUrl) {
      // Store in storage so popup can open directly with this URL
      chrome.storage.local.set({ pendingInspectUrl: targetUrl }, () => {
        if (tab && tab.id) {
          chrome.action.openPopup?.();
        }
      });
    }
  }
});
