var dvp = {
    templates: {}
};
dvp.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    this.templates.level01 = Handlebars.compile($("#hbt-level01").html());
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

    $('body').on('click', 'li.home-menu-item', function (e) {
        e.preventDefault();
        var hash = $(this).attr('data-home-link') || 'nah';
        dvp.changeView(hash);
    });
};
dvp.changeView = function (hash, parent) {
    if (hash === 'deptos') {
        dvp.prepareDeptosMainView();
    } else if (hash === 'amtrps') {
        dvp.prepareAreasMetropsMainView();
    } else if (hash === 'dstrt') {
        dvp.prepareDistrtsMainView();
    }
}
dvp.prepareDeptosMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por departamento",
        tip_bog: "Nota: No se debe tener en cuenta a Bogotá D.C. como departamento.",
        list: data.departamentos
    }));
}
dvp.prepareAreasMetropsMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por área metropolitana",
        list: data.areasmetrop,
        ncod: true
    }));
}
dvp.prepareDistrtsMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por distritos",
        list: data.distritos,
        ncod: true
    }));
}