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
            label: 'Áreas Metropolitanas',
            hash: 'amtrps'
        }, {
            label: 'Distritos',
            hash: 'dstrt'
        }, {
            label: 'Datos de interes',
            hash: 'about'
        }, {
            label: 'Contáctenos',
            hash: 'contact'
        }
    ];

    $('body').html(this.templates.home({
        upperTip: "Seleccione por código",
        menu: searchMenu
    }));
    
    $('body').on('click','li.home-menu-item',function(e){
        e.preventDefault();
        var hash = $(this).attr('data-home-link') || 'nah';
        alert('view ' + hash);
    });
};