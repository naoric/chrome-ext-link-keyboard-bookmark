const S_KEY            = 83;
const BOOKMARKED_CLASS = 'bookmarked';
const $document        = $(document);

let $currentLinkElement = null;

$document.on('keydown', linkKeyDownListener);

$document.on('mouseenter', 'a', function mouseEnterHandler() {
    $currentLinkElement = $(this);
});

$document.on('mouseleave', 'a', () => {
    $currentLinkElement = null;
});

function linkKeyDownListener(event) {
    if (!($currentLinkElement && isActivationKeyCombination(event))) {
        return;
    }
    $currentLinkElement.addClass(BOOKMARKED_CLASS);
    setTimeout(function ($linkElement) {
        $linkElement.removeClass(BOOKMARKED_CLASS);
    }.bind(null, $currentLinkElement), 700);

    chrome.runtime.sendMessage({type: 'ADD_BOOKMARK', title: $currentLinkElement.text(), url: $currentLinkElement.get(0).href}, (response) => {
        console.log(response);
    });
}

function isActivationKeyCombination(event) {
    const isActivationKeys = event.which === S_KEY && event.ctrlKey;

    return isActivationKeys;
}