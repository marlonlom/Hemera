var dvp = {};
dvp.prepareMainView = function () {
        var title='titulo';
        var message='mensaje';
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title + ": " + message);
        }
    }
};
