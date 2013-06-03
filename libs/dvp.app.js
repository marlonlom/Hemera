var dvp = {
    templates: {}
};
dvp.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
}
dvp.prepareMainView = function () {

    var searchMenu = [
        {
            label: 'Departamentos',
            hash: 'deptos'
        }, {
            label: '&Aacute;reas Metropolitanas',
            hash: 'amtrps'
        }, {
            label: 'Distritos',
            hash: 'dstrt'
        }, {
            label: 'Datos de interes',
            hash: 'about'
        }, {
            label: 'Cont&aacute;ctenos',
            hash: 'contact'
        }
    ];

    $('#scroller').html(this.templates.home({
        menu: searchMenu
    }));
};