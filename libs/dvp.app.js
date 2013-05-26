var dvp = {};
dvp.prepareMainView = function () {
    document.addEventListener('deviceready', deviceReadyListener, false);

    function deviceReadyListener(e) {
        e.preventDefault();
        var title='titulo';
        var message='mensaje';
        
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    }
};