const EXTENSION_FOLDER_DIR = 'Read Later';
const INSTALL_REASON       = 'install';
const OTHER_BOOKMARKS_ID   = '2';

function addBookmark({url, title}, sendResponse) {
    chrome.bookmarks.get(OTHER_BOOKMARKS_ID, (otherBookmarksNodeArr) => {
        findExtensionBookmarkDirId(otherBookmarksNodeArr).then((extensionBookmarkDirId) => {
            chrome.bookmarks.create({
                parentId: extensionBookmarkDirId,
                          title,
                          url
            });

            sendResponse({success: true, url, title});
        })
    })
}

function findExtensionBookmarkDirId(otherBookmarksDirNode) {
    return new Promise((resolve, reject) => {
        const otherBookmarksNode = Array.isArray(otherBookmarksDirNode) ? otherBookmarksDirNode[0] : otherBookmarksDirNode;

        chrome.bookmarks.getChildren(otherBookmarksNode.id, (children) => {
            const readLaterFolder = children.find((bookmarkNode) => {
                return bookmarkNode.title === EXTENSION_FOLDER_DIR;
            });
            if (readLaterFolder) {
                resolve(readLaterFolder.id);
            } else {
                reject('not found');
            }
        });
    });
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === INSTALL_REASON) {
        chrome.bookmarks.get(OTHER_BOOKMARKS_ID, (otherBookmarks) => {
            findExtensionBookmarkDirId(otherBookmarks).catch((notFoundReason) => {
                console.log(notFoundReason);
                chrome.bookmarks.create({parentId: OTHER_BOOKMARKS_ID, title: EXTENSION_FOLDER_DIR})
            });
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case 'ADD_BOOKMARK':
            addBookmark(request, sendResponse);
            return;
    }

    sendResponse({success: false});
});
